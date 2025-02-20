import * as React from 'react';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { DeleteOutlineOutlined, EditOutlined } from '@mui/icons-material';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import IconButton from '@mui/material/IconButton';
import CustomizedDataGrid from '../CustomizedDataGrid';


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
    width: 120,
    renderCell: (params) => (
      <>
        <IconButton
          size="small"
          onClick={() => handleEdit(params.row)}
        >
          <EditOutlined />
        </IconButton>
        <IconButton
          size="small"
          color="error"
          onClick={() => handleDelete(params.row.id)}
        >
          <DeleteOutlineOutlined />
        </IconButton>
      </>
    ),
  },
];

export default function EmployeeTable({hideToolbar = false, onAdd, addButtonLabel}){
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

  return <CustomizedDataGrid
            columns={columns}
            rows={rows}
            hideToolbar={hideToolbar}
            onAdd={onAdd}
            addButtonLabel={addButtonLabel}
          />
}