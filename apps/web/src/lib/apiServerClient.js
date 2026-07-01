const API_SERVER_URL = import.meta.env.VITE_API_URL || '/hcgi/api';

const apiServerClient = {
    fetch: async (url, options = {}) => {
        options.credentials = options.credentials || 'include';
        return await window.fetch(API_SERVER_URL + url, options);
    }
};

export default apiServerClient;

export { apiServerClient };
