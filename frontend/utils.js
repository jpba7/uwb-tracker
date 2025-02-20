export const getCSRFToken = () => {
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

// Create a custom fetch with CSRF token
const fetchWithCSRF = async (url, options = {}) => {
  // Ensure headers object exists
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  // Add CSRF token for non-GET requests
  if (options.method && options.method !== 'GET') {
    headers['X-CSRFToken'] = getCSRFToken();
  }

  const response = await fetch(url, {
    ...options,
    headers,
  });

  return response;
};

export default fetchWithCSRF;