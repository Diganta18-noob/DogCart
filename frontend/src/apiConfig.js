import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';

const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use(
    (config) => {
        const storedUser = localStorage.getItem('pawmart_user');
        if (storedUser) {
            try {
                const { token } = JSON.parse(storedUser);
                if (token) {
                    config.headers.Authorization = `Bearer ${token}`;
                }
            } catch (error) {
                console.error('Error parsing stored user:', error);
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('pawmart_user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

export default api;

export const endpoints = {
    login: '/users/login',
    signup: '/users/register',
    forgotPassword: '/users/forgot-password',
    users: '/users',
    userById: (id) => `/users/${id}`,
    pets: '/dogs',
    petById: (id) => `/dogs/${id}`,
    orders: '/orders',
    orderById: (id) => `/orders/${id}`,
    ordersByUser: (userId) => `/orders/user/${userId}`,
    reviews: '/reviews',
    reviewById: (id) => `/reviews/${id}`,
    reviewsByPet: (petId) => `/reviews/dog/${petId}`,
    reviewsByUser: (userId) => `/reviews/user/${userId}`,
    dashboardStats: '/dashboard/stats',
    dashboardUsers: '/dashboard/users',
};
