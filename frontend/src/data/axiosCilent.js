import axios from 'axios';

//Thư viện axios hỗ trợ cho fetch api
const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor: Add token to every request
// Dùng để kiểm tra auth token của các api thông lưu
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Interceptor: Handle response errors
// xử lý cho token đã hết hạn
axiosClient.interceptors.response.use(
  (response) => response.data,  // Trả về data thôi, không cần .json()
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('refreshToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
