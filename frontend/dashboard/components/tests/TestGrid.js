import * as React from 'react';
import { useState, useEffect } from 'react';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Footer from '../../internals/components/Footer';
import Heatmap from '../../../graphs/Heatmap';


export default function TestGrid() {
  const [XYD, setXYD] = useState([]);


  useEffect(() => {
    fetch('/devices/datapoints/heatmap')
      .then(response => response.json())
      .then(data => {
        const heatmapData = data.xyd.map(item => [item[0], item[1], item[2]]);
        setXYD(heatmapData);
      })
      .catch(error => console.error('Error fetching data:', error));
  }, []);

  return (
    <Box sx={{ width: '100%', maxWidth: { sm: '100%', md: '1700px' } }}>
      {/* cards */}
      <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
        Funcionários
      </Typography>
      <Grid container spacing={2} columns={12}>
        <Grid size={{ xs: 12, lg: 12 }}>
          <Heatmap xyd_data={XYD} />
        </Grid>
      </Grid>
      <Footer sx={{ my: 4 }} />
    </Box>
  );
}