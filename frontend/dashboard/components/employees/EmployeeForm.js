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
import React, { useState, useEffect } from 'react';
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

// Adicione esta função helper no início do arquivo, após os imports
const cleanNumericString = (str) => str.replace(/\D/g, '');

export default function EmployeeForm({ open, handleClose, employee, onSubmit }) {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    cpf: '',
    email: '',
    phone: '',
    emergency_contact: '',
    address: '',
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (employee) {
      // Função para formatar CPF
      const formatCPF = (cpf) => {
        return cpf
          .replace(/\D/g, '')
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d)/, '$1.$2')
          .replace(/(\d{3})(\d{1,2})/, '$1-$2');
      };

      // Função para formatar telefone
      const formatPhone = (phone) => {
        const numbers = phone.replace(/\D/g, '');
        if (numbers.length <= 10) {
          return numbers
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{4})(\d)/, '$1-$2');
        } else {
          return numbers
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{5})(\d)/, '$1-$2');
        }
      };

      setFormData({
        first_name: employee.first_name || '',
        last_name: employee.last_name || '',
        cpf: employee.cpf ? formatCPF(employee.cpf) : '',
        email: employee.email || '',
        phone: employee.phone ? formatPhone(employee.phone) : '',
        emergency_contact: employee.emergency_contact ? formatPhone(employee.emergency_contact) : '',
        address: employee.address || '',
      });
    } else {
      // Limpa o formulário quando não há employee
      setFormData({
        first_name: '',
        last_name: '',
        cpf: '',
        email: '',
        phone: '',
        emergency_contact: '',
        address: '',
      });
    }
  }, [employee]);

  const validateCPF = (cpf) => {
    // Remove caracteres não numéricos
    const cleanCPF = cpf.replace(/[^\d]/g, '');
    
    if (cleanCPF.length !== 11) {
      return false;
    }
    
    // Verifica se todos os dígitos são iguais
    if (/^(\d)\1+$/.test(cleanCPF)) {
      return false;
    }
  
    return true;
  };
  
  const validatePhone = (phone) => {
    // Remove caracteres não numéricos
    const cleanPhone = phone.replace(/[^\d]/g, '');
    // Verifica se tem entre 10 e 11 dígitos (com ou sem DDD)
    return cleanPhone.length >= 10 && cleanPhone.length <= 11;
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    let formattedValue = value;
  
    // Formatação específica para cada campo
    if (name === 'cpf') {
      // Formata CPF: 000.000.000-00
      formattedValue = value
        .replace(/\D/g, '') // Remove não-dígitos
        .slice(0, 11) // Limita a 11 dígitos
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2');
    } else if (name === 'phone' || name === 'emergency_contact') {
      // Formata telefone: (00) 00000-0000 ou (00) 0000-0000
      const numbers = value.replace(/\D/g, '');
      
      if (numbers.length <= 10) {
        // Formato para números com 8 dígitos: (00) 0000-0000
        formattedValue = numbers
          .replace(/(\d{2})(\d)/, '($1) $2')
          .replace(/(\d{4})(\d)/, '$1-$2')
          .slice(0, 14);
      } else {
        // Formato para números com 9 dígitos: (00) 00000-0000
        formattedValue = numbers
          .replace(/(\d{2})(\d)/, '($1) $2')
          .replace(/(\d{5})(\d)/, '$1-$2')
          .slice(0, 15);
      }
    }
  
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
    
    // Validação do primeiro nome
    if (!formData.first_name) {
      newErrors.first_name = 'Primeiro nome é obrigatório';
    } else if (formData.first_name.length > 100) {
      newErrors.first_name = 'O primeiro nome deve ter no máximo 100 caracteres';
    }
  
    // Validação do último nome
    if (!formData.last_name) {
      newErrors.last_name = 'Último nome é obrigatório';
    } else if (formData.last_name.length > 100) {
      newErrors.last_name = 'O último nome deve ter no máximo 100 caracteres';
    }
  
    // Validação do CPF
    if (!formData.cpf) {
      newErrors.cpf = 'CPF é obrigatório';
    } else if (!validateCPF(formData.cpf)) {
      newErrors.cpf = 'CPF inválido';
    }
  
    // Validação do email
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
  
    // Validação do telefone
    if (!formData.phone) {
      newErrors.phone = 'Telefone é obrigatório';
    } else if (!validatePhone(formData.phone)) {
      newErrors.phone = 'Telefone inválido';
    }
  
    // Validação do contato de emergência
    if (!formData.emergency_contact) {
      newErrors.emergency_contact = 'Contato de emergência é obrigatório';
    } else if (!validatePhone(formData.emergency_contact)) {
      newErrors.emergency_contact = 'Telefone de emergência inválido';
    }
  
    // Validação do endereço
    if (!formData.address) {
      newErrors.address = 'Endereço é obrigatório';
    } else if (formData.address.length > 200) {
      newErrors.address = 'O endereço deve ter no máximo 200 caracteres';
    }
  
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validateForm()) return;

    // Cria uma cópia dos dados com apenas números para CPF e telefones
    const cleanedFormData = {
      ...formData,
      cpf: cleanNumericString(formData.cpf),
      phone: cleanNumericString(formData.phone),
      emergency_contact: cleanNumericString(formData.emergency_contact)
    };

    try {
      if (employee?.id) {
        await employeeService.update(employee.id, cleanedFormData);
      } else {
        await employeeService.create(cleanedFormData);
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