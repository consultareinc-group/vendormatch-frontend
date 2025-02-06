import { defineBoot } from '#q-app/wrappers';
import axios from 'axios';
import { LocalStorage } from 'quasar';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  withCredentials: true, // Keep false unless your backend requires cookies
  headers: {
    'Content-Type': 'application/json',
  },
});

// 🔹 Attach token dynamically before every request
api.interceptors.request.use((config) => {
  const token = LocalStorage.getItem('Bearer');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

export default defineBoot(({ app }) => {
  app.config.globalProperties.$axios = axios;
  app.config.globalProperties.$api = api;
});

export { api };
