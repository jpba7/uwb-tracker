import * as React from 'react';
import { styled } from '@mui/material/styles';
import Avatar from '@mui/material/Avatar';
import MuiDrawer, { drawerClasses } from '@mui/material/Drawer';
import Box from '@mui/material/Box';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MenuContent from './MenuContent';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import IconButton from '@mui/material/IconButton';
import { useUser } from '../../contexts/UserContext';

import { SitemarkIconWithText } from '../../shared-theme/CustomIcons'

const drawerWidth = 240;

const Drawer = styled(MuiDrawer)({
  width: drawerWidth,
  flexShrink: 0,
  boxSizing: 'border-box',
  mt: 10,
  [`& .${drawerClasses.paper}`]: {
    width: drawerWidth,
    boxSizing: 'border-box',
  },
});

export default function SideMenu() {
  const { user, loading } = useUser();

  return (
    <Drawer
      variant="permanent"
      sx={{
        display: { xs: 'none', md: 'block' },
        [`& .${drawerClasses.paper}`]: {
          backgroundColor: 'background.paper',
        },
      }}
    >
      <Box
        sx={{
          display: 'flex',
          mt: 'calc(var(--template-frame-height, 0px) + 4px)',
          p: 1.5,
        }}
      >
        <SitemarkIconWithText />
      </Box>
      <Divider />
      <Box
        sx={{
          overflow: 'auto',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <MenuContent />
      </Box>
      <Stack
        direction="row"
        sx={{
          p: 2,
          gap: 1,
          alignItems: 'center',
          borderTop: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Avatar
          sizes="small"
          alt={user?.first_name || 'User'}
          src={user?.avatar || "/static/images/avatar/default.jpg"}
          sx={{ width: 36, height: 36 }}
        />
        <Box sx={{ mr: 'auto' }}>
          <Typography variant="body2" sx={{ fontWeight: 500, lineHeight: '16px' }}>
            {loading ? 'Loading...' : (user ? `${user.first_name} ${user.last_name}` : 'User')}
          </Typography>
          <Typography variant="caption" sx={{ color: 'text.secondary' }}>
            {loading ? 'Loading...' : (user?.username || '')}
          </Typography>
        </Box>
        <IconButton
          onClick={() => {
            window.location.href = "/accounts/logout/";
          }}
          size="small"
          color="inherit"
          aria-label="logout"
          sx={{
            '&:hover': {
              color: 'error.main',
            },
          }}
        >
          <LogoutRoundedIcon />
        </IconButton>
      </Stack>
    </Drawer>
  );
}
