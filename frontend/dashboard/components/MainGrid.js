import * as React from 'react';
import dayjs from 'dayjs';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Footer from '../internals/components/Footer';
import StatCard from './StatCard';
import Heatmap from '../../graphs/Heatmap';
import { deviceHistoryService } from '../../services/deviceHistoryService';
import { deviceService } from '../../services/deviceService';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import RealtimeTracker from '../../graphs/RealtimeTracker';

export default function MainGrid() {
  const [activeHistory, setActiveHistory] = React.useState([]);
  const [tagHistory, setTagHistory] = React.useState([]);
  const defaultEndDate = dayjs();
  const defaultStartDate = dayjs().subtract(30, 'days');
  const [heatmapDates, setHeatmapDates] = React.useState({
    start: defaultStartDate.format('YYYY-MM-DD'),
    end: defaultEndDate.format('YYYY-MM-DD')
  });

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const historyData = await deviceHistoryService.getActiveHistory();
        setActiveHistory(historyData);
        const tagsHistoryData = await deviceService.getActiveHistory();
        setTagHistory(tagsHistoryData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    
    fetchData();
  }, []);

  const getHistoryData = () => {
    if (!activeHistory.length) return { value: '0', data: [] };
    
    const lastValue = activeHistory[activeHistory.length - 1].active_users;
    const data = activeHistory.slice(-30).map(item => item.active_users);
    
    return {
      value: lastValue.toString(),
      data
    };
  };

  const getTagHistoryData = () => {
    if (!tagHistory.length) return { value: '0', data: [] };
    
    const lastValue = tagHistory[tagHistory.length - 1].active_tags;
    const data = tagHistory.slice(-30).map(item => item.active_tags);
    
    return {
      value: lastValue.toString(),
      data
    };
  };

  const historyData = getHistoryData();
  const tagData = getTagHistoryData();

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Visão Geral
      </Typography>
      {/* Grid para os StatCards */}
      <Grid
        container
        spacing={2}
        columns={12}
        sx={{ mb: (theme) => theme.spacing(2) }}
      >
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Funcionários Monitorados"
            value={historyData.value}
            interval="Últimos 30 dias"
            data={historyData.data}
            trend="up"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, lg: 3 }}>
          <StatCard
            title="Tags Cadastradas"
            value={tagData.value}
            interval="Últimos 30 dias"
            data={tagData.data}
            trend="up"
          />
        </Grid>
      </Grid>

      {/* Grid para o Rastreamento em Tempo Real e Heatmap */}
      <Grid 
        container 
        spacing={2}
        sx={{ mt: 2 }}
      >
        {/* Rastreamento em Tempo Real */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Rastreamento em Tempo Real
              </Typography>
              <RealtimeTracker />
            </CardContent>
          </Card>
        </Grid>
        
        {/* Heatmap */}
        <Grid size={{ xs: 12, lg: 6 }}>
          <Card variant="outlined" sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" sx={{ mb: 2 }}>
                Heatmap Geral - Últimos 30 dias
              </Typography>
              <Heatmap
                start_date={heatmapDates.start}
                end_date={heatmapDates.end}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      
      <Footer sx={{ my: 4 }} />
    </Box>
  );
}
