import { apiClient } from './client';

export interface Transaction {
    transactionId: string;
    transactionType: string;
    fromAccountNumber: string;
    toAccountNumber: string;
    beneficiaryName: string;
    amount: number;
    currency: string;
    description: string;
    initiatedAt: string;
    status: string;
    riskScore: number;
    signatureVerified: boolean;
    executedAt?: string;
}

export interface CreateTransactionRequest {
    toAccountNumber: string;
    amount: number;
    description: string;
    beneficiaryName: string;
    transactionType: string;
    currency: string;
}

export const transactionApi = {
    create: async (data: CreateTransactionRequest): Promise<Transaction> => {
        const response = await apiClient.getClient().post('/api/transactions', data);
        return response.data;
    },

    sign: async (id: string, keyId: number): Promise<Transaction> => {
        const response = await apiClient.getClient().post(`/api/transactions/${id}/sign?keyId=${keyId}`);
        return response.data;
    },

    execute: async (id: string): Promise<Transaction> => {
        const response = await apiClient.getClient().post(`/api/transactions/${id}/execute`);
        return response.data;
    },

    verify: async (id: string): Promise<boolean> => {
        const response = await apiClient.getClient().get(`/api/transactions/${id}/verify`);
        return response.data;
    },

    getMyTransactions: async (): Promise<Transaction[]> => {
        const response = await apiClient.getClient().get('/api/transactions');
        return response.data;
    },

    getBalance: async (): Promise<{ balance: number; accountNumber: string; username: string }> => {
        const response = await apiClient.getClient().get('/api/user/balance');
        return response.data;
    },

    getKeys: async (): Promise<any[]> => {
        const response = await apiClient.getClient().get('/api/user/keys');
        return response.data;
    }
};
