import axios from 'axios';

const API = axios.create({ baseURL: 'http://localhost:5000/api' });

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// automatically redirect to login on 401
API.interceptors.response.use(
  response => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      localStorage.clear();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const login = (credentials) => API.post('/login', credentials);
export const getPatients = () => API.get('/patients');
export const getAlerts = () => API.get('/alerts');
export const acknowledgeAlert = (id) => API.post(`/alerts/${id}/acknowledge`);
export const getPatientConversations = (id) => API.get(`/patients/${id}/conversations`);
export const getPainTrend = (id) => API.get(`/patients/${id}/pain-trend`);