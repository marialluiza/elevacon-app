import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8080/documentos', // URL base da sua API
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
