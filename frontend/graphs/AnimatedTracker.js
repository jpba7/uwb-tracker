import React, { useEffect, useState, useRef } from 'react';
import { CircularProgress, Slider, Typography, Box, Button } from '@mui/material';
import * as echarts from 'echarts';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

const AnimatedTracker = React.memo(({ 
  employee_id = null, 
  start_date = null, 
  end_date = null,
  realtime = false
}) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [data, setData] = useState(null);
  const [realtimeData, setRealtimeData] = useState(null);
  const [currentTimeIndex, setCurrentTimeIndex] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true); 
  const [initialLoading, setInitialLoading] = useState(true); // Novo estado para controlar apenas o carregamento inicial
  const animationRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(500);
  const realtimeIntervalRef = useRef(null);

  // Função para carregar dados históricos
  useEffect(() => {
    if (realtime) {
      if (data) {
        // Se mudar para realtime, mantém os dados históricos carregados
        setInitialLoading(false);
        setLoading(false);
      }
      return;
    }
    
    setLoading(true);
    setInitialLoading(true);
    const params = new URLSearchParams();
    
    if (employee_id) params.append('id', employee_id);
    if (start_date) params.append('start_date', start_date);
    if (end_date) params.append('end_date', end_date);

    fetch(`/devices/datapoints/tracker${params.toString() ? `?${params}` : ''}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Erro ao carregar os dados de rastreamento.');
        }
        return response.json();
      })
      .then(responseData => {
        if (responseData.length === 0) {
          throw new Error('Nenhum dado de rastreamento encontrado para o período selecionado.');
        }
        setData(responseData);
        setError(null);
      })
      .catch(err => {
        setError(err.message);
        setData(null);
      })
      .finally(() => {
        setLoading(false);
        setInitialLoading(false);
      });
  }, [employee_id, start_date, end_date, realtime]);

  // Nova função para polling de dados em tempo real
  useEffect(() => {
    if (!realtime) return;
    
    // Se estamos mudando para realtime, apenas fazemos a primeira requisição com loading
    if (!realtimeData) {
      setLoading(true);
    }
    
    const fetchLastPosition = () => {
      const params = new URLSearchParams();
      
      if (employee_id) params.append('id', employee_id);

      fetch(`/devices/datapoints/last-position${params.toString() ? `?${params}` : ''}`)
        .then(response => {
          if (!response.ok) {
            throw new Error('Erro ao carregar a posição atual.');
          }
          return response.json();
        })
        .then(responseData => {
          setRealtimeData(responseData);
          setError(null);
          setLoading(false);
          setInitialLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setRealtimeData(null);
          setLoading(false);
          setInitialLoading(false);
        });
    };

    // Executa imediatamente e depois a cada 5 segundos
    fetchLastPosition();
    realtimeIntervalRef.current = setInterval(fetchLastPosition, 5000);

    return () => {
      clearInterval(realtimeIntervalRef.current);
    };
  }, [employee_id, realtime]);

  // Inicializa o gráfico apenas uma vez quando os dados ou o chartRef estiverem disponíveis
  useEffect(() => {
    // Só inicializa o gráfico quando temos dados (histórico ou realtime) e o ref do elemento
    if (chartRef.current && !chartInstance.current && 
        ((data && !realtime) || (realtimeData && realtime))) {
      
      const chart = echarts.init(chartRef.current);
      chartInstance.current = chart;

      // Configuração inicial
      const option = {
        backgroundColor: '#fff',
        grid: {
          left: 10,
          right: 10,
          top: 10,
          bottom: 10,
          containLabel: false
        },
        xAxis: {
          type: 'value',
          show: false,
          min: -2,
          max: 7 
        },
        yAxis: {
          type: 'value',
          show: false,
          min: 0,
          max: 6
        },
        graphic: [{
          type: 'image',
          style: {
            image: '/static/images/planta_labair.png',
          },
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          z: -10,
        }],
        series: [{
          type: 'scatter',
          data: realtime 
            ? [[realtimeData.x, realtimeData.y]] 
            : [[data[currentTimeIndex].x, data[currentTimeIndex].y]],
          symbolSize: 20,
          itemStyle: {
            color: '#f00',
            opacity: 1
          }
        }]
      };

      chart.setOption(option);

      // Adiciona listener de redimensionamento
      const resizeHandler = () => {
        chart.resize();
      };
      
      window.addEventListener('resize', resizeHandler);
      
      return () => {
        window.removeEventListener('resize', resizeHandler);
        if (chartInstance.current) {
          chartInstance.current.dispose();
          chartInstance.current = null;
        }
      };
    }
  }, [data, realtimeData, currentTimeIndex, realtime]);

  // Atualiza apenas a posição do ponto (separado da inicialização do gráfico)
  useEffect(() => {
    if (!chartInstance.current) return; 
    if (realtime && !realtimeData) return;
    if (!realtime && (!data || currentTimeIndex >= data.length)) return;
    
    // Apenas atualiza a posição do ponto, não recria o gráfico
    chartInstance.current.setOption({
      series: [{
        data: realtime 
          ? [[realtimeData.x, realtimeData.y]] 
          : [[data[currentTimeIndex].x, data[currentTimeIndex].y]]
      }]
    });
  }, [data, realtimeData, currentTimeIndex, realtime]);

  // Quando mudar entre modos, recriamos o gráfico
  useEffect(() => {
    return () => {
      // Limpeza quando o componente é desmontado ou quando o modo muda
      if (chartInstance.current) {
        chartInstance.current.dispose();
        chartInstance.current = null;
      }
    };
  }, [realtime]); // Depende apenas da mudança de modo

  // Animação para modo histórico
  useEffect(() => {
    if (!data || !isPlaying || realtime) return;

    const animate = () => {
      setCurrentTimeIndex(prev => {
        if (prev >= data.length - 1) {
          return 0;
        }
        return prev + 1;
      });
      animationRef.current = setTimeout(() => requestAnimationFrame(animate), animationSpeed);
    };

    animationRef.current = setTimeout(() => requestAnimationFrame(animate), animationSpeed);

    return () => {
      if (animationRef.current) {
        clearTimeout(animationRef.current);
      }
    };
  }, [data, isPlaying, animationSpeed, realtime]);

  const handleSliderChange = (_, value) => {
    if (animationRef.current) {
      clearTimeout(animationRef.current);
    }
    setCurrentTimeIndex(value);
    setIsPlaying(false)
  };

  const togglePlayPause = () => {
    setIsPlaying(prev => !prev);
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const hoje = new Date();
    const horas = date.getHours().toString().padStart(2, '0');
    const minutos = date.getMinutes().toString().padStart(2, '0');
    const segundos = date.getSeconds().toString().padStart(2, '0');
    
    // Verifica se é o mesmo dia
    const mesmoAno = date.getFullYear() === hoje.getFullYear();
    const mesmoMes = date.getMonth() === hoje.getMonth();
    const mesmoDia = date.getDate() === hoje.getDate();
    
    if (mesmoAno && mesmoMes && mesmoDia) {
      return `${horas}:${minutos}:${segundos}`;
    } else {
      const dia = date.getDate().toString().padStart(2, '0');
      const mes = (date.getMonth() + 1).toString().padStart(2, '0');
      const ano = date.getFullYear();
      return `${horas}:${minutos}:${segundos} ${dia}/${mes}/${ano}`;
    }
  };

  return (
    <div style={{ 
      width: '755px', 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      border: '1px solid #eee',
      borderRadius: '8px',
      overflow: 'visible'
    }}>
      {initialLoading ? (
        <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <CircularProgress color="primary" />
        </div>
      ) : error ? (
        <div style={{ 
          padding: '20px', 
          textAlign: 'center',
          color: '#666',
          fontSize: '1.2em'
        }}>
          {error}
        </div>
      ) : (
        <>
          <div ref={chartRef} style={{ flex: 1, minHeight: '576px', minWidth: '755px' }} />
          {!realtime && data && (
            <Box sx={{ padding: '10px 20px' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                <Typography variant="body2">
                  {data && currentTimeIndex < data.length && 
                    `Horário: ${formatTimestamp(data[currentTimeIndex].timestamp)}`}
                </Typography>
                <Button 
                  variant="contained" 
                  size="small" 
                  onClick={togglePlayPause}
                  startIcon={isPlaying ? <PauseIcon /> : <PlayArrowIcon />}
                >
                  {isPlaying ? 'Pausar' : 'Reproduzir'}
                </Button>
              </Box>
              
              <Slider
                min={0}
                max={data ? data.length - 1 : 0}
                value={currentTimeIndex}
                onChange={handleSliderChange}
                valueLabelDisplay="auto"
                valueLabelFormat={value => data ? formatTimestamp(data[value].timestamp) : ''}
              />
            </Box>
          )}
          {realtime && realtimeData && (
            <Box sx={{ padding: '10px 20px' }}>
              <Typography variant="body2" sx={{ textAlign: 'center' }}>
                Última atualização: {formatTimestamp(realtimeData.timestamp)}
              </Typography>
            </Box>
          )}
        </>
      )}
    </div>
  );
});

export default AnimatedTracker;
