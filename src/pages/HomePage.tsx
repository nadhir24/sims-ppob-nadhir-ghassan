import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Header } from "@/components/Header";
import { BalanceCard } from "@/components/BalanceCard";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchBalanceAsync, fetchBannersAsync, fetchServicesAsync } from "@/lib/features/balance/balanceSlice";


export function HomePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user } = useAppSelector((state) => state.auth);
  const { balance, banners, services } = useAppSelector((state) => state.balance);

  useEffect(() => {
    dispatch(fetchBalanceAsync());
    dispatch(fetchBannersAsync());
    dispatch(fetchServicesAsync());
  }, [dispatch]);

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
                <p className="text-2xl text-gray-600">Selamat datang,</p>
                <h2 className="text-3xl font-bold">
                  {user?.first_name} {user?.last_name}
                </h2>
              </div>
          </div>

          <div>
            <BalanceCard balance={balance} />
          </div>
        </div>

        <div className="grid grid-cols-4 md:grid-cols-6 lg:grid-cols-12 gap-4 mb-12">
          {services.map((service, index) => (
            <button
              key={index}
              onClick={() => navigate(`/payment/${service.service_code}`)}
              className="flex flex-col items-center gap-2 p-4 bg-white rounded-lg hover:bg-gray-50 transition group"
            >
              <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-100 group-hover:scale-110 transition">
                <img src={service.service_icon} alt={service.service_name} className="w-full h-full object-contain" />
              </div>
              <span className="text-xs text-center text-gray-700">{service.service_name}</span>
            </button>
          ))}
        </div>

        <div className="mb-4">
          <h3 className="font-semibold text-gray-900">Temukan promo menarik</h3>
        </div>

        <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
          {banners.map((banner, index) => (
            <div
              key={index}
              className="min-w-[320px] h-40 rounded-xl overflow-hidden relative"
            >
              <img src={banner.banner_image} alt={banner.banner_name} className="w-full h-full object-cover" />
              
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
