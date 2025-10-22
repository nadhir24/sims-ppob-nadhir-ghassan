import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import BackgroundSaldo from "@/lib/public/Background Saldo.png";

interface BalanceCardProps {
  balance: number;
  showBalance?: boolean;
}

export function BalanceCard({ balance, showBalance: initialShow = false }: BalanceCardProps) {
  const [showBalance, setShowBalance] = useState(initialShow);

  return (
    <div 
      className="text-white rounded-2xl p-6 relative overflow-hidden"
      style={{
        backgroundImage: `url(${BackgroundSaldo})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center'
      }}
    >

      <div className="relative z-10">
        <p className="text-sm mb-2">Saldo anda</p>
        <div className="flex items-center gap-4 mb-4">
          <h2 className="text-2xl font-bold">
            {showBalance ? `Rp ${balance.toLocaleString("id-ID")}` : "Rp ● ● ● ● ● ● ●"}
          </h2>
        </div>
        <button
          onClick={() => setShowBalance(!showBalance)}
          className="text-xs flex items-center gap-1 hover:opacity-80"
        >
          {showBalance ? "Tutup Saldo" : "Lihat Saldo"}
          {showBalance ? <EyeOff size={14} /> : <Eye size={14} />}
        </button>
      </div>
    </div>
  );
}
