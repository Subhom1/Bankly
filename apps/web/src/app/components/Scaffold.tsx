import { ReactNode } from "react";
import Sidebar from "@/app/components/Sidebar";
import Link from "next/link";

interface LayoutProps {
  children: ReactNode;
  title: string;
}

export default function Layout({ children, title }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <header className="bg-white border-b border-gray-200 h-16 flex items-center px-8 justify-between shadow-sm relative">
          <h2 className="text-xl font-semibold text-gray-800">{title}</h2>
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                U
              </div>
              <span className="text-sm font-medium text-gray-700">User</span>
            </div>

            <Link
              href="/login"
              className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors"
            >
              Sign out
            </Link>
          </div>
        </header>
        <main className="flex-1 p-8 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}
