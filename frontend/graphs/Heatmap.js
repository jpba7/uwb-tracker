import React, { useEffect, useState } from 'react';

const Heatmap = React.memo(({ employee_cpf = null, start_date = null, end_date = null}) => {
  const [imageUrl, setImageUrl] = useState(null);
    
  useEffect(() => {
    const params = new URLSearchParams();
    
    if (employee_cpf) params.append('cpf', employee_cpf);
    if (start_date) params.append('start_date', start_date);
    if (end_date) params.append('end_date', end_date);

    const url = `/devices/datapoints/heatmap/seaborn${params.toString() ? `?${params}` : ''}`;
    
    // Atualiza a URL da imagem para forçar o navegador a buscar uma nova versão
    setImageUrl(url);
  }, [employee_cpf, start_date, end_date]);

  return (
    <div style={{ width: '100%', height: '100%', display: 'flex', justifyContent: 'center' }}>
      {imageUrl && (
        <img 
          src={imageUrl} 
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