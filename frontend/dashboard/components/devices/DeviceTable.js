import { DeleteOutlineOutlined, EditOutlined } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import CustomizedDataGrid from '../CustomizedDataGrid';
import { Chip, Tooltip } from '@mui/material';
import DoNotDisturbOnOutlinedIcon from '@mui/icons-material/DoNotDisturbOnOutlined';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';

const createColumns = (handleHeatmap, handleEdit, handleDelete, handleDisable) => [
  { 
    field: 'id',
    headerName: 'ID',
    flex: 0.3,
    width: 80,
    type: 'number',
    disableColumnMenu: true,
  },
  { 
    field: 'name',
    headerName: 'Nome',
    flex: 1,
    minWidth: 150,
    disableColumnMenu: true
  },
  {
    field: 'device_type_name',
    headerName: 'Tipo de Dispositivo',
    flex: 1,
    minWidth: 150,
    disableColumnMenu: true
  },
  {
    field: 'linked_employee_name',
    headerName: 'Func. Associado',
    flex: 0.5,
    minWidth: 200,
    disableColumnMenu: true,
  },
  {
    field: 'creation_date',
    headerName: 'Data de Criação',
    flex: 1,
    minWidth: 180,
    disableColumnMenu: true
  },
  {
    field: 'is_active',
    headerName: 'Status',
    flex: 1,
    minWidth: 120,
    disableColumnMenu: true,
    renderCell: (params) => (
      <Chip
        label={params.value ? 'Ativo' : 'Inativo'}
        color={params.value ? 'success' : 'default'}
        size="small"
      />
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
      <IconButton
        size="small"
        color="error"
        onClick={() => handleHeatmap(params.row.id)}
      >
        <MapOutlinedIcon />
      </IconButton>
    ),
  },
  {
    field: 'edit',
    headerName: 'Editar',
    headerAlign: 'center',
    align: 'center',
    width: 90,
    sortable: false,
    disableColumnMenu: true,
    renderCell: (params) => (
      <IconButton size="small" onClick={() => handleEdit(params.row)}>
        <EditOutlined />
      </IconButton>
    ),
  },
  {
    field: 'status_toggle',
    headerName: 'Mudar Status',
    headerAlign: 'center',
    align: 'center',
    minWidth: 90,
    sortable: false,
    disableColumnMenu: true,
    renderCell: (params) => (
      <Tooltip title={params.row.is_active ? 'Desativar Dispositivo' : 'Ativar Dispositivo'}>
        <IconButton 
          size="small"
          color={params.row.is_active ? 'warning' : 'success'}
          onClick={() => handleDisable(params.row.id)}
        >
          {params.row.is_active ? 
            <DoNotDisturbOnOutlinedIcon /> : 
            <CheckCircleOutlineOutlinedIcon />
          }
        </IconButton>
      </Tooltip>
    ),
  },
  {
    field: 'delete',
    headerName: 'Deletar',
    headerAlign: 'center',
    align: 'center',
    width: 90,
    sortable: false,
    disableColumnMenu: true,
    renderCell: (params) => (
      <IconButton
        size="small"
        color="error"
        onClick={() => handleDelete(params.row.id)}
      >
        <DeleteOutlineOutlined />
      </IconButton>
    ),
  },
];

export default function DeviceTable({rows, handleAdd, handleEdit, handleDelete, handleDisable}) {
  const navigate = useNavigate();

  const handleHeatmap = (device) => {
    navigate(`/devices/${device.id}/heatmap`);
  };

  const columns = React.useMemo(() => createColumns(handleHeatmap, handleEdit, handleDelete, handleDisable), []);

  return <CustomizedDataGrid
            columns={columns}
            rows={rows}
            handleAdd={handleAdd}
            disableColumnMenu={true}
          />
}
