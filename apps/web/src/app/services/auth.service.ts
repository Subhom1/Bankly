import api from "./axios";

export const authService = {
    login: async (email: string, pass: string) => {
        const { data } = await api.post("/auth/login", { email, password: pass });
        return data;
    },
    register: async (email: string, pass: string) => {
        const { data } = await api.post("/auth/register", { email, password: pass });
        return data;
    },
};
