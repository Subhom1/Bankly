"use client";

import { useEffect, useState } from "react";
import Card from "@/app/components/Card";
import { accountService, Account } from "@/app/services/account.service";

const formatCurrency = (amount: number | string, currency: string) => {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(numAmount);
};

export default function Dashboard() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAccounts = async () => {
      try {
        const data = await accountService.getAccounts();
        setAccounts(data);
      } catch (err: any) {
        console.error("Failed to fetch accounts:", err);
        setError("Failed to load account balances.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchAccounts();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-100 text-red-600 rounded-xl">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Balances Section */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {accounts.map((account) => (
            <Card
              key={account.id}
              title={`${account.currency} Wallet`}
              value={formatCurrency(account.balance, account.currency)}
              className="h-32"
            />
          ))}
          {accounts.length === 0 && (
            <p className="text-gray-500 italic">No accounts found.</p>
          )}
        </div>
      </section>

      {/* Recent Activity Section placeholder */}
      <section>
        <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center">
          <p className="text-gray-500">No recent activity yet.</p>
        </div>
      </section>
    </div>
  );
}
