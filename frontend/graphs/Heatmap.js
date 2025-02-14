import React, { useEffect, useState } from 'react';
import ReactECharts from 'echarts-for-react';

const Heatmap = ({ xyd_data }) => {
  const generateAxisData = (start, end, step) => {
    const data = [];
    for (let i = start; i <= end; i += step) {
      // Arredonda para 1 casa decimal para evitar problemas de precisão
      data.push(Number(i.toFixed(1)));
    }
    return data;
  };

  useEffect(() => {
    console.log("Dados do heatmap:");
    console.log("Número total de pontos:", xyd_data.length);
    console.log("Valores mínimos e máximos:");
    const xValues = xyd_data.map(p => p[0]);
    const yValues = xyd_data.map(p => p[1]);
    const probValues = xyd_data.map(p => p[2]);
    console.log("X -> min:", Math.min(...xValues), "max:", Math.max(...xValues));
    console.log("Y -> min:", Math.min(...yValues), "max:", Math.max(...yValues));
    console.log("Prob -> min:", Math.min(...probValues), "max:", Math.max(...probValues));
  }, [xyd_data]);

  const xAxisData = generateAxisData(0, 21, 1);
  const yAxisData = generateAxisData(0, 20, 1);
  console.log(yAxisData)
  console.log(xyd_data)
  const option = {
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
      calculable: true,
      realtime: false,
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
        data: xyd_data,
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
};

export default Heatmap;