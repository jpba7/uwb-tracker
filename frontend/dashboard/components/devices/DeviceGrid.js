import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid2';
import Typography from '@mui/material/Typography';
import React, { useEffect, useState } from 'react';
import { deviceService } from '../../../services/deviceService';
import Footer from '../../internals/components/Footer';
import DeviceForm from './DeviceForm';
import DeviceTable from './DeviceTable';
import ConfirmationDialog from '../ConfirmationDialog';

export default function DeviceGrid() {
  const [rows, setRows] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [confirmDialog, setConfirmDialog] = useState({
    open: false,
    id: null
  });

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

  const handleDelete = (id) => {
    setConfirmDialog({
      open: true,
      id: id
    });
  };

  const handleConfirmDelete = async () => {
    try {
      await deviceService.delete(confirmDialog.id);
      await fetchDevices();
    } catch (error) {
      console.error('Error deleting device:', error);
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

      <ConfirmationDialog
        open={confirmDialog.open}
        onClose={() => setConfirmDialog({ ...confirmDialog, open: false })}
        onConfirm={handleConfirmDelete}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir este dispositivo? Todos os pontos e históricos de uso associados a ele serão excluídos."
      />
      
      <Footer sx={{ my: 4 }} />
    </Box>
  );
}
