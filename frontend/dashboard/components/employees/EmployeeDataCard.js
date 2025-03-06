import React, { useEffect, useState } from 'react';
import { 
  Paper, 
  Typography, 
  Box, 
  Divider, 
  Collapse, 
  IconButton 
} from '@mui/material';
import { employeeService } from '../../../services/employeeService';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

// Adicione a função de formatação do telefone
const formatPhone = (phone) => {
  const cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.length === 11) {
    return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
};

const EmployeeDataCard = ({ employeeId }) => {
  const [employee, setEmployee] = useState(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchEmployee = async () => {
      try {
        const data = await employeeService.get(employeeId);
        setEmployee(data);
      } catch (error) {
        console.error('Error fetching employee:', error);
      }
    };

    if (employeeId) {
      fetchEmployee();
    }
  }, [employeeId]);

  if (!employee) return null;

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  return (
    <Paper
      elevation={2}
      sx={{
        mt: 2,
        borderRadius: 2,
        bgcolor: 'background.paper',
        '&:hover': {
          boxShadow: (theme) => theme.shadows[4],
          transition: 'box-shadow 0.3s ease-in-out',
        },
      }}
    >
      <Box
        onClick={handleExpandClick}
        sx={{
          p: 2,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          cursor: 'pointer',
          '&:hover': {
            bgcolor: 'action.hover',
          },
        }}
      >
        <Typography variant="h6" color="primary.main" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <AccountCircleIcon />
          Informações do Funcionário
        </Typography>
        <IconButton
          size="small"
          sx={{
            transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform 0.3s',
          }}
        >
          <KeyboardArrowDownIcon />
        </IconButton>
      </Box>

      <Collapse in={expanded} timeout="auto">
        <Divider />
        <Box sx={{ p: 3, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <AccountCircleIcon color="primary" />
            <Box>
              <Typography variant="body2" color="text.secondary">
                Nome
              </Typography>
              <Typography variant="body1">
                {employee.first_name} {employee.last_name}
              </Typography>
            </Box>
          </Box>

          <Divider />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <PhoneIcon color="primary" />
            <Box>
              <Typography variant="body2" color="text.secondary">
                Telefone
              </Typography>
              <Typography variant="body1">
                {formatPhone(employee.phone)}
              </Typography>
            </Box>
          </Box>

          <Divider />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <EmailIcon color="primary" />
            <Box>
              <Typography variant="body2" color="text.secondary">
                Email
              </Typography>
              <Typography variant="body1">
                {employee.email}
              </Typography>
            </Box>
          </Box>

          <Divider />

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <CalendarTodayIcon color="primary" />
            <Box>
              <Typography variant="body2" color="text.secondary">
                Data de Cadastro
              </Typography>
              <Typography variant="body1">
                {new Date(employee.created_at).toLocaleDateString('pt-BR')}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Collapse>
    </Paper>
  );
};

export default EmployeeDataCard;