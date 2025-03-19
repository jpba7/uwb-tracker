const API_URL = '/devices/api/device-history';

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

export const deviceHistoryService = {
    getAll: async () => {
        const response = await fetch(`${API_URL}/`, {
            method: 'GET',
            headers: {
                'X-CSRFToken': getCSRFToken(),
            },
            });
        if (!response.ok) {
            throw new Error('Falha ao buscar lista de histórico de usos dos dispositivos');
            }
        return response.json();
    },

    getDeviceHistory: async (employeeId) => {
        const response = await fetch(`${API_URL}/employee/${employeeId}/`, {
        method: 'GET',
        headers: {
            'X-CSRFToken': getCSRFToken(),
        },
        });
        if (!response.ok) {
            throw new Error('Falha ao buscar histórico de dispositivo do funcionário com ID: ' + employeeId);
        }
        return response.json();
    },

    create: async (data) => {
        const response = await fetch(`${API_URL}/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken(),
            },
            body: JSON.stringify({
                device: data.device,
                employee: data.employee,
                is_active: data.is_active,
                start_date: data.start_date,
                end_date: data.end_date
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw { response: { data: errorData } };
        }

        return response.json();
    },

    update: async (id, data) => {
        const response = await fetch(`${API_URL}/${id}/`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken(),
            },
            body: JSON.stringify({
                device: data.device,
                employee: data.employee,
                is_active: data.is_active,
                start_date: data.start_date,
                end_date: data.end_date
            }),
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw { response: { data: errorData } };
        }

        return response.json();
    },

    delete: async (id) => {
        const response = await fetch(`${API_URL}/${id}/`, {
            method: 'DELETE',
            headers: {
                'X-CSRFToken': getCSRFToken(),
            },
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw { response: { data: errorData } };
        }

        return true;
    },

    getActiveHistory: async () => {
        const response = await fetch(`${API_URL}/active-history/`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': getCSRFToken(),
            },
        });
        if (!response.ok) {
            throw new Error('Falha ao buscar histórico ativo');
        }
        return response.json();
    }
};