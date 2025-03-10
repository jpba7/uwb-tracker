export const getCSRFToken = () => {
    // First try to get token from cookie
    const cookieValue = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrftoken='))
        ?.split('=')[1];

    if (cookieValue) return cookieValue;

    // If not in cookie, try to get from DOM
    const csrfElement = document.querySelector('[name=csrfmiddlewaretoken]');
    return csrfElement ? csrfElement.value : null;
};

// Create a custom fetch with CSRF token
const fetchWithCSRF = async (url, options = {}) => {
    const csrfToken = getCSRFToken();
    
    if (!csrfToken) {
        throw new Error('CSRF token not found');
    }
    
    // Ensure headers object exists
    const headers = {
        'Content-Type': 'application/json',
        'X-CSRFToken': csrfToken,
        ...options.headers,
    };

    // Always include credentials
    const response = await fetch(url, {
        ...options,
        credentials: 'include',
        headers,
    });

    return response;
};

export default fetchWithCSRF;