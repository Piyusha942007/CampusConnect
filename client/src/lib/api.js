import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  const userInfo = JSON.parse(localStorage.getItem('userInfo') || 'null');
  const actualToken = token || (userInfo && userInfo.token);
  
  if (actualToken) {
    config.headers.Authorization = `Bearer ${actualToken}`;
  }
  return config;
});

export default api;
