import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  styled,
  TextField,
  Typography,
} from '@mui/material';
import React, { useState } from 'react';
import { employeeService } from '../../../services/employeeService';

// Styled components
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    borderRadius: theme.shape.borderRadius * 2,
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

export default function EmployeeForm({ open, handleClose, employee, onSubmit }) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    cpf: '',
    email: '',
    phone: '',
    emergency_contact: '',
    address: '',
    ...employee,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (event) => {
    setFormData({
      ...formData,
      [event.target.name]: event.target.value,
    });
    // Clear error when user starts typing
    setErrors({
      ...errors,
      [event.target.name]: null,
    });
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.first_name) newErrors.first_name = 'Primeiro nome é obrigatório';
    if (!formData.last_name) newErrors.last_name = 'Último nome é obrigatório';
    if (!formData.cpf) newErrors.cpf = 'CPF é obrigatório';
    if (!formData.email) newErrors.email = 'Email é obrigatório';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email inválido';
    if (!formData.phone) newErrors.phone = 'Telefone é obrigatório';
    if (!formData.emergency_contact) newErrors.emergency_contact = 'Contato de emergência é obrigatório';
    if (!formData.address) newErrors.address = 'Endereço é obrigatório';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    try {
      if (employee?.id) {
        await employeeService.update(employee.id, formData);
      } else {
        await employeeService.create(formData);
      }
      onSubmit();
      handleClose();
    } catch (error) {
      console.error('Error saving employee:', error);
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
      <DialogTitle sx={{ pb: 1 }}>
        {employee ? 'Editar Funcionário' : 'Novo Funcionário'}
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
              label="Primeiro Nome"
              name="first_name"
              value={formData.first_name}
              onChange={handleChange}
              variant="outlined"
              error={!!errors.first_name}
              helperText={errors.first_name}
              sx={textFieldSX}
            />
            <TextField
              required
              fullWidth
              label="Último Nome"
              name="last_name"
              value={formData.last_name}
              onChange={handleChange}
              variant="outlined"
              error={!!errors.last_name}
              helperText={errors.last_name}
              sx={textFieldSX}
            />
            <TextField
              required
              fullWidth
              label="CPF"
              name="cpf"
              value={formData.cpf}
              onChange={handleChange}
              variant="outlined"
              error={!!errors.cpf}
              helperText={errors.cpf}
              sx={textFieldSX}
            />
            <TextField
              required
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              variant="outlined"
              error={!!errors.email}
              helperText={errors.email}
              sx={textFieldSX}
            />
            <TextField
              required
              fullWidth
              label="Telefone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              variant="outlined"
              error={!!errors.phone}
              helperText={errors.phone}
              sx={textFieldSX}
            />
            <TextField
              required
              fullWidth
              label="Contato de Emergência"
              name="emergency_contact"
              value={formData.emergency_contact}
              onChange={handleChange}
              variant="outlined"
              error={!!errors.emergency_contact}
              helperText={errors.emergency_contact}
              sx={textFieldSX}
            />
            <TextField
              required
              fullWidth
              label="Endereço"
              name="address"
              value={formData.address}
              onChange={handleChange}
              variant="outlined"
              error={!!errors.address}
              helperText={errors.address}
              sx={textFieldSX}
            />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button 
            onClick={handleClose}
            sx={{
              color: 'text.secondary',
              '&:hover': {
                backgroundColor: 'action.hover',
              }
            }}
          >
            Cancelar
          </Button>
          <Button 
            type="submit" 
            variant="contained"
            sx={{
              px: 3,
              boxShadow: 1,
              '&:hover': {
                boxShadow: 2,
              }
            }}
          >
            Salvar
          </Button>
        </DialogActions>
      </form>
    </StyledDialog>
  );
}