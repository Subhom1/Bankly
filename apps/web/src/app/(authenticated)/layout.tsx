"use client";

import Scaffold from "@/app/components/Scaffold";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "@/app/hooks/useAuth";
import { useEffect } from "react";

export default function AuthenticatedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();
    const { user, isLoading, isAuthenticated } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            router.push("/login");
        }
    }, [isLoading, isAuthenticated, router]);

    // Map pathname to title
    const getTitle = (path: string) => {
        switch (path) {
            case "/dashboard":
                return "Dashboard";
            case "/transfer":
                return "Transfer";
            case "/exchange":
                return "Exchange";
            case "/transactions":
                return "Transactions";
            default:
                return "Bankly";
        }
    };

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null; // Will redirect via useEffect
    }

    return <Scaffold title={getTitle(pathname)}>{children}</Scaffold>;
}
