import { useState, useEffect } from "react";
import { Header } from "@/components/Header";
import { BalanceCard } from "@/components/BalanceCard";
import { Banknote } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { topUpAsync, fetchBalanceAsync } from "@/lib/features/balance/balanceSlice";
import { useNavigate } from "react-router-dom";


const quickAmounts = [10000, 20000, 50000, 100000, 250000, 500000];

export function TopUpPage() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { balance, isLoading } = useAppSelector((state) => state.balance);
  const [amount, setAmount] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState("");
const [displayAmount, setDisplayAmount] = useState(""); 
const navigate = useNavigate();
const formatToRupiah = (value: string) => {
  const numbers = value.replace(/[^\d]/g, ""); 
  if (!numbers) return "";
  return "Rp" + parseInt(numbers).toLocaleString("id-ID");
};

const getNumericValue = (value: string) => {
  return value.replace(/[^\d]/g, "");
};

const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  const inputValue = e.target.value;
  const numericValue = getNumericValue(inputValue);
  
  setAmount(numericValue); 
  setDisplayAmount(formatToRupiah(numericValue)); 
};
  useEffect(() => {
    dispatch(fetchBalanceAsync());
  }, [dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    const amountNum = parseInt(amount);
    
    if (!amount || amountNum <= 0) {
      setError("Masukan nominal yang valid");
      return;
    }
    
    if (amountNum < 10000) {
      setError("Nominal minimal Rp10.000");
      return;
    }
    
    if (amountNum > 1000000) {
      setError("Nominal maksimal Rp1.000.000");
      return;
    }
    
    setShowModal(true);
  };

  const handleConfirm = async () => {
    try {
      await dispatch(topUpAsync(parseInt(amount))).unwrap();
      setShowModal(false);
      setShowSuccess(true);
    } catch (err: any) {
      setShowModal(false);
      setShowError(true);
    }
  };

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

     <div className="w-full">
  <p className="text-2xl text-gray-600 mb-2">Silahkan masukan</p>
  <h3 className="text-3xl font-bold mb-8">Nominal Top Up</h3>

  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full">

    <form onSubmit={handleSubmit} className="space-y-4 lg:col-span-2">
     <div className="relative">
  <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
  <input
    type="text" 
    placeholder="masukan nominal Top Up"
    value={displayAmount}  
    onChange={handleAmountChange}  
    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-red-500"
  />
</div>

      {error && (
        <div className="grid cols-2 p-3 bg-red-50 border border-red-500 text-red-500 text-sm rounded-md items-center justify-between">
          <span>{error}</span>
          <button type="button" onClick={() => setError("")} className="text-red-500 hover:text-red-600">
            ✕
          </button>
        </div>
      )}

      <button
        type="submit"
        disabled={!amount || isLoading}
        className={`w-full py-3 rounded-md font-semibold transition ${
          amount && !isLoading
            ? "bg-red-500 text-white hover:bg-red-600"
            : "bg-gray-200 text-gray-400 cursor-not-allowed"
        }`}
      >
        {isLoading ? "Loading..." : "Top Up"}
      </button>
    </form>

    <div className="grid grid-cols-3 gap-3">
  {quickAmounts.map((amt) => (
    <button
      key={amt}
      type="button"
      onClick={() => {
        setAmount(amt.toString());
        setDisplayAmount(formatToRupiah(amt.toString()));
      }}
      className="py-2 border border-gray-300 rounded-md text-sm hover:border-red-500 hover:text-red-500 transition"
    >
      Rp{amt.toLocaleString("id-ID")}
    </button>
  ))}
</div>
  </div>
</div>
      </main>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 text-center">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Banknote className="text-white" size={32} />
            </div>
            <p className="text-sm text-gray-600 mb-2">Top Up sebesar</p>
            <p className="text-2xl font-bold mb-4">Rp{parseInt(amount).toLocaleString("id-ID")} ?</p>
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className="w-full bg-red-500 text-white py-3 rounded-md font-semibold hover:bg-red-600 transition mb-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Processing..." : "Ya, lanjutkan Top Up"}
            </button>
            <button
              onClick={() => setShowModal(false)}
              className="w-full text-red-500 py-2 rounded-md font-semibold hover:bg-gray-50 transition"
            >
              Batalkan
            </button>
          </div>
        </div>
      )}

      {showSuccess && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-3xl">✓</span>
            </div>
            <p className="text-sm text-gray-600 mb-1">Top Up sebesar</p>
            <p className="text-2xl font-bold mb-1">Rp{parseInt(amount).toLocaleString("id-ID")}</p>
            <p className="text-sm text-gray-600 mb-6">berhasil!</p>
            <button
              onClick={() => {
                setShowSuccess(false);
    setAmount("");
    setDisplayAmount(""); // Jangan lupa clear display juga
    navigate("/"); // Redirect ke home
              }}
              className="text-red-500 font-semibold hover:underline"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      )}

      {showError && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 text-center">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-3xl">✕</span>
            </div>
            <p className="text-sm text-gray-600 mb-1">Top Up sebesar</p>
            <p className="text-2xl font-bold mb-1">Rp{parseInt(amount).toLocaleString("id-ID")}</p>
            <p className="text-sm text-gray-600 mb-6">gagal</p>
            <button
              onClick={() => {
                setShowError(false);
                navigate("/");
              }}
              className="text-red-500 font-semibold hover:underline"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
