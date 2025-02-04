import * as React from 'react';
import SvgIcon from '@mui/material/SvgIcon';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';


export function SitemarkIcon() {
  const theme = useTheme();
  const color = theme.palette.mode === 'dark' ? '#fff' : '#000';

  return (
      <SvgIcon sx={{ height: 40, width: 40 }}>
        <svg
          width="40"
          height="40"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="50" cy="50" r="45" stroke={color} strokeWidth="4" fill="none" />
          <path d="M20 50 Q50 20, 80 50" stroke={color} strokeWidth="3" fill="none" />
          <path d="M25 50 Q50 30, 75 50" stroke={color} strokeWidth="2" fill="none" />
          <path d="M30 50 Q50 40, 70 50" stroke={color} strokeWidth="1.5" fill="none" />
          <circle cx="50" cy="50" r="5" fill={color} />
          <circle cx="50" cy="50" r="10" stroke={color} strokeWidth="2" fill="none" />
        </svg>
      </SvgIcon>
  );
}

export function SitemarkIconWithText() {
  const theme = useTheme();
  const color = theme.palette.mode === 'dark' ? '#fff' : '#000';

  return (
    <Box display="flex" alignItems="center">
      <SvgIcon sx={{ height: 40, width: 40 }}>
        <svg
          width="40"
          height="40"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <circle cx="50" cy="50" r="45" stroke={color} strokeWidth="4" fill="none" />
          <path d="M20 50 Q50 20, 80 50" stroke={color} strokeWidth="3" fill="none" />
          <path d="M25 50 Q50 30, 75 50" stroke={color} strokeWidth="2" fill="none" />
          <path d="M30 50 Q50 40, 70 50" stroke={color} strokeWidth="1.5" fill="none" />
          <circle cx="50" cy="50" r="5" fill={color} />
          <circle cx="50" cy="50" r="10" stroke={color} strokeWidth="2" fill="none" />
        </svg>
      </SvgIcon>
      <Typography variant="h6" sx={{ marginLeft: 1, fontFamily: 'Roboto, sans-serif', color: color }}>
        Telescope
      </Typography>
    </Box>
  );
}