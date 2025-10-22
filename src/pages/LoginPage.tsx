import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AtSign, Lock, Eye, EyeOff } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { loginAsync, clearError } from "@/lib/features/auth/authSlice";
import ilustrasi from "@/lib/public/illustrasilogin.png";
import Logo from "@/lib/public/Logo.png";

export function LoginPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error: authError } = useAppSelector((state) => state.auth);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    dispatch(clearError());

    if (!email || !password) {
      setError("Mohon lengkapi data");
      return;
    }

    try {
      await dispatch(loginAsync({ email, password })).unwrap();
      navigate("/");
    } catch (err: any) {
      setError(err || "Login gagal");
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-1/2 flex items-center justify-center p-12 bg-white">
        <div className="w-full max-w-md justify center">
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <img src={Logo} alt="logo" />
            </div>
            <span className="font-bold text-lg">SIMS PPOB</span>
          </div>

          <h1 className="text-3xl font-bold text-center mb-2">
            Masuk atau buat akun
            <br />
            untuk memulai
          </h1>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="relative">
              <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                placeholder="masukan email anda"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="masukan password anda"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-red-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-500 text-white py-3 rounded-md font-semibold hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Loading..." : "Masuk"}
            </button>
          </form>

          {(error || authError) && (
            <div className="mt-4 p-3 bg-red-50 border border-red-500 text-red-500 text-sm rounded-md flex items-center justify-between">
              <span>{error || authError}</span>
              <button onClick={() => { setError(""); dispatch(clearError()); }} className="text-red-500 hover:text-red-600">
                ✕
              </button>
            </div>
          )}

          <p className="text-center text-sm text-gray-600 mt-6">
            belum punya akun? registrasi{" "}
            <Link to="/register" className="text-red-500 font-semibold hover:underline">
              di sini
            </Link>
          </p>
        </div>
      </div>

      <div className="w-1/2  flex items-center justify-center relative overflow-hidden">
      <img src={ilustrasi} alt="orang" />
      </div>
    </div>
  );
}
