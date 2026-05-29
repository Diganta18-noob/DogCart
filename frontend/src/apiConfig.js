import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '';

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
    login: '/api/users/login',
    signup: '/api/users/register',
    forgotPassword: '/api/users/forgot-password',
    resetPassword: '/api/users/reset-password',
    verifyEmail: '/api/users/verify-email',
    users: '/api/users',
    userById: (id) => `/api/users/${id}`,
    pets: '/api/dogs',
    petById: (id) => `/api/dogs/${id}`,
    orders: '/api/orders',
    orderById: (id) => `/api/orders/${id}`,
    ordersByUser: (userId) => `/api/orders/user/${userId}`,
    reviews: '/api/reviews',
    reviewById: (id) => `/api/reviews/${id}`,
    reviewsByPet: (petId) => `/api/reviews/dog/${petId}`,
    reviewsByUser: (userId) => `/api/reviews/user/${userId}`,
    dashboardStats: '/api/dashboard/stats',
    dashboardUsers: '/api/dashboard/users',
};
