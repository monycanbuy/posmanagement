import axios from 'axios';

import { refreshToken } from '../features/customers/customerSlice';
import store from '../store';

axios.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      await store.dispatch(refreshToken());
      const newToken = store.getState().customers.token;
      axios.defaults.headers.common['Authorization'] = `Bearer ${newToken}`;
      originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
      return axios(originalRequest);
    }
    return Promise.reject(error);
  }
);
