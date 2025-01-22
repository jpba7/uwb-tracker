import React, { useEffect } from 'react';
import * as echarts from 'echarts';

function SomePage() {
  useEffect(() => {
    const chartDom = document.getElementById('main');
    const myChart = echarts.init(chartDom);
    const option = {
      title: {
        text: 'ECharts example'
      },
      tooltip: {},
      xAxis: {
        data: ['A', 'B', 'C', 'D', 'E', 'F']
      },
      yAxis: {},
      series: [
        {
          name: 'Example',
          type: 'bar',
          data: [5, 20, 36, 10, 10, 20]
        }
      ]
    };
    myChart.setOption(option);
  }, []);

  return <div id="main" style={{ width: '600px', height: '400px' }}></div>;
}

export default SomePage;