"use client";

import Scaffold from "@/app/components/Scaffold";
import { usePathname } from "next/navigation";

export default function AuthenticatedLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const pathname = usePathname();

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

    return <Scaffold title={getTitle(pathname)}>{children}</Scaffold>;
}
