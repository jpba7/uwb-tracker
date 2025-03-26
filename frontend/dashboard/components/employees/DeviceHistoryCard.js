import React, { useEffect, useState } from 'react';
import {
  Paper,
  Typography,
  Box,
  Divider,
  Collapse,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import HistoryIcon from '@mui/icons-material/History';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import UpdateIcon from '@mui/icons-material/Update';
import { deviceHistoryService } from '../../../services/deviceHistoryService';
import dayjs from 'dayjs';

const DeviceHistoryCard = ({ employeeId, onDateRangeSelect }) => {
  const [histories, setHistories] = useState([]);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    const fetchHistories = async () => {
      try {
        const data = await deviceHistoryService.getDeviceHistory(employeeId);
        setHistories(data);
      } catch (error) {
        console.error('Error fetching device histories:', error);
      }
    };

    if (employeeId) {
      fetchHistories();
    }
  }, [employeeId]);

  const handleExpandClick = () => {
    setExpanded(!expanded);
  };

  const handleUpdateHeatmap = (startDate, endDate) => {
    onDateRangeSelect(
      dayjs(startDate),
      endDate ? dayjs(endDate) : dayjs()
    );
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
          <HistoryIcon />
          Histórico de Dispositivos
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
        <TableContainer sx={{ p: 2 }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell sx={{ fontWeight: 'bold' }}>Dispositivo</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Início</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Fim</TableCell>
                <TableCell sx={{ fontWeight: 'bold' }}>Status</TableCell>
                {onDateRangeSelect && (
                  <TableCell sx={{ fontWeight: 'bold' }} align="right">Ações</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {histories.map((history) => (
                <TableRow key={history.id} hover>
                  <TableCell>{history.device_name}</TableCell>
                  <TableCell>{history.formatted_start_date}</TableCell>
                  <TableCell>{history.formatted_end_date}</TableCell>
                  <TableCell>
                    <Chip
                      label={history.is_active ? 'Ativo' : 'Inativo'}
                      color={history.is_active ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>
                  {onDateRangeSelect && (
                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={() => handleUpdateHeatmap(history.start_date, history.end_date)}
                        title="Visualizar período no heatmap"
                      >
                        <UpdateIcon />
                      </IconButton>
                    </TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Collapse>
    </Paper>
  );
};

export default DeviceHistoryCard;
