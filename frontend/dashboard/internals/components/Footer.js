import * as React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

export default function Footer(props) {
  return (
    <Typography
      variant="body2"
      align="center"
      {...props}
      sx={[
        {
          color: 'text.secondary',
        },
        ...(Array.isArray(props.sx) ? props.sx : [props.sx]),
      ]}
    >
      {'Desenvolvido por João Pedro Bimbato ('}
      <Link color="inherit" href="https://www.github.com/jpba7">
        GitHub
      </Link>{' | '}
      <Link color="inherit" href="https://www.linkedin.com/in/jpbimbato/">
        LinkedIn
      </Link>{').'}
    </Typography>
  );
}
