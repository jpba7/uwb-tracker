import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  styled,
  TextField,
  Typography
} from '@mui/material';
import React, { useEffect, useState } from 'react';
import { deviceService } from '../../../services/deviceService';
import { employeeService } from '../../../services/employeeService';

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[3],
  },
}));

// TextField styles
const textFieldSX = {
  '& .MuiOutlinedInput-root': {
    '&:hover fieldset': {
      borderColor: 'primary.main',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'primary.main',
    },
  },
  '& .MuiInputLabel-root': {
    top: 3,
    '&.Mui-focused': {
      color: 'primary.main',
      transform: 'translate(14px, -26px) scale(1)',
    },
    '&[data-shrink="true"]': {
      transform: 'translate(14px, -26px) scale(1)',
    },
    '&[data-shrink="false"]': {
      transform: 'translate(14px, 8px) scale(1)',
    },
  }
};

// Select Styles
const selectSX = { 
  '& .MuiInputLabel-root': {
    transform: 'translate(14px, 11px) scale(1)',
    '&.Mui-focused': {
      transform: 'translate(14px, -24px) scale(1)',
    },
    '&[data-shrink="true"]': {
      transform: 'translate(14px, -24px) scale(1)',
    }
  },
}

export default function DeviceForm({ open, handleClose, device, onSubmit }) {
  const [formData, setFormData] = useState({
    name: '',
    device_type: '',
    linked_employee: null,
  });
  const [errors, setErrors] = useState({});
  const [deviceTypes, setDeviceTypes] = useState([]);
  const [linkedEmployees, setLinkedEmployees] = useState([]);

  useEffect(() => {
    const loadLinkedEmployeeData = async (linkedEmployeeId) => {
      try {
        const linkedEmployeeData = await employeeService.getAll();
        const linkedEmployee = linkedEmployeeData.find(emp => emp.id === linkedEmployeeId);
        return linkedEmployee;
      } catch (error) {
        console.error('Erro ao carregar funcionário vinculado:', error);
        return null;
      }
    };
  
    const setDeviceData = async () => {
      if (device) {
        const linkedEmployeeData = device.linked_employee ? 
          await loadLinkedEmployeeData(device.linked_employee) : null;
  
        setFormData({
          name: device.name || '',
          device_type: device.device_type || '',
          linked_employee: linkedEmployeeData,
        });
      } else {
        setFormData({
          name: '',
          device_type: '',
          linked_employee: null,
        });
      }
    };
  
    setDeviceData();
  }, [device]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [types, empList] = await Promise.all([
          deviceService.getDeviceTypes(),
          employeeService.getAll()
        ]);
        setDeviceTypes(types);
        setLinkedEmployees(empList);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      }
    };
    loadData();
  }, []);

  useEffect(() => {
    if (device) {
      setFormData({
        name: device.name || '',
        device_type: device.device_type || '',
        linked_employee: device.linked_employee || null,
      });
    } else {
      setFormData({
        name: '',
        device_type: '',
        linked_employee: null,
      });
    }
  }, [device]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    let formattedValue = value;

    setFormData({
      ...formData,
      [name]: formattedValue,
    });
    setErrors({
      ...errors,
      [name]: null,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name) {
      newErrors.name = 'Nome é obrigatório';
    }
    if (!formData.device_type) {
      newErrors.device_type = 'Tipo de dispositivo é obrigatório';
    }
    if (!formData.linked_employee) {
      newErrors.linked_employee = 'Funcionário é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    const cleanedFormData = {
      ...formData,
      linked_employee: formData.linked_employee?.id || null
    };

    try {
      if (device?.id) {
        await deviceService.update(device.id, cleanedFormData);
      } else {
        await deviceService.create(cleanedFormData);
      }
      onSubmit();
      handleClose();
    } catch (error) {
      if (error.response && error.response.data) {
        setErrors(error.response.data);
      } else {
        setErrors({ non_field_errors: ['Ocorreu um erro ao salvar. Por favor, tente novamente.'] });
      }
    }
  };

  return (
    <StyledDialog 
      open={open} 
      onClose={handleClose} 
      maxWidth="sm" 
      fullWidth
    >
      <DialogTitle>
        {device ? 'Editar Dispositivo' : 'Novo Dispositivo'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={3.5}>
            {errors.non_field_errors && (
              <Typography color="error">{errors.non_field_errors}</Typography>
            )}
            <TextField
              required
              fullWidth
              label="Nome"
              name="name"
              value={formData.name}
              onChange={handleChange}
              error={!!errors.name}
              helperText={errors.name}
              sx={textFieldSX}
            />
            <FormControl 
              fullWidth 
              error={!!errors.device_type}
              sx={selectSX}
            >
              <InputLabel id="device-type-label">Tipo de Dispositivo</InputLabel>
              <Select
                labelId="device-type-label"
                name="device_type"
                value={formData.device_type}
                onChange={handleChange}
                label="Tipo de Dispositivo"
              >
                {deviceTypes.map((type) => (
                  <MenuItem key={type.id} value={type.id}>
                    {type.name}
                  </MenuItem>
                ))}
              </Select>
              {errors.device_type && (
                <Typography color="error" variant="caption">
                  {errors.device_type}
                </Typography>
              )}
            </FormControl>

            <Autocomplete
              value={formData.linked_employee}
              onChange={(event, newValue) => {
                setFormData({
                  ...formData,
                  linked_employee: newValue
                });
                setErrors({
                  ...errors,
                  linked_employee: null
                });
              }}
              options={linkedEmployees}
              getOptionLabel={(option) => 
                option ? `${option.first_name} ${option.last_name}` : ''
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Funcionário"
                  required
                  error={!!errors.linked_employee}
                  helperText={errors.linked_employee}
                  sx={textFieldSX}
                />
              )}
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>
            Cancelar
          </Button>
          <Button type="submit" variant="contained">
            Salvar
          </Button>
        </DialogActions>
      </form>
    </StyledDialog>
  );
}
