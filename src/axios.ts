import axios from 'axios';
import Swal from 'sweetalert2';

const apiBaseUrl = import.meta.env.VITE_NET;

const axiosInstance = axios.create({
  baseURL: apiBaseUrl,
});

axiosInstance.interceptors.request.use(config => {
  const token = getCookie('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response) {
      Swal.fire({
        title: 'Error',
        text: error?.response?.data?.error,
        icon: 'error',
        confirmButtonText: '¡Entendido!'
      })
      if(!error?.response?.data?.error) removeCookie('token');
    } else if (error.request) {
      Swal.fire({
        title: 'No se recibió respuesta',
        text: '',
        icon: 'error',
        confirmButtonText: '¡Entendido!'
      })
    } else {
      Swal.fire({
        title: 'Error al configurar la solicitud',
        text: '',
        icon: 'error',
        confirmButtonText: '¡Entendido!'
      })
    }
    return Promise.reject(error);
  }
);

const getCookie = (name: string) => {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) {
    return parts.pop()?.split(';').shift();
  }
  return undefined;
}

const removeCookie = (name: string) => {
  document.cookie = `${name}=; Max-Age=0; path=/`;
};

export default axiosInstance;
