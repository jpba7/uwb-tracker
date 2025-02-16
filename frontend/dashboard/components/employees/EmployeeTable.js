import * as React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import CustomizedDataGrid from '../CustomizedDataGrid';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';


const createColumns = (handleHeatmapClick) => [
  { 
    field: 'id',
    headerName: 'ID',
    flex: 0.3,
    minWidth: 60
  },
  { 
    field: 'name',
    headerName: 'Nome',
    flex: 1.5,
    minWidth: 200
  },
  {
    field: 'cpf',
    headerName: 'CPF',
    flex: 0.5,
    minWidth: 120,
  },
  {
    field: 'email',
    headerName: 'Email',
    flex: 1,
    minWidth: 250,
  },
  {
    field: 'phone',
    headerName: 'Telefone',
    flex: 1,
    minWidth: 150,
  },
  {
    field: 'created_at',
    headerName: 'Criado em',
    headerAlign: 'center',
    align: 'center',
    flex: 1,
    minWidth: 150,
  },
  {
    field: 'heatmap',
    headerName: 'Heatmap',
    headerAlign: 'center',
    align: 'center',
    flex: 1,
    minWidth: 90,
    renderCell: (params) => (
      <div>
        <IconButton size="small" onClick={() => handleHeatmapClick(params.row)}>
          <MapOutlinedIcon />
        </IconButton>
      </div>
    ),
  },
  {
    field: 'actions',
    headerName: 'Ações',
    headerAlign: 'center',
    align: 'center',
    flex: 1,
    minWidth: 90,
    renderCell: (params) => (
      <div>
        <IconButton size="small" onClick={() => handleEdit(params.row)}>
          <EditIcon />
        </IconButton>
      </div>
    ),
  },
];

export default function EmployeeTable({hideToolbar = false}){
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);

  const handleHeatmapClick = (employee) => {
    navigate(`/employees/${employee.cpf}/heatmap`);
  };

  const columns = React.useMemo(() => createColumns(handleHeatmapClick), []);


  useEffect(() => {
    fetch('/employees/api/list')
      .then(response => response.json())
      .then(data => setRows(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return <CustomizedDataGrid columns={columns} rows={rows} hideToolbar={hideToolbar} />
}