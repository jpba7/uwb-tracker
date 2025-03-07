import * as React from 'react';
import dayjs from 'dayjs';
import { useParams } from 'react-router-dom';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Stack from '@mui/material/Stack'; 
import Button from '@mui/material/Button';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import Footer from '../../internals/components/Footer';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import ClearIcon from '@mui/icons-material/Clear';
import EmployeeDataCard from './EmployeeDataCard';
import DeviceHistoryCard from './DeviceHistoryCard';
import AnimatedTracker from '../../../graphs/AnimatedTracker';

export default function EmployeeTrackerGrid() {
  const { employee_id } = useParams();
  // Inicializa com a data de hoje
  const [tempDate, setTempDate] = React.useState(dayjs());
  const [trackerDates, setTrackerDates] = React.useState({
    start: dayjs().format('YYYY-MM-DD'),
    end: dayjs().add(1, 'day').format('YYYY-MM-DD')
  });

  const handleUpdateTracker = () => {
    setTrackerDates({
      start: tempDate.format('YYYY-MM-DD'),
      end: tempDate.add(1, 'day').format('YYYY-MM-DD')
    });
  };

  const handleClearDates = () => {
    const today = dayjs();
    setTempDate(today);
    setTrackerDates({
      start: today.format('YYYY-MM-DD'),
      end: today.add(1, 'day').format('YYYY-MM-DD')
    });
  };

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      <Typography component="h2" variant="h6" sx={{ mb: 4 }}>
        Tracker
      </Typography>
      
      <Stack 
        direction={{ xs: 'column', md: 'row' }} 
        spacing={{ xs: 2, md: 4 }} 
        alignItems={{ xs: 'stretch', md: 'flex-end' }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <FormControl >
            <FormLabel sx={{ mb: 1 }}>Data</FormLabel>
            <DatePicker
              value={tempDate}
              format="DD/MM/YYYY"
              onChange={(newValue) => setTempDate(newValue)}
              slotProps={{
                textField: { size: 'standard'},
                nextIconButton: { size: 'small' },
                previousIconButton: { size: 'small' },
              }}
            />
          </FormControl>
          <FormControl>
            <FormLabel sx={{ 
              mb: { xs: 0, md: 1 },
              display: { xs: 'none', md: 'block' }
            }}>
              &nbsp;
            </FormLabel>
            <Stack 
              direction="row" 
              spacing={1}
              sx={{ 
                width: '100%',
                justifyContent: { xs: 'space-between', md: 'flex-start' },
                mt: { xs: 1, md: 0 }
              }}
            >
              <Button 
                variant="contained" 
                onClick={handleUpdateTracker}
                sx={{ height: 45, flex: { xs: 1, md: 'none' } }}
              >
                Atualizar
              </Button>
              
              <Button 
                variant="outlined" 
                startIcon={<ClearIcon />}
                onClick={handleClearDates}
                sx={{ height: 45, flex: { xs: 1, md: 'none' } }}
                disabled={!tempDate}
              >
                Limpar
              </Button>
            </Stack>
          </FormControl>
        </LocalizationProvider> 
      </Stack>

      <Grid container sx={{ mt:2 }} spacing={2} columns={12}>
        <Grid size={{ xs: 12, lg: 12 }}>
          <AnimatedTracker 
            employee_id={employee_id} 
            start_date={trackerDates.start} 
            end_date={trackerDates.end}
          />
        </Grid>

        <Grid size={{ xs: 12, lg: 12 }}>
          <DeviceHistoryCard 
            employeeId={employee_id} 
          />
        </Grid>

        <Grid size={{ xs: 12, lg: 12 }}>
          <EmployeeDataCard employeeId={employee_id} />
        </Grid>
      </Grid>

      <Footer sx={{ my: 4 }} />
    </Box>
  );
}