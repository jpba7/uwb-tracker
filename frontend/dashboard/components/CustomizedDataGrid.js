import * as React from 'react';
import {DataGrid, GridToolbarContainer,  GridToolbarQuickFilter, GridToolbarExport} from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import AddIcon from '@mui/icons-material/Add';

const StyledGridOverlay = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  padding: theme.spacing(1),
}));

function CustomNoRowsOverlay() {
  return (
    <StyledGridOverlay>
      <Box sx={{ mt: 1 }}>Nenhum registro encontrado</Box>
    </StyledGridOverlay>
  );
}

function CustomNoResultsOverlay() {
  return (
    <StyledGridOverlay>
      <Box sx={{ mt: 1 }}>Nenhum resultado encontrado para sua pesquisa</Box>
    </StyledGridOverlay>
  );
}

function CustomToolbar({ handleAdd, addButtonLabel }) {
  return (
    <Box 
      sx={{ 
        p: 1, 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center'
      }}
    >
      <GridToolbarContainer>
        <GridToolbarQuickFilter
          placeholder="Pesquisar..."
        />
      </GridToolbarContainer>

      <Box sx={{ display: 'flex', gap: 1 }}>
        <GridToolbarExport />
        {handleAdd && (
          <Button
            variant="contained"
            color="primary"
            startIcon={<AddIcon />}
            onClick={handleAdd}
          >
            {addButtonLabel || 'Novo'}
          </Button>
        )}
      </Box>
    </Box>
  );
}

export default function CustomizedDataGrid({
  columns, 
  rows, 
  hideToolbar = false,
  handleAdd,
  addButtonLabel = "Novo",
}) {
  return (
    <DataGrid
      rows={rows}
      columns={columns}
      getRowClassName={(params) =>
        params.indexRelativeToCurrentPage % 2 === 0 ? 'even' : 'odd'
      }
      initialState={{
        pagination: { paginationModel: { pageSize: 20 } },

      }}
      pageSizeOptions={[10, 20, 50, 100, { value: -1, label: 'All' }]}
      disableColumnResize
      disableRowSelectionOnClick
      disableColumnFilter
      disableColumnSelector
      disableDensitySelector
      density="standard"
      slots={{
        noRowsOverlay: CustomNoRowsOverlay,
        noResultsOverlay: CustomNoResultsOverlay,
        toolbar: hideToolbar ? null : CustomToolbar
      }}
      slotProps={{
        toolbar: {
          showQuickFilter: !hideToolbar,
          handleAdd,
          addButtonLabel
        },
      }}
    />
  );
}