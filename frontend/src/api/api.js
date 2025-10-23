import axios from 'axios';

const API = axios.create({
  baseURL:'http://localhost:5001/api'||  import.meta.env.VITE_API_URL
});
console.log(`${ import.meta.env.VITE_API_URL}`);
// attach token if present
API.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default API;
