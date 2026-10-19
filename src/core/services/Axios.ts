import axios from 'axios';

export type ApiResponse = {
  ok: boolean;
  status: number;
};

const axiosInstance = axios.create({
  baseURL: `${import.meta.env.VITE_SERVER_BASE_URL}/api/v1/`,
  withCredentials: true,
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error),
);

export default axiosInstance;
