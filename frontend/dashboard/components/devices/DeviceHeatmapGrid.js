import * as React from 'react';
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
import Heatmap from '../../../graphs/Heatmap';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';
import ClearIcon from '@mui/icons-material/Clear';

export default function DeviceHeatmapGrid() {
  const { device_id } = useParams();
  const [tempStartDate, setTempStartDate] = React.useState(null);
  const [tempEndDate, setTempEndDate] = React.useState(null);
  const [heatmapDates, setHeatmapDates] = React.useState({
    start: null,
    end: null
  });

  const handleUpdateHeatmap = () => {
    setHeatmapDates({
      start: tempStartDate?.format('YYYY-MM-DD'),
      end: tempEndDate?.format('YYYY-MM-DD')
    });
  };

  const handleClearDates = () => {
    setTempStartDate(null);
    setTempEndDate(null);
    setHeatmapDates({
      start: null,
      end: null
    });
  };

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      <Typography component="h2" variant="h6" sx={{ mb: 4 }}>
        Heatmap
      </Typography>
      
      <Stack 
        direction={{ xs: 'column', md: 'row' }} 
        spacing={{ xs: 2, md: 4 }} 
        alignItems={{ xs: 'stretch', md: 'flex-end' }}
      >
        <LocalizationProvider dateAdapter={AdapterDayjs}>
          <FormControl >
            <FormLabel sx={{ mb: 1 }}>Data Inicial</FormLabel>
            <DatePicker
              value={tempStartDate}
              format="DD/MM/YYYY"
              onChange={(newValue) => setTempStartDate(newValue)}
              maxDate={tempEndDate || undefined}
              slotProps={{
                textField: { size: 'standard'},
                nextIconButton: { size: 'small' },
                previousIconButton: { size: 'small' },
              }}
            />
          </FormControl>
          <FormControl>
            <FormLabel sx={{ mb: 1 }}>Data Final</FormLabel>
            <DatePicker
              value={tempEndDate}
              format="DD/MM/YYYY"
              onChange={(newValue) => setTempEndDate(newValue)}
              minDate={tempStartDate || undefined}
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
                onClick={handleUpdateHeatmap}
                sx={{ height: 45, flex: { xs: 1, md: 'none' } }}
              >
                Atualizar
              </Button>
              
              <Button 
                variant="outlined" 
                startIcon={<ClearIcon />}
                onClick={handleClearDates}
                sx={{ height: 45, flex: { xs: 1, md: 'none' } }}
                disabled={!tempStartDate && !tempEndDate}
              >
                Limpar
              </Button>
            </Stack>
          </FormControl>
        </LocalizationProvider> 
      </Stack>

      <Grid container sx={{ mt:2 }} spacing={2} columns={12}>
        <Grid size={{ xs: 12, lg: 12 }}>
          <Heatmap 
            device_id={device_id}
            start_date={heatmapDates.start}
            end_date={heatmapDates.end}
          />
        </Grid>

      </Grid>

      <Footer sx={{ my: 4 }} />
    </Box>
  );
}