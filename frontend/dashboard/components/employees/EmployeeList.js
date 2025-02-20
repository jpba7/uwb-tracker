import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import EditIcon from '@mui/icons-material/Edit';

export const columns = [
  { field: 'name', headerName: 'Nome', flex: 1.5, minWidth: 200 },
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
    minWidth: 100,
  },
  {
    field: 'emergency_contact',
    headerName: 'Tel. (SOS)',
    flex: 1,
    minWidth: 100,
  },
  {
    field: 'created_at',
    headerName: 'Data de criação',
    headerAlign: 'center',
    align: 'center',
    flex: 1,
    minWidth: 80,
  },
  {
    field: 'total_distance',
    headerName: 'Distância (m)',
    headerAlign: 'center',
    align: 'center',
    flex: 1,
    minWidth: 40,
  },
  {
    field: 'actions',
    headerName: 'Ações',
    width: 120,
    renderCell: (params) => (
      <>
        <Button
          size="small"
          onClick={() => handleEdit(params.row)}
        >
          Editar
        </Button>
        <Button
          size="small"
          color="error"
          onClick={() => handleDelete(params.row.id)}
        >
          Excluir
        </Button>
      </>
    ),
  },
];

function handleEdit(row) {
  console.log('Edit:', row);
}

export const rows = [
    {
      id: 1,
      name: 'João Pedro Bimbato Araujo',
      cpf: '15680358700',
      email: 'jpedrobimbato@gmail.com',
      phone: '27999962717',
      emergency_contact: '27981113993',
      created_at: '07/07/1997',
      total_distance: '31'
    },
    {
      id: 2,
      name: 'João Pedro Bimbato Araujo',
      cpf: '15680358700',
      email: 'jpedrobimbato@gmail.com',
      phone: '27999962717',
      emergency_contact: '27981113993',
      created_at: '07/07/1997',
      total_distance: '31'
    },
    {
      id: 3,
      name: 'João Pedro Bimbato Araujo',
      cpf: '15680358700',
      email: 'jpedrobimbato@gmail.com',
      phone: '27999962717',
      emergency_contact: '27981113993',
      created_at: '07/07/1997',
      total_distance: '40'
    },
    {
      id: 4,
      name: 'João Pedro Bimbato Araujo',
      cpf: '15680358700',
      email: 'jpedrobimbato@gmail.com',
      phone: '27999962717',
      emergency_contact: '27981113993',
      created_at: '07/07/1997',
      total_distance: '31'
    },
  ];
  