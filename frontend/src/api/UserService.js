// frontend/src/api/UserService.js
import BaseApiService from './BaseApiService';

export default class UserService extends BaseApiService {
    constructor() {
        // Memanggil constructor kelas induk dengan path '/users'
        super('/users');
    }

    // Polimorfisme Dinamis (Metode khusus yang tidak ada di induk)
    async login(credentials) {
        // Asumsi backend memiliki endpoint /auth/login
        const response = await this.client.post('/auth/login', credentials);
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }
        return response.data;
    }

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    }
}