import axios from 'axios';

const apiClient = axios.create({
  // Use relative URL so Vite's dev proxy forwards to backend (port 5000).
  // In production, set VITE_API_URL to your deployed backend URL.
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
});

export default apiClient;
