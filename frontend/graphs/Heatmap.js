import React, { useEffect, useState } from 'react';
import { CircularProgress } from '@mui/material';

const Heatmap = React.memo(({ employee_id = null, device_id = null, start_date = null, end_date = null}) => {
  const [imageData, setImageData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
    
  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    
    if (employee_id) params.append('employee_id', employee_id);
    if (device_id) params.append('device_id', device_id);
    if (start_date) params.append('start_date', start_date);
    if (end_date) params.append('end_date', end_date);

    const url = `/devices/datapoints/heatmap${params.toString() ? `?${params}` : ''}`;
    
    fetch(url)
      .then(response => {
        if (!response.ok) {
          if (response.status === 404) {
            throw new Error('Não há dados disponíveis para os parâmetros informados.');
          }
          throw new Error('Erro ao carregar o heatmap.');
        }
        return response.blob();
      })
      .then(blob => {
        // Criando URL a partir do blob recebido
        const imageObjectUrl = URL.createObjectURL(blob);
        setImageData(imageObjectUrl);
        setError(null);
      })
      .catch(err => {
        setError(err.message);
        setImageData(null);
      })
      .finally(() => {
        setLoading(false);
      });
      
    // Limpeza do objectURL quando o componente desmontar
    return () => {
      if (imageData) {
        URL.revokeObjectURL(imageData);
      }
    };
  }, [employee_id, start_date, end_date]);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      {loading ? (
        <CircularProgress color="primary" />
      ) : error ? (
        <div style={{ 
          padding: '20px', 
          textAlign: 'center',
          color: '#666',
          fontSize: '1.2em'
        }}>
          {error}
        </div>
      ) : (
        <img 
          src={imageData} 
          alt="Heatmap"
          style={{
            maxWidth: '100%',
            height: 'auto',
            objectFit: 'contain'
          }}
        />
      )}
    </div>
  );
});

export default Heatmap;