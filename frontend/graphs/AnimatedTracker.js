import React, { useEffect, useState, useRef } from 'react';
import { CircularProgress, Slider, Typography, Box, Button } from '@mui/material';
import * as echarts from 'echarts';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PauseIcon from '@mui/icons-material/Pause';

const AnimatedTracker = React.memo(({ employee_id = null, start_date = null, end_date = null }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [data, setData] = useState(null);
  const [currentTimeIndex, setCurrentTimeIndex] = useState(0);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const animationRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);
  const [animationSpeed, setAnimationSpeed] = useState(500); // ms entre frames (mais lento)

  // Função para carregar dados
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    
    if (employee_id) params.append('id', employee_id);
    if (start_date) params.append('start_date', start_date);
    if (end_date) params.append('end_date', end_date);

    fetch(`/devices/datapoints/animation${params.toString() ? `?${params}` : ''}`)
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
      });
  }, [employee_id, start_date, end_date]);

  // Inicializa o gráfico apenas uma vez quando os dados são carregados
  useEffect(() => {
    if (!data || !chartRef.current) return;

    // Limpa qualquer gráfico existente
    if (chartInstance.current) {
      chartInstance.current.dispose();
      chartInstance.current = null;
    }

    // Certifique-se de que o DOM está pronto e tem dimensões
    const initChart = () => {
      if (!chartRef.current) return;
      
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
          min: 0,
          max: 200  // Ajuste conforme as dimensões reais do seu mapa
        },
        yAxis: {
          type: 'value',
          show: false,
          min: 0,
          max: 100  // Ajuste conforme as dimensões reais do seu mapa
        },
        graphic: [{
          type: 'image',
          style: {
            image: '/static/images/planta_baixa.png',
          },
          left: 0,
          right: 0,
          top: 0,
          bottom: 0,
          z: -10,
        }],
        series: [{
          type: 'scatter',
          data: [[data[currentTimeIndex].x, data[currentTimeIndex].y]],
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
        chart.dispose();
      };
    };

    // Usar setTimeout para garantir que o DOM esteja pronto
    setTimeout(initChart, 100); // Aumentado para 100ms para garantir que o DOM esteja pronto
  }, [data]);

  // Apenas atualiza os dados do gráfico existente quando currentTimeIndex muda
  useEffect(() => {
    if (!data || !chartInstance.current) return;
    
    // Apenas atualiza os dados, sem recriar o gráfico
    chartInstance.current.setOption({
      series: [{
        type: 'scatter',
        data: [[data[currentTimeIndex].x, data[currentTimeIndex].y]]
      }]
    });
  }, [data, currentTimeIndex]);

  // Animação
  useEffect(() => {
    if (!data || !isPlaying) return;

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
  }, [data, isPlaying, animationSpeed]);

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
    return date.toLocaleTimeString();
  };

  return (
    <div style={{ 
      width: '843px', 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      border: '1px solid #eee',
      borderRadius: '8px',
      overflow: 'visible'
    }}>
      {loading ? (
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
          <div ref={chartRef} style={{ flex: 1, minHeight: '565px', minWidth: '843px' }} />
          {data && (
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
        </>
      )}
    </div>
  );
});

export default AnimatedTracker;
