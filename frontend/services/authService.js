import fetchWithCSRF from '../utils';

const API_URL = '/api/auth';

export const authService = {
  login: async (username, password) => {
    const response = await fetchWithCSRF(`${API_URL}/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Login failed');
    }

    return response.json();
  },

  logout: async () => {
    const response = await fetch(`${API_URL}/logout/`, {
      method: 'POST',
      headers: {
        'X-CSRFToken': getCSRFToken(),
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Logout failed');
    }
  },

  getCurrentUser: async () => {
    const response = await fetch(`${API_URL}/user/`, {
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Failed to get current user');
    }

    return response.json();
  },
};
