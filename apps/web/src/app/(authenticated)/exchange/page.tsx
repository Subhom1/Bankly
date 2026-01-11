"use client";

import { useState, useEffect } from "react";
import Card from "@/app/components/Card";
import Button from "@/app/components/Button";
import Input from "@/app/components/Input";
import { accountService, Account } from "@/app/services/account.service";
import { transactionService } from "@/app/services/transaction.service";

const RATE = 0.92;

export default function Exchange() {
    const [accounts, setAccounts] = useState<Account[]>([]);
    const [fromCurrency, setFromCurrency] = useState<"USD" | "EUR">("USD");
    const [amount, setAmount] = useState("");
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

    const toCurrency = fromCurrency === "USD" ? "EUR" : "USD";
    const selectedAccount = accounts.find((a) => a.currency === fromCurrency);
    const availableBalance = selectedAccount ? parseFloat(selectedAccount.balance.toString()) : 0;

    const numAmount = parseFloat(amount) || 0;
    const convertedAmount = fromCurrency === "USD" ? numAmount * RATE : numAmount / RATE;

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError(null);
        setSuccess(false);

        if (numAmount <= 0) {
            setError("Please enter a valid amount.");
            setIsLoading(false);
            return;
        }

        if (numAmount > availableBalance) {
            setError("Insufficient funds in your source wallet.");
            setIsLoading(false);
            return;
        }

        try {
            await transactionService.exchange(fromCurrency, toCurrency, numAmount);
            setSuccess(true);
            setAmount("");
            // Refresh accounts
            const data = await accountService.getAccounts();
            setAccounts(data);
        } catch (err: any) {
            setError(err.response?.data?.message || "Exchange failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <Card className="p-8 shadow-sm border border-gray-100">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Convert Currency</h2>

                {success && (
                    <div className="mb-6 p-4 bg-green-50 border border-green-100 text-green-700 rounded-xl flex items-center gap-3">
                        <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                        Exchange successful!
                    </div>
                )}

                {error && (
                    <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-700 rounded-xl">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-end">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">From (Source)</label>
                            <select
                                className="w-full px-4 py-2 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all outline-none text-gray-700"
                                value={fromCurrency}
                                onChange={(e) => setFromCurrency(e.target.value as "USD" | "EUR")}
                            >
                                <option value="USD">USD ($)</option>
                                <option value="EUR">EUR (€)</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">Amount</label>
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

                    <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-100 italic text-sm text-gray-500">
                        <span>Exchange Rate:</span>
                        <span>1 USD = 0.92 EUR</span>
                    </div>

                    <div className="p-6 bg-blue-600 rounded-2xl text-white shadow-lg space-y-4">
                        <div className="flex justify-between items-center opacity-80 decoration-transparent">
                            <span className="text-sm font-medium">You will receive ({toCurrency})</span>
                            <span className="text-xs uppercase tracking-wider">Estimated</span>
                        </div>
                        <div className="text-3xl font-bold">
                            {new Intl.NumberFormat("en-US", {
                                style: "currency",
                                currency: toCurrency,
                            }).format(convertedAmount)}
                        </div>
                        <div className="pt-4 border-t border-white/20 flex justify-between items-center text-xs">
                            <span className="opacity-80 decoration-transparent">Source balance after swap:</span>
                            <span className="font-semibold">
                                {new Intl.NumberFormat("en-US", {
                                    style: "currency",
                                    currency: fromCurrency,
                                }).format(availableBalance - numAmount)}
                            </span>
                        </div>
                    </div>

                    <Button type="submit" className="w-full mt-2" isLoading={isLoading} disabled={availableBalance === 0}>
                        Convert Assets
                    </Button>
                </form>
            </Card>
        </div>
    );
}
