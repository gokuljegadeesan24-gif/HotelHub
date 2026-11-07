import axios from 'axios';

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

const api = axios.create({ baseURL: BASE_URL });

export const imageUrl = (path) => (path ? `${BASE_URL}/${path}` : '');

export const formatPrice = (price) => '₹' + Number(price).toLocaleString('en-IN');

export const getError = (err) => {
  if (err.response?.data?.errors) return err.response.data.errors;
  if (err.response?.data?.message) return [err.response.data.message];
  return ['Something went wrong. Please try again.'];
};

export default api;
