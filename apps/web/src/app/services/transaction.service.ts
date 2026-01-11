import api from "./axios";

export enum TransactionType {
    TRANSFER = 'TRANSFER',
    EXCHANGE = 'EXCHANGE',
}

export interface Transaction {
    id: number;
    type: TransactionType;
    amount: string;
    createdAt: string;
    ledger: {
        id: number;
        amount: string;
        account: {
            currency: string;
        };
    }[];
}

export const transactionService = {
    transfer: async (recipientEmail: string, amount: number, currency: string) => {
        const { data } = await api.post("/transactions/transfer", {
            recipientEmail,
            amount,
            currency,
        });
        return data;
    },

    exchange: async (fromCurrency: string, toCurrency: string, fromAmount: number) => {
        const { data } = await api.post("/transactions/exchange", {
            fromCurrency,
            toCurrency,
            fromAmount,
        });
        return data;
    },

    getTransactions: async (type?: TransactionType, page = 1, limit = 10) => {
        const { data } = await api.get("/transactions", {
            params: { type, page, limit },
        });
        return data;
    },
};
