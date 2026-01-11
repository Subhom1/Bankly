"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Sidebar() {
    const pathname = usePathname();

    const navItems = [
        { label: "Dashboard", href: "/dashboard" },
        { label: "Transfer", href: "/transfer" },
        { label: "Exchange", href: "/exchange" },
        { label: "Transactions", href: "/transactions" },
    ];

    return (
        <aside className="w-64 bg-white border-r border-gray-200 hidden md:block text-slate-900">
            <div className="p-6">
                <h1 className="text-2xl font-bold text-blue-600">Bankly</h1>
            </div>
            <nav className="mt-6 px-4 space-y-2">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`block px-4 py-2 rounded-lg transition-colors ${isActive
                                    ? "bg-blue-50 text-blue-600 font-medium"
                                    : "text-gray-700 hover:bg-blue-50 hover:text-blue-600"
                                }`}
                        >
                            {item.label}
                        </Link>
                    );
                })}
            </nav>
        </aside>
    );
}
