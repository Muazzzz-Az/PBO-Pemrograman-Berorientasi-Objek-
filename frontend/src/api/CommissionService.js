import BaseApiService from './BaseApiService';

class CommissionService extends BaseApiService {
    constructor() {
        super('/commissions'); // Mewarisi BaseApiService dan mengarahkan ke tabel commissions
    }
}
export const commissionService = new CommissionService();