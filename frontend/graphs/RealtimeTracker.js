import React, { useEffect, useState, useRef } from 'react';
import { CircularProgress, Typography, Box } from '@mui/material';
import * as echarts from 'echarts';

const RealtimeTracker = React.memo(() => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const realtimeIntervalRef = useRef(null);

  // Gera cores diferentes para cada dispositivo
  const generateColor = (index) => {
    const colors = [
      '#f44336', '#e91e63', '#9c27b0', '#673ab7', '#3f51b5',
      '#2196f3', '#03a9f4', '#00bcd4', '#009688', '#4caf50',
      '#8bc34a', '#cddc39', '#ffeb3b', '#ffc107', '#ff9800',
      '#ff5722', '#795548', '#607d8b'
    ];
    
    return colors[index % colors.length];
  };

  // Função para carregar dados em tempo real de todos os dispositivos
  useEffect(() => {
    const fetchAllPositions = () => {
      fetch('/devices/datapoints/last-position-today')
        .then(response => {
          if (!response.ok) {
            throw new Error('Erro ao carregar as posições atuais.');
          }
          return response.json();
        })
        .then(responseData => {
          setData(responseData);
          setError(null);
          setLoading(false);
        })
        .catch(err => {
          setError(err.message);
          setData(null);
          setLoading(false);
        });
    };

    // Executa imediatamente e depois a cada 5 segundos
    fetchAllPositions();
    realtimeIntervalRef.current = setInterval(fetchAllPositions, 5000);

    return () => {
      clearInterval(realtimeIntervalRef.current);
    };
  }, []);

  // Inicializa e atualiza o gráfico quando os dados são carregados
  useEffect(() => {
    if (!chartRef.current || !data || data.length === 0) return;
    
    if (!chartInstance.current) {
      const chart = echarts.init(chartRef.current);
      chartInstance.current = chart;

      // Configuração inicial
      const option = {
        backgroundColor: '#fff',
        tooltip: {
          trigger: 'item',
          formatter: function(params) {
            const device = data[params.dataIndex];
            return `<strong>Funcionário:</strong> ${(device.linked_employee === 'None'? 'Sem funcionário associado' : device.linked_employee) || 'N/A'}<br/>
                    <strong>Dispositivo:</strong> ${device.device_name || 'N/A'}`;
          }
        },
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
          max: 200 
        },
        yAxis: {
          type: 'value',
          show: false,
          min: 0,
          max: 100
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
          data: data.map(device => [device.x, device.y]),
          symbolSize: 20,
          itemStyle: {
            color: function(params) {
              return generateColor(params.dataIndex);
            }
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
      };
    } else {
      // Apenas atualiza os dados sem recriar o gráfico
      chartInstance.current.setOption({
        series: [{
          data: data.map(device => [device.x, device.y])
        }]
      });
    }
  }, [data]);

  // Limpar o gráfico quando o componente for desmontado
  useEffect(() => {
    return () => {
      if (chartInstance.current) {
        chartInstance.current.dispose();
        chartInstance.current = null;
      }
    };
  }, []);

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    const date = new Date(timestamp);
    const hoje = new Date();
    const horas = date.getHours().toString().padStart(2, '0');
    const minutos = date.getMinutes().toString().padStart(2, '0');
    const segundos = date.getSeconds().toString().padStart(2, '0');
    
    if (date.getDate() === hoje.getDate() && 
        date.getMonth() === hoje.getMonth() && 
        date.getFullYear() === hoje.getFullYear()) {
      return `${horas}:${minutos}:${segundos}`;
    } else {
      const dia = date.getDate().toString().padStart(2, '0');
      const mes = (date.getMonth() + 1).toString().padStart(2, '0');
      return `${horas}:${minutos}:${segundos} ${dia}/${mes}`;
    }
  };

  return (
    <div style={{ 
      width: '100%', 
      height: '620px', 
      display: 'flex', 
      flexDirection: 'column',
      border: '1px solid #eee',
      borderRadius: '8px',
      overflow: 'hidden'
    }}>
      {loading && !data ? (
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
          <div ref={chartRef} style={{ flex: 1, minHeight: '500px', maxHeight:'700px', width: '100%' }} />
          {data && data.length > 0 && (
            <Box sx={{ padding: '10px 20px' }}>
              <Typography variant="body2" sx={{ textAlign: 'center' }}>
                Última atualização: {formatTimestamp(data[0]?.timestamp)}
              </Typography>
            </Box>
          )}
        </>
      )}
    </div>
  );
});

export default RealtimeTracker;
