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
import { Link, useLocation } from 'react-router-dom';
import MapOutlinedIcon from '@mui/icons-material/MapOutlined';
import { TapAndPlayOutlined } from '@mui/icons-material';
import HistoryIcon from '@mui/icons-material/History';
import { useUser } from '../../contexts/UserContext';
import Collapse from '@mui/material/Collapse';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ChevronRight from '@mui/icons-material/ChevronRight';

const mainListItems = [
  { text: 'Início', icon: <HomeRoundedIcon />, link: '/'},
  { text: 'Funcionários', icon: <PeopleRoundedIcon />, link: '/employees'},
  { text: 'Dispositivos', icon: <TapAndPlayOutlined />, link: '/devices'},
  { text: 'Histórico de Uso', icon: <HistoryIcon />, link: '/device-histories'},
  { text: 'Heatmap Geral', icon: <MapOutlinedIcon />, link: '/heatmap'},
  { 
    text: 'Configurações', 
    icon: <SettingsRoundedIcon />,
    submenu: [
      { 
        text: 'Mapa e limites', 
        icon: <MapOutlinedIcon />, 
        link: '/map-settings'
      }
    ]
  }
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
  const location = useLocation();
  const [anchorEl, setAnchorEl] = React.useState(null);
  
  const handleMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: 'space-between' }}>
      <List dense>
        {mainListItems.map((item, index) => (
          <React.Fragment key={index}>
            {item.submenu ? (
              <>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={handleMenuOpen}
                    selected={item.submenu.some(sub => location.pathname === sub.link)}
                  >
                    <ListItemIcon>{item.icon}</ListItemIcon>
                    <ListItemText primary={item.text} />
                    <ChevronRight 
                      sx={{ 
                        transform: Boolean(anchorEl) ? 'rotate(180deg)' : 'none',
                        transition: '0.2s'
                      }} 
                    />
                  </ListItemButton>
                </ListItem>
                <Menu
                  anchorEl={anchorEl}
                  open={Boolean(anchorEl)}
                  onClose={handleMenuClose}
                  anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                  }}
                  transformOrigin={{
                    vertical: 'top',
                    horizontal: 'left',
                  }}
                >
                  {item.submenu.map((subItem, subIndex) => (
                    <MenuItem
                      key={subIndex}
                      component={Link}
                      to={subItem.link}
                      onClick={handleMenuClose}
                      selected={location.pathname === subItem.link}
                      sx={{
                        minHeight: 32,
                        mr: 0.5,
                        '& .MuiListItemIcon-root': {
                          mr: 0.5,
                          minWidth: 32
                        }
                      }}
                    >
                      <ListItemIcon>{subItem.icon}</ListItemIcon>
                      <ListItemText 
                        primary={subItem.text}
                        sx={{ 
                          '& .MuiListItemText-primary': {
                            fontSize: '0.875rem'
                          }
                        }}
                      />
                    </MenuItem>
                  ))}
                </Menu>
              </>
            ) : (
              <ListItem disablePadding>
                <ListItemButton
                  selected={location.pathname === item.link}
                  component={Link}
                  to={item.link}
                >
                  <ListItemIcon>{item.icon}</ListItemIcon>
                  <ListItemText primary={item.text} />
                </ListItemButton>
              </ListItem>
            )}
          </React.Fragment>
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
