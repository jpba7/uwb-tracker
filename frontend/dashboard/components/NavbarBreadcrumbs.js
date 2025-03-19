import * as React from 'react';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Breadcrumbs, { breadcrumbsClasses } from '@mui/material/Breadcrumbs';
import NavigateNextRoundedIcon from '@mui/icons-material/NavigateNextRounded';
import { Link, useLocation } from 'react-router-dom';

const StyledBreadcrumbs = styled(Breadcrumbs)(({ theme }) => ({
  margin: theme.spacing(1, 0),
  [`& .${breadcrumbsClasses.separator}`]: {
    color: (theme.vars || theme).palette.action.disabled,
    margin: 1,
  },
  [`& .${breadcrumbsClasses.ol}`]: {
    alignItems: 'center',
  },
}));

// Mapeamento de rotas para nomes em português
const routeNameMap = {
  index: 'Início',
  employees: 'Funcionários',
  devices: 'Dispositivos',
  'device-histories': 'Histórico de Uso',
  heatmap: 'Heatmap',
  tracker: 'Rastreamento'
};

export default function NavbarBreadcrumbs() {
  const location = useLocation();

  const getBreadcrumbs = () => {
    const pathnames = location.pathname
      .split('/')
      .filter(x => x && isNaN(x));
    
    const breadcrumbs = [{
      name: 'UWB Tracker',
      path: '/'
    }];

    pathnames.forEach((value, index) => {
      const path = '/' + pathnames.slice(0, index + 1).join('/');
      const name = routeNameMap[value] || value;
      
      breadcrumbs.push({
        name: name,
        path: path
      });
    });

    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  return (
    <StyledBreadcrumbs
      aria-label="breadcrumb"
      separator={<NavigateNextRoundedIcon fontSize="small" />}
    >
      {breadcrumbs.map((crumb, index) => {
        const isLast = index === breadcrumbs.length - 1;

        return isLast ? (
          <Typography 
            key={crumb.path}
            variant="body1" 
            sx={{ color: 'text.primary', fontWeight: 600 }}
          >
            {crumb.name}
          </Typography>
        ) : (
          <Link
            key={crumb.path}
            to={crumb.path}
            style={{ 
              textDecoration: 'none', 
              color: 'inherit'
            }}
          >
            <Typography variant="body1">
              {crumb.name}
            </Typography>
          </Link>
        );
      })}
    </StyledBreadcrumbs>
  );
}
