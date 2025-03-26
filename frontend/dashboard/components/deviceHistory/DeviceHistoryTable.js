import { DeleteOutlineOutlined, EditOutlined } from '@mui/icons-material';
import IconButton from '@mui/material/IconButton';
import Chip from '@mui/material/Chip';
import * as React from 'react';
import CustomizedDataGrid from '../CustomizedDataGrid';

const createColumns = (handleEdit, handleDelete) => [
  { 
    field: 'id',
    headerName: 'ID',
    flex: 0.3,
    width: 80,
    type: 'number',
    disableColumnMenu: true,
  },
  { 
    field: 'device_name',
    headerName: 'Dispositivo',
    flex: 1,
    minWidth: 150,
    disableColumnMenu: true
  },
  {
    field: 'employee_name',
    headerName: 'Func. Associado',
    flex: 0.5,
    minWidth: 300,
    disableColumnMenu: true,
  },
  {
    field: 'formatted_start_date',
    headerName: 'Data Inicial',
    flex: 1,
    minWidth: 120,
    disableColumnMenu: true
  },
  {
    field: 'formatted_end_date',
    headerName: 'Data Final',
    flex: 1,
    minWidth: 120,
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

export default function DeviceHistoryTable({rows, handleAdd, handleEdit, handleDelete}) {
  const columns = React.useMemo(() => createColumns(handleEdit, handleDelete), [handleEdit, handleDelete]);

  return <CustomizedDataGrid
            columns={columns}
            rows={rows}
            handleAdd={handleAdd}
            disableColumnMenu={true}
            sortModel={[
              {
                field: 'id',
                sort: 'asc'
              }
            ]}
            initialState={{
              sorting: {
                sortModel: [{ field: 'id', sort: 'asc' }],
              },
            }}
          />
}
