import { useAuthContext } from "@/app/context/AuthContext";
import { authService } from "@/app/services/auth.service";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export const useAuth = () => {
    const { user, setUser } = useAuthContext();
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const login = async (email: string, pass: string) => {
        try {
            const data = await authService.login(email, pass);
            localStorage.setItem("token", data.access_token);
            localStorage.setItem("user", JSON.stringify(data.user));
            setUser(data.user);
            router.push("/dashboard");
        } catch (error) {
            console.error("Login failed:", error);
            throw error;
        }
    };

    const register = async (email: string, pass: string) => {
        try {
            await authService.register(email, pass);
            // Automatically login after register
            await login(email, pass);
        } catch (error) {
            console.error("Registration failed:", error);
            throw error;
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
        router.push("/login");
    };

    // Persist user on refresh
    useEffect(() => {
        const savedUser = localStorage.getItem("user");
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch (e) {
                console.error("Failed to parse saved user", e);
            }
        }
        setIsLoading(false);
    }, [setUser]);

    return {
        user,
        isLoading,
        login,
        register,
        logout,
        isAuthenticated: !!user,
    };
};
