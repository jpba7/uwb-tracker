import {
  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormLabel,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  styled,
  TextField,
  Typography
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import React, { useEffect, useState } from 'react';
import { deviceHistoryService } from '../../../services/deviceHistoryService';
import { employeeService } from '../../../services/employeeService';
import { deviceService } from '../../../services/deviceService';

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

export default function DeviceHistoryForm({ open, handleClose, device: deviceHistory, onSubmit }) {
  const [formData, setFormData] = useState({
    device: null,
    employee: null,
    is_active: true,
    start_date: null,
    end_date: null,
  });
  const [errors, setErrors] = useState({});
  const [employees, setEmployees] = useState([]);
  const [devices, setDevices] = useState([]);

  useEffect(() => {
    const loadEmployeeData = async (employeeId) => {
      try {
        const employeeData = await employeeService.getAll();
        const employee = employeeData.find(emp => emp.id === employeeId);
        setEmployees(employeeData);
        return employee;
      } catch (error) {
        console.error('Erro ao carregar funcionário vinculado:', error);
        return null;
      }
    };

    const loadDeviceData = async (deviceId) => {
      try {
        const deviceData = await deviceService.getAll();
        const device = deviceData.find(dev => dev.id === deviceId);
        return device;
      } catch (error) {
        console.error('Erro ao carregar histórico de uso:', error);
        return null;
      }
    };

    const setDeviceData = async () => {
      if (deviceHistory) {
        const employeeData = deviceHistory.employee ? 
          await loadEmployeeData(deviceHistory.employee) : null;
        const deviceData = deviceHistory.device ? 
          await loadDeviceData(deviceHistory.device) : null;

        setFormData({
          device: deviceData,
          employee: employeeData,
          is_active: deviceHistory.is_active ?? true,
          start_date: deviceHistory.start_date ? dayjs(deviceHistory.start_date) : null,
          end_date: deviceHistory.end_date ? dayjs(deviceHistory.end_date) : null,
        });
      } else {
        setFormData({
          device: null,
          employee: null,
          is_active: true,
          start_date: null,
          end_date: null,
        });
      }
    };

    setDeviceData();
  }, [deviceHistory]);

  useEffect(() => {
    const fetchDevices = async () => {
      try {
        const deviceData = await deviceService.getAll();
        setDevices(deviceData);
      } catch (error) {
        console.error('Error loading devices:', error);
      }
    };
    
    if (!deviceHistory) {
      fetchDevices();
    }
  }, [deviceHistory]);

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
    if (!deviceHistory && !formData.device) {
      newErrors.device = 'Dispositivo é obrigatório';
    }
    if (!formData.employee) {
      newErrors.employee = 'Funcionário é obrigatório';
    }
    if (!formData.start_date) {
      newErrors.start_date = 'Data Inicial é obrigatória';
    }
    if (formData.is_active == null || formData.is_active === '' || formData.is_active === undefined) {
      newErrors.is_active = 'Status é obrigatório';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    const cleanedFormData = {
      device: deviceHistory ? deviceHistory.device : formData.device?.id,
      employee: formData.employee?.id || null,
      is_active: formData.is_active,
      start_date: formData.start_date ? dayjs(formData.start_date).format('YYYY-MM-DD') : null,
      end_date: formData.end_date ? dayjs(formData.end_date).format('YYYY-MM-DD') : null,
    };

    try {
      if (deviceHistory?.id) {
        await deviceHistoryService.update(deviceHistory.id, cleanedFormData);
      } else {
        await deviceHistoryService.create(cleanedFormData);
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
        {deviceHistory ? 'Editar Histórico' : 'Novo Histórico'}
      </DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          <Stack spacing={3.5}>
            {errors.non_field_errors && (
              <Typography color="error">{errors.non_field_errors}</Typography>
            )}
            {!deviceHistory && (
              <Autocomplete
                value={formData.device}
                onChange={(event, newValue) => {
                  setFormData({
                    ...formData,
                    device: newValue
                  });
                  setErrors({
                    ...errors,
                    device: null
                  });
                }}
                options={devices}
                getOptionLabel={(option) => 
                  option ? option.name : ''
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    label="Dispositivo"
                    error={!!errors.device}
                    helperText={errors.device}
                    sx={textFieldSX}
                  />
                )}
              />
            )}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <Stack 
                direction={{ xs: 'column', md: 'row' }} 
                spacing={{ xs: 2, md: 4 }} 
                alignItems={{ xs: 'stretch', md: 'flex-end' }}
              >
                <FormControl>
                  <FormLabel sx={{ ml: 2, mb: 1 }}>Data Inicial</FormLabel>
                  <DatePicker
                    value={formData.start_date}
                    format="DD/MM/YYYY"
                    onChange={(newValue) => {
                      setFormData(prev => ({
                        ...prev,
                        start_date: dayjs(newValue),
                      }));
                      setErrors({
                        ...errors,
                        start_date: null
                      });
                    }}
                    maxDate={formData.end_date || undefined}
                    slotProps={{
                      textField: { 
                        size: 'standard',
                        error: !!errors.start_date,
                        helperText: errors.start_date
                      },
                      nextIconButton: { size: 'small' },
                      previousIconButton: { size: 'small' },
                    }}
                  />
                </FormControl>
                <FormControl>
                  <FormLabel sx={{ ml: 2, mb: 1 }}>Data Final</FormLabel>
                  <DatePicker
                    value={formData.end_date}
                    format="DD/MM/YYYY"
                    onChange={(newValue) => {
                      setFormData(prev => ({
                        ...prev,
                        end_date: dayjs(newValue)
                      }));
                      setErrors({
                        ...errors,
                        end_date: null
                      });
                    }}
                    minDate={formData.start_date || undefined}
                    slotProps={{
                      textField: { 
                        size: 'standard',
                        error: !!errors.end_date,
                        helperText: errors.end_date
                      },
                      nextIconButton: { size: 'small' },
                      previousIconButton: { size: 'small' },
                    }}
                  />
                </FormControl>
              </Stack>
            </LocalizationProvider>
            <Autocomplete
              value={formData.employee}
              onChange={(event, newValue) => {
                setFormData({
                  ...formData,
                  employee: newValue
                });
                setErrors({
                  ...errors,
                  employee: null
                });
              }}
              options={employees}
              getOptionLabel={(option) => 
                option ? `${option.first_name} ${option.last_name}` : ''
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Funcionário"
                  error={!!errors.employee}
                  helperText={errors.employee}
                  sx={textFieldSX}
                />
              )}
            />
            <FormControl fullWidth sx={selectSX}>
              <InputLabel id="status-label">Status</InputLabel>
              <Select
                labelId="status-label"
                name="is_active"
                value={formData.is_active}
                label="Status"
                onChange={handleChange}
              >
                <MenuItem value={true}>Ativo</MenuItem>
                <MenuItem value={false}>Inativo</MenuItem>
              </Select>
            </FormControl>
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
