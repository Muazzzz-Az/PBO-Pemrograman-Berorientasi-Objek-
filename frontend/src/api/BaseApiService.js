// frontend/src/api/BaseApiService.js
import axios from 'axios';

export default class BaseApiService {
    constructor(resourcePath) {
        if (new.target === BaseApiService) {
            throw new Error("Abstraksi: BaseApiService tidak boleh diinstansiasi secara langsung.");
        }
        
        // ENKAPSULASI: Konfigurasi dasar dilindungi di dalam instance ini
        this.resourcePath = resourcePath;
        this.client = axios.create({
            baseURL: 'http://localhost:8080/api', // Sesuaikan port backend Anda
            headers: {
                'Content-Type': 'application/json',
            },
        });

        // Interceptor untuk menyisipkan token otomatis (jika ada)
        this.client.interceptors.request.use((config) => {
            const token = localStorage.getItem('token');
            if (token) config.headers.Authorization = `Bearer ${token}`;
            return config;
        });
    }

    // Metode dasar CRUD yang akan diwariskan
    async getAll() {
        const response = await this.client.get(this.resourcePath);
        return response.data;
    }

    async getById(id) {
        const response = await this.client.get(`${this.resourcePath}/${id}`);
        return response.data;
    }

    async create(data) {
        const response = await this.client.post(this.resourcePath, data);
        return response.data;
    }
}