import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import { deviceService } from '../../../services/deviceService';
import Footer from '../../internals/components/Footer';
import DeviceForm from './DeviceForm';
import DeviceTable from './DeviceTable';

export default function DeviceGrid() {
  const [rows, setRows] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);

  const fetchDevices = async () => {
    try {
      const data = await deviceService.getAll();
      setRows(data);
    } catch (error) {
      console.error('Error fetching devices:', error);
    }
  };

  useEffect(() => {
    fetchDevices();
  }, []);

  const handleAdd = () => {
    setSelectedDevice(null);
    setOpenForm(true);
  };

  const handleEdit = (device) => {
    setSelectedDevice(device);
    setOpenForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este dispositivo?')) {
      try {
        await deviceService.delete(id);
        fetchDevices();
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
          <DeviceTable
            rows={rows}
            handleAdd={handleAdd}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        </Grid>
      </Grid>
      
      <DeviceForm
        open={openForm}
        handleClose={() => setOpenForm(false)}
        device={selectedDevice}
        onSubmit={fetchDevices}
      />
      
      <Footer sx={{ my: 4 }} />
    </Box>
  );
}
