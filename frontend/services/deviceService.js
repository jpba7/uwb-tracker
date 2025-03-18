const API_URL = '/devices/api';

// Function to get CSRF token from cookie
const getCSRFToken = () => {
  const name = 'csrftoken';
  let cookieValue = null;
  if (document.cookie && document.cookie !== '') {
    const cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      if (cookie.substring(0, name.length + 1) === (name + '=')) {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
};

export const deviceService = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/`, {
      method: 'GET',
      headers: {
          'Content-Type': 'application/json',
      },
    });
    if (!response.ok) {
        throw new Error('Failed to fetch devices');
    }
    return response.json();
  },

  getDeviceTypes: async () => {
    const response = await fetch(`${API_URL}/device-types`);
    return response.json();
  },

  create: async (device) => {
    const response = await fetch(`${API_URL}/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCSRFToken(),
      },
      body: JSON.stringify(device),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw { response: { data: errorData } };
    }
    return response.json();
  },

  update: async (id, device) => {
    const response = await fetch(`${API_URL}/${id}/`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCSRFToken(),
      },
      body: JSON.stringify(device),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw { response: { data: errorData } };
    }
    return response.json();
  },

  delete: async (id) => {
    await fetch(`${API_URL}/${id}/`, {
      method: 'DELETE',
      headers: {
        'X-CSRFToken': getCSRFToken(),
      },
    });
  },

  toggleStatus: async(id) => {
    const response = await fetch(`${API_URL}/${id}/toggle_status/`, {
      method: 'POST',
      headers: {
        'X-CSRFToken': getCSRFToken(),
      },
    });
    if (!response.ok) {
      throw new Error('Falha ao alterar status do dispositivo');
    }
    return response.json();
  }
};