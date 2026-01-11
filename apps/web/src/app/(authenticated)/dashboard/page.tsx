import Card from "@/app/components/Card";

// Mock Data
const MOCK_BALANCES = {
  USD: 1250.5,
  EUR: 850.25,
};

const formatCurrency = (amount: number, currency: string) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
  }).format(amount);
};

export default function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Balances Section */}
      <section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card
            title="US Dollar Wallet"
            value={formatCurrency(MOCK_BALANCES.USD, "USD")}
            className="h-32"
          />
          <Card
            title="Euro Wallet"
            value={formatCurrency(MOCK_BALANCES.EUR, "EUR")}
            className="h-32"
          />
        </div>
      </section>

      {/* Recent Activity Section */}
      <section>
        {/* <TransactionList transactions={MOCK_TRANSACTIONS} /> */}
      </section>
    </div>
  );
}
