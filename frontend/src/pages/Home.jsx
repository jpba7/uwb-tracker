import React, { useEffect } from 'react';
import * as echarts from 'echarts';
import {signal, time} from '../test/data_samples/data';

function SomePage() {

  useEffect(() => {
    const chartDom = document.getElementById('main');
    const myChart = echarts.init(chartDom, null, {renderer: 'svg'});
    const option = {
      title: {
        text: 'ECharts example'
      },
      tooltip: {
        trigger: 'axis',
        axisPointer: {
          type: 'cross'
        }
      },
      xAxis: {
        data: time.slice(0,30000)
      },
      yAxis: {},
      series: [
        {
          name: 'Example',
          type: 'line',
          data: signal.slice(0,30000)
        }
      ],
      dataZoom: [
        {
          show: true,
          xAxisIndex: [0, 1],
          type: 'slider',
          top: '95%',
          start: 98,
          end: 100
        }
      ],
    };
    myChart.setOption(option);
    
    
    console.log('Chart initialized');

  }, []);

  return <div id="main" style={{ width: '1200px', height:'800px' }}></div>;
}

export default SomePage;