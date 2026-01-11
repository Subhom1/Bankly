"use client";

import React, { useState } from "react";
import Card from "@/app/components/Card";
import Button from "@/app/components/Button";
import Input from "@/app/components/Input";
import { useRouter } from "next/navigation";

interface AuthFormProps {
    initialMode?: "login" | "signup";
}

export default function AuthForm({ initialMode = "login" }: AuthFormProps) {
    const [mode, setMode] = useState<"login" | "signup">(initialMode);
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            setIsLoading(false);
            router.push("/dashboard");
        }, 1500);
    };

    const toggleMode = () => {
        setMode((prev) => (prev === "login" ? "signup" : "login"));
    };

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
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {mode === "signup" && (
                            <Input
                                label="Full Name"
                                type="text"
                                required
                                placeholder="John Doe"
                            />
                        )}
                        <Input
                            label="Email Address"
                            type="email"
                            required
                            placeholder="you@example.com"
                        />
                        <Input
                            label="Password"
                            type="password"
                            required
                            placeholder="••••••••"
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
