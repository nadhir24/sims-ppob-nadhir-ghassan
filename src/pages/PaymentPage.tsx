import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { BalanceCard } from "@/components/BalanceCard";
import { Banknote } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchBalanceAsync } from "@/lib/features/balance/balanceSlice";
import { getServices, createTransaction } from "@/lib/api/services";
import { Service } from "@/lib/api/types";


export function PaymentPage() {
  const { serviceCode } = useParams<{ serviceCode: string }>();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { balance, isLoading: balanceLoading } = useAppSelector((state) => state.balance);
  
  const [service, setService] = useState<Service | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    dispatch(fetchBalanceAsync());
    
    const fetchService = async () => {
      try {
        const response = await getServices();
        const selectedService = response.data.find(
          (s) => s.service_code === serviceCode
        );
        if (selectedService) {
          setService(selectedService);
        } else {
          setError("Layanan tidak ditemukan");
        }
      } catch (err) {
        setError("Gagal memuat data layanan");
      }
    };

    if (serviceCode) {
      fetchService();
    }
  }, [dispatch, serviceCode]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    
    if (!service) {
      setError("Layanan tidak tersedia");
      return;
    }

    if (balance < service.service_tariff) {
      setError("Saldo tidak mencukupi");
      return;
    }
    
    setShowModal(true);
  };

  const handleConfirm = async () => {
    if (!service) return;

    try {
      setIsLoading(true);
      await createTransaction({ service_code: service.service_code });
      await dispatch(fetchBalanceAsync()).unwrap();
      setShowModal(false);
      setShowSuccess(true);
    } catch (err: any) {
      setShowModal(false);
      setShowError(true);
    } finally {
      setIsLoading(false);
    }
  };

  if (!service && !error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="max-w-7xl mx-auto px-6 py-8">
          <div className="text-center py-20">
            <p>Loading...</p>
          </div>
        </main>
      </div>
    );
  }

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
            </div>
              <div>
                <p className="text-sm text-gray-600">Selamat datang,</p>
                <h2 className="text-2xl font-bold">
                  {user?.first_name} {user?.last_name}
                </h2>
              </div>
          </div>

          <div>
            <BalanceCard balance={balance} />
          </div>
        </div>

        <div className="w-full">
          <p className="text-sm text-gray-600 mb-2">PemBayaran</p>
          {service && (
            <div className="flex items-center gap-3 mb-8">
              <img src={service.service_icon} alt={service.service_name} className="w-8 h-8" />
              <h3 className="text-xl font-bold">{service.service_name}</h3>
            </div>
          )}

          {error && !service ? (
            <div className="p-4 bg-red-50 border border-red-500 text-red-500 rounded-md mb-4">
              {error}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="w-full space-y-4">
              <div className="relative">
                <Banknote className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="text"
                  value={service ? `Rp${service.service_tariff.toLocaleString("id-ID")}` : ""}
                  disabled
                  className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                />
              </div>

              {error && service && (
                <div className="p-3 bg-red-50 border border-red-500 text-red-500 text-sm rounded-md flex items-center justify-between">
                  <span>{error}</span>
                  <button type="button" onClick={() => setError("")} className="text-red-500 hover:text-red-600">
                    ✕
                  </button>
                </div>
              )}

              <button
                type="submit"
                disabled={!service || isLoading || balanceLoading}
                className={`w-full py-3 rounded-md font-semibold transition ${
                  service && !isLoading && !balanceLoading
                    ? "bg-red-500 text-white hover:bg-red-600"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {isLoading ? "Loading..." : "Bayar"}
              </button>
            </form>
          )}
        </div>
      </main>

      {showModal && service && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 text-center">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <Banknote className="text-white" size={32} />
            </div>
            <p className="text-sm text-gray-600 mb-2">Beli {service.service_name} senilai</p>
            <p className="text-2xl font-bold mb-4">Rp{service.service_tariff.toLocaleString("id-ID")} ?</p>
            <button
              onClick={handleConfirm}
              disabled={isLoading}
              className="w-full bg-red-500 text-white py-3 rounded-md font-semibold hover:bg-red-600 transition mb-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Processing..." : "Ya, lanjutkan Bayar"}
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

      {showSuccess && service && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-3xl">✓</span>
            </div>
            <p className="text-sm text-gray-600 mb-1">Pembayaran {service.service_name} sebesar</p>
            <p className="text-2xl font-bold mb-1">Rp{service.service_tariff.toLocaleString("id-ID")}</p>
            <p className="text-sm text-gray-600 mb-6">berhasil!</p>
            <button
              onClick={() => {
                setShowSuccess(false);
                navigate("/");
              }}
              className="text-red-500 font-semibold hover:underline"
            >
              Kembali ke Beranda
            </button>
          </div>
        </div>
      )}

      {showError && service && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 text-center">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-3xl">✕</span>
            </div>
            <p className="text-sm text-gray-600 mb-1">Pembayaran {service.service_name} sebesar</p>
            <p className="text-2xl font-bold mb-1">Rp{service.service_tariff.toLocaleString("id-ID")}</p>
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
