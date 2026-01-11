"use client";

import { useEffect, useState } from "react";
import Card from "@/app/components/Card";
import { accountService, Account } from "@/app/services/account.service";
import { transactionService, Transaction } from "@/app/services/transaction.service";

const formatCurrency = (amount: number | string, currency: string) => {
  const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(numAmount);
};

export default function Dashboard() {
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [accData, txData] = await Promise.all([
          accountService.getAccounts(),
          transactionService.getTransactions(undefined, 1, 5),
        ]);
        setAccounts(accData);
        setTransactions(txData.data);
      } catch (err: any) {
        console.error("Failed to fetch dashboard data:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 bg-red-50 border border-red-100 text-red-600 rounded-2xl flex items-center justify-center">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {/* Balances Section */}
      <section>
        <h3 className="text-lg font-semibold text-gray-900 mb-6 px-1">Your Wallets</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-4">
          {accounts.map((account) => (
            <Card
              key={account.id}
              title={`${account.currency} Wallet`}
              value={formatCurrency(account.balance, account.currency)}
              className="h-36 relative overflow-hidden group hover:shadow-lg transition-all border-gray-100 shadow-sm"
            >
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <span className="text-4xl font-bold">{account.currency}</span>
              </div>
            </Card>
          ))}
          {accounts.length === 0 && (
            <p className="text-gray-500 italic p-4">No accounts found.</p>
          )}
        </div>
      </section>

      {/* Recent Activity Section */}
      <section>
        <div className="flex items-center justify-between mb-6 px-1">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
          <a href="/transactions" className="text-sm font-medium text-blue-600 hover:text-blue-700 transition-colors">
            View all
          </a>
        </div>

        <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
          {transactions.length > 0 ? (
            <div className="divide-y divide-gray-50">
              {transactions.map((tx) => {
                const date = new Date(tx.createdAt).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                });

                return (
                  <div key={tx.id} className="p-6 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                    <div className="flex items-center gap-5">
                      <div className={`h-12 w-12 rounded-2xl flex items-center justify-center text-xl shadow-sm ${tx.type === 'TRANSFER' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'
                        }`}>
                        {tx.type === 'TRANSFER' ? '→' : '⇄'}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-gray-900 capitalize">
                          {tx.type.toLowerCase()}
                        </div>
                        <div className="text-xs text-gray-500 font-medium">{date}</div>
                      </div>
                    </div>

                    <div className="text-right">
                      <div className={`text-sm font-bold ${tx.type === 'TRANSFER' ? 'text-gray-900' : 'text-gray-900'
                        }`}>
                        {formatCurrency(tx.amount, tx.ledger[0]?.account.currency || "USD")}
                      </div>
                      <div className="text-[10px] text-gray-400 font-bold uppercase tracking-widest mt-0.5">
                        {tx.ledger[0]?.account.currency}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="p-16 text-center">
              <div className="text-3xl mb-4">📭</div>
              <p className="text-gray-500 font-medium">No transactions yet.</p>
              <p className="text-xs text-gray-400 mt-1">Your recent activity will appear here.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
