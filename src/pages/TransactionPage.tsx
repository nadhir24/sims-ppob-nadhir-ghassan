import { useEffect, useState } from "react";
import { Header } from "@/components/Header";
import { BalanceCard } from "@/components/BalanceCard";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchTransactionHistoryAsync, resetTransactions, showMoreTransactions } from "@/lib/features/transaction/transactionSlice";
import { fetchBalanceAsync } from "@/lib/features/balance/balanceSlice";


type FilterType = "all" | "topup" | "payment";

const monthNames = ["Januari", "Februari", "Maret", "April", "Mei", "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

export function TransactionPage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { balance } = useAppSelector((state) => state.balance);
  const { displayedTransactions, hasMore, isLoading } = useAppSelector((state) => state.transaction);
  const [filter, setFilter] = useState<FilterType>("all");
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);

  useEffect(() => {
    dispatch(resetTransactions());
    dispatch(fetchBalanceAsync());
    dispatch(fetchTransactionHistoryAsync());
  }, [dispatch]);

  const handleShowMore = () => {
    dispatch(showMoreTransactions());
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("id-ID", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }) + " " + date.toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    }) + " WIB";
  };

  const formatAmount = (amount: number, type: string) => {
    const formatted = `Rp.${amount.toLocaleString("id-ID")}`;
    return type === "TOPUP" ? `+ ${formatted}` : `- ${formatted}`;
  };

  const filteredTransactions = displayedTransactions.filter((transaction) => {
    const typeMatch = filter === "all" || 
                      (filter === "topup" && transaction.transaction_type === "TOPUP") || 
                      (filter === "payment" && transaction.transaction_type === "PAYMENT");
    
    if (!typeMatch) return false;
    
    if (selectedMonth !== null) {
      const transactionDate = new Date(transaction.created_on);
      return transactionDate.getMonth() === selectedMonth;
    }
    
    return true;
  });

  // Generate 3 bulan terakhir secara dinamis
  const getLast3Months = () => {
    const months = [];
    const today = new Date();
    
    for (let i = 2; i >= 0; i--) {
      const date = new Date(today.getFullYear(), today.getMonth() - i, 1);
      months.push(date.getMonth());
    }
    
    return months;
  };
  
  const availableMonths = getLast3Months();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div>
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
                <img 
                  src={user?.profile_image && user.profile_image !== "null" ? user.profile_image : "/ProfilePhoto.png"} 
                  alt="Profile" 
                  className="w-full h-full object-cover" 
                />
              </div>
              <div>
                <p className="text-sm text-gray-600">Selamat datang,</p>
                <h2 className="text-2xl font-bold">
                  {user?.first_name} {user?.last_name}
                </h2>
              </div>
            </div>
          </div>

          <div>
            <BalanceCard balance={balance} />
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-xl font-bold mb-4">Semua Transaksi</h3>
          
          {availableMonths.length > 0 && (
            <div className="flex gap-2 mb-4 flex-wrap">
              {availableMonths.map((month) => (
                <button
                  key={month}
                  onClick={() => setSelectedMonth(selectedMonth === month ? null : month)}
                  className={`px-4 py-2 rounded-lg text-sm transition-colors ${
                    selectedMonth === month
                      ? "text-gray-900 font-semibold"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {monthNames[month]}
                </button>
              ))}
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filter === "all"
                  ? "bg-red-500 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              Semua
            </button>
            <button
              onClick={() => setFilter("topup")}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filter === "topup"
                  ? "bg-red-500 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              Top Up
            </button>
            <button
              onClick={() => setFilter("payment")}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                filter === "payment"
                  ? "bg-red-500 text-white"
                  : "bg-white text-gray-700 border border-gray-300 hover:bg-gray-50"
              }`}
            >
              Pengeluaran
            </button>
          </div>
        </div>

        <div className="space-y-4">
          {filteredTransactions.length === 0 && !isLoading ? (
            <div className="text-center py-12 text-gray-500">
              <p>Maaf tidak ada histori transaksi saat ini</p>
            </div>
          ) : (
            filteredTransactions.map((transaction) => (
              <div
                key={transaction.invoice_number}
                className="bg-white border border-gray-200 rounded-lg p-4 flex justify-between items-start"
              >
                <div>
                  <div className={`text-lg font-bold mb-1 ${transaction.transaction_type === "TOPUP" ? "text-green-500" : "text-red-500"}`}>
                    {formatAmount(transaction.total_amount, transaction.transaction_type)}
                  </div>
                  <p className="text-xs text-gray-400">{formatDate(transaction.created_on)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600">{transaction.service_name}</p>
                </div>
              </div>
            ))
          )}

          {hasMore && displayedTransactions.length > 0 && (
            <div className="text-center pt-4">
              <button
                onClick={handleShowMore}
                disabled={isLoading}
                className="text-red-500 font-semibold hover:underline disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Loading..." : "Show more"}
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
