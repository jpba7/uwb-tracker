import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Stack from '@mui/material/Stack';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import PeopleRoundedIcon from '@mui/icons-material/PeopleRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import InfoRoundedIcon from '@mui/icons-material/InfoRounded';
import HelpRoundedIcon from '@mui/icons-material/HelpRounded';
import { Link } from 'react-router-dom';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import { TapAndPlayOutlined } from '@mui/icons-material';
import HistoryIcon from '@mui/icons-material/History';
import { useUser } from '../../contexts/UserContext';

const mainListItems = [
  { text: 'Início', icon: <HomeRoundedIcon />, link: '/'},
  { text: 'Funcionários', icon: <PeopleRoundedIcon />, link: '/employees'},
  { text: 'Dispositivos', icon: <TapAndPlayOutlined />, link: '/devices'},
  { text: 'Histórico de Uso', icon: <HistoryIcon />, link: '/device-histories'},
  { text: 'Heatmap Geral', icon: <MapOutlinedIcon />, link: '/heatmap'},
];

const secondaryListItems = [
  { 
    text: 'Painel do Administrador', 
    icon: <SettingsRoundedIcon />, 
    link: '/admin/'
  },
];

export default function MenuContent() {
  const { user } = useUser();

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton selected={location.pathname === item.link} component={Link} to={item.link}>
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <List dense>
        {user?.is_staff && secondaryListItems.map((item, index) => (
          <ListItem key={index} disablePadding sx={{ display: 'block' }}>
            <ListItemButton 
              onClick={() => window.location.href = item.link}
            >
              <ListItemIcon>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Stack>
  );
}
