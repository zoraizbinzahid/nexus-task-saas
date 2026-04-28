import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8000/api',
    withCredentials: true, // CRITICAL: This sends the cookies to Django
    headers: {
        'Content-Type': 'application/json',
    },
});

export default api;