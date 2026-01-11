import api from "./axios";

export interface Account {
    id: number;
    currency: 'USD' | 'EUR';
    balance: string | number;
    userId: number;
}

export const accountService = {
    getAccounts: async (): Promise<Account[]> => {
        const { data } = await api.get("/accounts");
        return data;
    },

    getAccountBalance: async (id: number): Promise<{ balance: string; currency: string }> => {
        const { data } = await api.get(`/accounts/${id}/balance`);
        return data;
    },
};
