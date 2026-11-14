import axios from 'axios';
import { Platform } from 'react-native';

const IP_ADDRESS = '10.244.166.121';
const BASE_URL =
  Platform.OS === 'web'
    ? 'http://localhost:5000/api/todos'
    : `http://${IP_ADDRESS}:5000/api/todos`;

const api = axios.create({
  baseURL: BASE_URL,
  timeout: 5000,
});

export const getTodos = () => api.get('/');
export const createTodo = (title) => api.post('/', { title });
export const updateTodo = (id, data) => api.put(`/${id}`, data);
export const deleteTodo = (id) => api.delete(`/${id}`);

// Archive / Restore helpers
export const archiveTodo = (id) => api.put(`/${id}`, { isArchived: true });
export const restoreTodo = (id) => api.put(`/${id}`, { isArchived: false });