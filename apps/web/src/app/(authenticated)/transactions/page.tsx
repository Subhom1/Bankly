"use client";

import { useEffect, useState } from "react";
import Card from "@/app/components/Card";
import Button from "@/app/components/Button";
import { transactionService, Transaction, TransactionType } from "@/app/services/transaction.service";

const formatCurrency = (amount: string | number, currency: string) => {
    const numAmount = typeof amount === "string" ? parseFloat(amount) : amount;
    return new Intl.NumberFormat("en-US", {
        style: "currency",
        currency,
    }).format(Math.abs(numAmount));
};

export default function Transactions() {
    const [transactions, setTransactions] = useState<Transaction[]>([]);
    const [type, setType] = useState<TransactionType | undefined>();
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTransactions = async () => {
            setIsLoading(true);
            try {
                const result = await transactionService.getTransactions(type, page, 10);
                setTransactions(result.data);
                setTotalPages(result.meta.lastPage);
            } catch (err) {
                console.error("Failed to fetch transactions:", err);
            } finally {
                setIsLoading(false);
            }
        };
        fetchTransactions();
    }, [type, page]);

    const handleTypeChange = (newType: string) => {
        setType(newType === "ALL" ? undefined : (newType as TransactionType));
        setPage(1);
    };

    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-900">
            Transaction History
          </h2>

          <div className="flex bg-gray-100 p-1 rounded-xl">
            {["ALL", "TRANSFER", "EXCHANGE"].map((t) => (
              <button
                key={t}
                onClick={() => handleTypeChange(t)}
                className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                  (t === "ALL" && !type) || type === t
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                {t.charAt(0) + t.slice(1).toLowerCase()}
              </button>
            ))}
          </div>
        </div>

        <Card className="overflow-hidden border border-gray-100 shadow-sm">
          {isLoading ? (
            <div className="flex items-center justify-center p-20">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-100">
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Type
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                      Details
                    </th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">
                      Amount
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {transactions.map((tx) => {
                    const date = new Date(tx.createdAt).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    );

                    return (
                      <tr
                        key={tx.id}
                        className="hover:bg-gray-50/50 transition-colors"
                      >
                        <td className="px-6 py-4 text-sm text-gray-600">
                          {date}
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              tx.type === "TRANSFER"
                                ? "bg-blue-100 text-blue-800"
                                : "bg-purple-100 text-purple-800"
                            }`}
                          >
                            {tx.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-700">
                          {tx.ledger.map((l, i) => (
                            <span key={l.id}>
                              {i > 0 && " → "}
                              {parseFloat(l.amount) < 0 ? "-" : "+"}
                              {l.account.currency}
                            </span>
                          ))}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <span
                            className={`text-sm font-bold ${
                              parseFloat(tx.amount) > 0
                                ? "text-gray-900"
                                : "text-red-600"
                            }`}
                          >
                            {formatCurrency(
                              tx.amount,
                              tx.ledger[0]?.account.currency || "USD"
                            )}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {transactions.length === 0 && (
                <div className="p-20 text-center text-gray-500 italic">
                  No transactions found for this filter.
                </div>
              )}
            </div>
          )}
        </Card>

        {/* Pagination */}
        {
          !(transactions.length === 0) && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-500">
                Page <span className="font-medium text-gray-900">{page}</span>{" "}
                of{" "}
                <span className="font-medium text-gray-900">{totalPages}</span>
              </p>
              <div className="flex gap-2">
                <Button
                  variant="secondary"
                  className="px-4 py-2"
                  disabled={page === 1 || isLoading}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="primary"
                  className="px-4 py-2"
                  disabled={page === totalPages || isLoading}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          )
        }
      </div>
    );
}
