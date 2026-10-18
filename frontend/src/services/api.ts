import axios from 'axios';

const rawBaseUrl = (import.meta.env.VITE_API_URL || 'http://localhost:3000/api').trim().replace(/\/+$/, '');
const baseURL = rawBaseUrl.endsWith('/api') ? rawBaseUrl : `${rawBaseUrl}/api`;

const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
