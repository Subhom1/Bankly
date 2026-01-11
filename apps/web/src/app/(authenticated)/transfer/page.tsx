"use client";

import { useState, useEffect } from "react";
import Card from "@/app/components/Card";
import Button from "@/app/components/Button";
import Input from "@/app/components/Input";
import { accountService, Account } from "@/app/services/account.service";
import { transactionService } from "@/app/services/transaction.service";
import { useRouter } from "next/navigation";

export default function Transfer() {
    const router = useRouter();
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [recipientEmail, setRecipientEmail] = useState("");
    const [amount, setAmount] = useState("");
    const [currency, setCurrency] = useState<"USD" | "EUR">("USD");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const data = await accountService.getAccounts();
                setAccounts(data);
            } catch (err) {
                console.error("Failed to fetch accounts:", err);
            }
        };
        fetchAccounts();
    }, []);

    const selectedAccount = accounts.find((a) => a.currency === currency);
    const availableBalance = selectedAccount ? parseFloat(selectedAccount.balance.toString()) : 0;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(false);

        const numAmount = parseFloat(amount);
        if (isNaN(numAmount) || numAmount <= 0) {
            setError("Please enter a valid amount.");
            setIsLoading(false);
            return;
        }

        if (numAmount > availableBalance) {
            setError("Insufficient funds in your selected wallet.");
            setIsLoading(false);
            return;
        }

        try {
            await transactionService.transfer(recipientEmail, numAmount, currency);
            setSuccess(true);
            setAmount("");
            setRecipientEmail("");
            // Refresh accounts for new balance
            const data = await accountService.getAccounts();
            setAccounts(data);
        } catch (err: any) {
            setError(err.response?.data?.message || "Transfer failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
      <div className="max-w-2xl mx-auto">
        <Card className="p-8 shadow-sm border border-gray-100">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Send Money</h2>

          {success && (
            <div className="mb-6 p-4 bg-green-50 border border-green-100 text-green-700 rounded-xl flex items-center gap-3">
              <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
              Transfer successful!
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">
                Recipient Email
              </label>
              <Input
                type="email"
                required
                placeholder="recipient@example.com"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Currency
                </label>
                <select
                  className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-gray-700 appearance-none"
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value as "USD" | "EUR")}
                >
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-gray-700">
                  Amount
                </label>
                <Input
                  type="number"
                  step="0.01"
                  required
                  placeholder="0.00"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                />
              </div>
            </div>

            <div className="p-4 bg-blue-50/50 rounded-xl flex items-center justify-between border border-blue-100/50">
              <span className="text-sm text-blue-700 font-medium">
                Available Balance:
              </span>
              <span className="text-lg font-bold text-blue-900">
                {new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency,
                }).format(availableBalance)}
              </span>
            </div>

            <Button
              type="submit"
              className="w-full mt-2"
              isLoading={isLoading}
              disabled={availableBalance === 0}
            >
              Confirm Transfer
            </Button>
          </form>
        </Card>
      </div>
    );
}
