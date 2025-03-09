import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import { deviceHistoryService } from '../../../services/deviceHistoryService';
import Footer from '../../internals/components/Footer';
import DeviceHistoryForm from './DeviceHistoryForm';
import DeviceHistoryTable from './DeviceHistoryTable';

export default function DeviceHistoryGrid() {
  const [rows, setRows] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [selectedDeviceHistory, setSelectedDeviceHistory] = useState(null);

  const fetchDeviceHistories = async () => {
    try {
      const data = await deviceHistoryService.getAll();
      setRows(data);
    } catch (error) {
      console.error('Error fetching device histories:', error);
    }
  };

  useEffect(() => {
    fetchDeviceHistories();
  }, []);

  const handleAdd = () => {
    setSelectedDeviceHistory(null);
    setOpenForm(true);
  };

  const handleEdit = (deviceHistory) => {
    setSelectedDeviceHistory(deviceHistory);
    setOpenForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este dispositivo?')) {
      try {
        await deviceHistoryService.delete(id);
        fetchDeviceHistories();
      } catch (error) {
        console.error('Error deleting device:', error);
      }
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography component="h2" variant="h6">
          Dispositivos
        </Typography>
      </Box>
      
      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, lg: 12 }}>
          <DeviceHistoryTable
            rows={rows}
            handleAdd={handleAdd}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        </Grid>
      </Grid>
      
      <DeviceHistoryForm
        open={openForm}
        handleClose={() => setOpenForm(false)}
        device={selectedDeviceHistory}
        onSubmit={fetchDeviceHistories}
      />
      
      <Footer sx={{ my: 4 }} />
    </Box>
  );
}
