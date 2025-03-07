import * as React from 'react';
import { useNavigate } from 'react-router-dom';

import { DeleteOutlineOutlined, EditOutlined } from '@mui/icons-material';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import CustomizedDataGrid from '../CustomizedDataGrid';

const formatCPF = (cpf) => {
  return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4');
};

const formatPhone = (phone) => {
  const cleanPhone = phone.replace(/\D/g, '');
  if (cleanPhone.length === 11) {
    return cleanPhone.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
  }
  return cleanPhone.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3');
};

const createColumns = (handleTracker, handleHeatmap, handleEdit, handleDelete) => [
  { 
    field: 'id',
    headerName: 'ID',
    flex: 0.3,
    minWidth: 80,
    type: 'number',
    disableColumnMenu: true
  },
  { 
    field: 'name',
    headerName: 'Nome',
    flex: 1.5,
    minWidth: 200,
    disableColumnMenu: true
  },
  {
    field: 'cpf',
    headerName: 'CPF',
    flex: 0.5,
    minWidth: 140,
    disableColumnMenu: true,
    renderCell: (params) => formatCPF(params.value),
  },
  {
    field: 'email',
    headerName: 'Email',
    flex: 1,
    minWidth: 250,
    disableColumnMenu: true
  },
  {
    field: 'phone',
    headerName: 'Telefone',
    flex: 1,
    minWidth: 150,
    disableColumnMenu: true,
    renderCell: (params) => formatPhone(params.value),
  },
  {
    field: 'created_at',
    headerName: 'Criado em',
    headerAlign: 'center',
    align: 'center',
    flex: 1,
    minWidth: 150,
    disableColumnMenu: true
  },
  {
    field: 'track',
    headerName: 'Tracker',
    headerAlign: 'center',
    align: 'center',
    minWidth: 90,
    sortable: false,
    disableColumnMenu: true,
    renderCell: (params) => (
      <div>
        <Tooltip 
          title={params.row.has_device_history 
            ? "Ver movimentação do funcionário" 
            : "Funcionário sem histórico de movimentação"}
        >
          <span>
            <IconButton 
              size="small" 
              onClick={() => handleTracker(params.row)}
              disabled={!params.row.has_device_history}
              sx={{
                color: params.row.has_device_history ? 'inherit' : 'rgba(0, 0, 0, 0.26)'
              }}
            >
              <LocationOnOutlinedIcon />
            </IconButton>
          </span>
        </Tooltip>
      </div>
    ),
  },
  {
    field: 'heatmap',
    headerName: 'Heatmap',
    headerAlign: 'center',
    align: 'center',
    minWidth: 90,
    sortable: false,
    disableColumnMenu: true,
    renderCell: (params) => (
      <div>
        <Tooltip 
          title={params.row.has_device_history 
            ? "Ver heatmap do funcionário" 
            : "Funcionário sem histórico de dispositivos"}
        >
          <span>
            <IconButton 
              size="small" 
              onClick={() => handleHeatmap(params.row)}
              disabled={!params.row.has_device_history}
              sx={{
                color: params.row.has_device_history ? 'inherit' : 'rgba(0, 0, 0, 0.26)'
              }}
            >
              <MapOutlinedIcon />
            </IconButton>
          </span>
        </Tooltip>
      </div>
    ),
  },
  {
    field: 'edit',
    headerName: 'Editar',
    headerAlign: 'center',
    align: 'center',
    width: 90,
    sortable:false,
    disableColumnMenu: true,
    renderCell: (params) => (
      <>
        <IconButton
          size="small"
          onClick={() => {handleEdit(params.row)}}
        >
          <EditOutlined />
        </IconButton>
      </>
    ),
  },
  {
    field: 'delete',
    headerName: 'Deletar',
    headerAlign: 'center',
    align: 'center',
    width: 90,
    sortable:false,
    disableColumnMenu: true,
    renderCell: (params) => (
      <>
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

export default function EmployeeTable({rows, handleAdd, handleEdit, handleDelete}){
  const navigate = useNavigate();

  const handleHeatmap = (employee) => {
    navigate(`/employees/${employee.id}/heatmap`);
  };

  const handleTracker = (employee) => {
    navigate(`/employees/${employee.id}/tracker`);
  };

  const columns = React.useMemo(() => createColumns(handleTracker, handleHeatmap, handleEdit, handleDelete), []);

  const formattedRows = React.useMemo(() => {
    return rows.map(employee => ({
      ...employee,
      name: `${employee.first_name} ${employee.last_name}`,
    }));
  }, [rows]);


  return <CustomizedDataGrid
            columns={columns}
            rows={formattedRows}
            handleAdd={handleAdd}
            disableColumnMenu={true}
          />
}