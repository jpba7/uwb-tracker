import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';

const Heatmap = React.memo(({ employee_cpf = null, start_date = null, end_date = null}) => {
  const [XYD, setXYD] = useState([]);
    
    useEffect(() => {
      const params = new URLSearchParams();
      
      if (employee_cpf) params.append('cpf', employee_cpf);
      if (start_date) params.append('start_date', start_date);
      if (end_date) params.append('end_date', end_date);

      const url = `/devices/datapoints/heatmap${params.toString() ? `?${params}` : ''}`;
      
      fetch(url)
        .then(response => response.json())
        .then(data => {
          const heatmapData = data.xyd.map(item => [item[0], item[1], item[2]]);
          setXYD(heatmapData);
        })
        .catch(error => console.error('Error fetching data:', error));
    }, [employee_cpf, start_date, end_date]);
  
  const generateAxisData = (start, end, step) => {
    const data = [];
    for (let i = start; i <= end; i += step) {
      // Arredonda para 1 casa decimal para evitar problemas de precisão
      data.push(Number(i.toFixed(1)));
    }
    return data;
  };

  const xAxisData = generateAxisData(0, 21, 1);
  const yAxisData = generateAxisData(0, 20, 1);

  const option = {
    grid: {
      left: '10%',
      right: '10%',
      bottom: '30%',
      top: '5%'
    },
    tooltip: {
      position: 'top',
      formatter: function (params) {
        return `X: ${params.data[0]}m\nY: ${params.data[1]}m\nProbabilidade: ${(params.data[2]).toFixed(3)}%`;
      }
    },
    xAxis: {
      type: 'category',
      data: xAxisData,
      name: 'X (m)',
      nameLocation: 'middle',
      nameGap: 25,
    },
    yAxis: {
      type: 'category',
      data: yAxisData,
      name: 'Y (m)',
      nameLocation: 'middle',
      nameGap: 40,
    },
    visualMap: {
      min: 0,
      max: 0.15,
      formatter: (value) => value.toFixed(3),
      calculable: true,
      realtime: false,
      left: 'center',
      orient: 'horizontal',
      inRange: {
        color: [
          '#313695',
          '#4575b4',
          '#74add1',
          '#abd9e9',
          '#e0f3f8',
          '#ffffbf',
          '#fee090',
          '#fdae61',
          '#f46d43',
          '#d73027',
          '#a50026'
        ]
      }
    },
    series: [
      {
        name: 'Gaussian',
        type: 'heatmap',
        data: XYD,
        emphasis: {
          itemStyle: {
            borderColor: '#333',
            borderWidth: 1
          }
        },
        progressive: 1000,
        animation: false
      }
    ]
  };
  return <ReactECharts option={option} opts={{ renderer: 'svg' }} />;
});

export default Heatmap;