"use client";

import React, { useState, useEffect } from "react";
import Card from "@/app/components/Card";
import Button from "@/app/components/Button";
import Input from "@/app/components/Input";
import { useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";

interface AuthFormProps {
    initialMode?: "login" | "signup";
}

export default function AuthForm({ initialMode = "login" }: AuthFormProps) {
    const [mode, setMode] = useState<"login" | "signup">(initialMode);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { login, register, isAuthenticated, isLoading: isAuthLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isAuthLoading && isAuthenticated) {
            router.push("/dashboard");
        }
    }, [isAuthLoading, isAuthenticated, router]);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [name, setName] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);

        try {
            if (mode === "login") {
                await login(email, password);
            } else {
                await register(email, password);
            }
        } catch (err: any) {
            setError(
                err.response?.data?.message || "Authentication failed. Please try again."
            );
        } finally {
            setIsLoading(false);
        }
    };

    const toggleMode = () => {
        setMode((prev) => (prev === "login" ? "signup" : "login"));
        setError(null);
    };

    if (isAuthLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (isAuthenticated) {
        return null; // Will redirect via useEffect
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-blue-600 mb-2">Bankly</h1>
                    <p className="text-gray-600">
                        {mode === "login"
                            ? "Welcome back! Please enter your details."
                            : "Create an account to get started."}
                    </p>
                </div>

                <Card className="p-8 shadow-xl">
                    {error && (
                        <div className="mb-4 p-3 bg-red-50 border border-red-100 text-red-600 text-sm rounded-lg">
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {mode === "signup" && (
                            <Input
                                label="Full Name"
                                type="text"
                                required
                                placeholder="John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            />
                        )}
                        <Input
                            label="Email Address"
                            type="email"
                            required
                            placeholder="you@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Input
                            label="Password"
                            type="password"
                            required
                            placeholder="••••••••"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />

                        <Button type="submit" className="w-full mt-6" isLoading={isLoading}>
                            {mode === "login" ? "Sign In" : "Create Account"}
                        </Button>
                    </form>

                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-600">
                            {mode === "login"
                                ? "Don't have an account?"
                                : "Already have an account?"}
                            {" "}
                            <button
                                onClick={toggleMode}
                                className="text-blue-600 font-medium hover:underline focus:outline-none"
                            >
                                {mode === "login" ? "Sign Up" : "Log In"}
                            </button>
                        </p>
                    </div>
                </Card>
            </div>
        </div>
    );
}
