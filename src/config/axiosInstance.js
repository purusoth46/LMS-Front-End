import axios from 'axios';

const BASE_URL = "https://lms-back-end-1.onrender.com/api/v1/";
const axiosInstance = axios.create({
    baseURL: BASE_URL,
    timeout: 10000,
    withCredentials: true
});

export default axiosInstance;