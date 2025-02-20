import React, { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';
import Footer from '../../internals/components/Footer';
import CustomizedDataGrid from '../CustomizedDataGrid';
import { employeeService } from '../../../services/employeeService';
import EmployeeForm from './EmployeeForm';
import EmployeeTable from './EmployeeTable';

export default function EmployeeGrid() {
  const [rows, setRows] = useState([]);
  const [openForm, setOpenForm] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const fetchEmployees = async () => {
    try {
      const data = await employeeService.getAll();
      setRows(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleAdd = () => {
    setSelectedEmployee(null);
    setOpenForm(true);
  };

  const handleEdit = (employee) => {
    setSelectedEmployee(employee);
    setOpenForm(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Tem certeza que deseja excluir este funcionário?')) {
      try {
        await employeeService.delete(id);
        fetchEmployees();
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  };

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography component="h2" variant="h6">
          Funcionários
        </Typography>
      </Box>
      
      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, lg: 12 }}>
          <EmployeeTable 
            onAdd={handleAdd}
            addButtonLabel="Novo"
          />
        </Grid>
      </Grid>
      
      <EmployeeForm
        open={openForm}
        handleClose={() => setOpenForm(false)}
        employee={selectedEmployee}
        onSubmit={fetchEmployees}
      />
      
      <Footer sx={{ my: 4 }} />
    </Box>
  );
}