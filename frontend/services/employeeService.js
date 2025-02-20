const API_URL = '/employees/api';

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

export const employeeService = {
  getAll: async () => {
    const response = await fetch(`${API_URL}/list`);
    return response.json();
  },

  create: async (employee) => {
    const response = await fetch(`${API_URL}/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCSRFToken(),
      },
      body: JSON.stringify(employee),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw { response: { data: errorData } };
    }
    return response.json();
  },

  update: async (id, employee) => {
    const response = await fetch(`${API_URL}/update/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-CSRFToken': getCSRFToken(),
      },
      body: JSON.stringify(employee),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw { response: { data: errorData } };
    }
    return response.json();
  },

  delete: async (id) => {
    await fetch(`${API_URL}/delete/${id}`, {
      method: 'DELETE',
      headers: {
        'X-CSRFToken': getCSRFToken(),
      },
    });
  },
};