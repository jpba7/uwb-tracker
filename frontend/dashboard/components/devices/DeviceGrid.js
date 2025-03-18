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
  const [confirmDeleteDialog, setConfirmDeleteDialog] = useState({
    open: false,
    id: null
  });
  const [confirmDisableDialog, setConfirmDisableDialog] = useState({
    open: false,
    id: null,
    isActive: false
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
    setConfirmDeleteDialog({
      open: true,
      id: id
    });
  };

  const handleDisable = (id, isActive) => {
    setConfirmDisableDialog({
      open: true,
      id: id,
      isActive: isActive
    });
  };

  const handleConfirmDelete = async () => {
    try {
      await deviceService.delete(confirmDeleteDialog.id);
      await fetchDevices();
    } catch (error) {
      console.error('Error deleting device:', error);
    }
  };

  const handleConfirmDisable = async () => {
    try {
      await deviceService.toggleStatus(confirmDisableDialog.id);
      await fetchDevices();
    } catch (error) {
      console.error('Error disabling device:', error);
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
            handleDisable={handleDisable}
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
        open={confirmDeleteDialog.open}
        onClose={() => setConfirmDeleteDialog({ ...confirmDeleteDialog, open: false })}
        onConfirm={handleConfirmDelete}
        title="Confirmar Exclusão"
        message="Tem certeza que deseja excluir este dispositivo? Todos os pontos e históricos de uso associados a ele serão excluídos."
        message={
          <Box>
            <Typography sx={{ mb: 2 }}>
              {"Todos os pontos e históricos de uso associados a esse dispositivo serão excluídos também."}
            </Typography>
            <Typography>
              {"Tem certeza que deseja excluir?"}
            </Typography>
          </Box>
        }      
      />

      <ConfirmationDialog
        open={confirmDisableDialog.open}
        onClose={() => setConfirmDisableDialog({ ...confirmDisableDialog, open: false })}
        onConfirm={handleConfirmDisable}
        title={!confirmDisableDialog.isActive ? "Confirmar Desativação" : "Confirmar Ativação"}
        message={
          <Box>
            <Typography sx={{ mb: 2 }}>
              {!confirmDisableDialog.isActive 
                ? "Os pontos deste dispositivo continuarão no banco de dados, porém todos históricos de uso serão fechados e afetará algumas métricas gerais."
                : "O dispositivo voltará a aparecer nas métricas gerais mas os históricos de uso dele continuarão fechados."
              }
            </Typography>
            <Typography>
              {!confirmDisableDialog.isActive 
                ? "Tem certeza que deseja desativar?"
                : "Tem certeza que deseja ativar?"
              }
            </Typography>
          </Box>
        }
      />
      
      <Footer sx={{ my: 4 }} />
    </Box>
  );
}
