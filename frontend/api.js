// файл лежит в my-app/frontend
// название файла api.js

const API_URL = 'http://localhost:5000/api';

// Сохраняем токен в localStorage
export function setToken(token) {
    localStorage.setItem('token', token);
}

export function getToken() {
    return localStorage.getItem('token');
}

export function removeToken() {
    localStorage.removeItem('token');
}

export async function apiRequest(endpoint, method = 'GET', data = null) {
    const token = getToken();
    
    const options = {
        method,
        headers: {
            'Content-Type': 'application/json',
        },
    };

    // Добавляем токен, если он есть
    if (token) {
        options.headers['x-auth-token'] = token;
    }

    if (data) {
        options.body = JSON.stringify(data);
    }

    try {
        const response = await fetch(`${API_URL}${endpoint}`, options);
        const result = await response.json();

        if (!response.ok) {
            throw new Error(result.message || 'Что-то пошло не так');
        }

        return result;
    } catch (error) {
        console.error('API Error:', error);
        throw error;
    }
}