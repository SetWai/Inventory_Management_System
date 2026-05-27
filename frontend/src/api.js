import axios from 'axios';

const API = axios.create({
  baseURL: 'https://inventory-management-system-3rux.onrender.com',
});

let navigateFunction = null;
let setTokenFunction = null;

export const setupNavigate = (navigate, setToken) => {
  navigateFunction = navigate;
  setTokenFunction = setToken;
};

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      if (error.config.url.includes('token/')) {
        return Promise.reject(error); 
      }

      localStorage.removeItem('token');
      
      if (setTokenFunction) {
        setTokenFunction(null);
      }

      if (navigateFunction) {
        navigateFunction('/login?expired=true');
      }
      return new Promise(() => {}); 
    }
    return Promise.reject(error);
  }
);

export default API;