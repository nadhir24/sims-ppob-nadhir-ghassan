import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AtSign, User, Lock, Eye, EyeOff } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { registerAsync, clearError } from "@/lib/features/auth/authSlice";
import Logo from "@/lib/public/Logo.png";
import ilustrasi from "@/lib/public/illustrasilogin.png";

export function RegisterPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { isLoading, error: authError } = useAppSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    dispatch(clearError());

    if (!formData.email || !formData.firstName || !formData.lastName || !formData.password || !formData.confirmPassword) {
      setError("Mohon lengkapi semua data");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password minimal 8 karakter");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Password tidak sama");
      return;
    }

  
    try {
      await dispatch(registerAsync({
        email: formData.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
        password: formData.password,
      })).unwrap();
      setSuccess(true);
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      setError(err || "Registrasi gagal");
    }
  };

  return (
    <div className="min-h-screen flex">
      <div className="w-1/2 flex items-center justify-center p-12 bg-white">
        <div className="w-full max-w-md">
          <div className="flex items-center justify-center gap-2 mb-8">
            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
              <img src={Logo} alt="logo" />
            </div>
            <span className="font-bold text-lg">SIMS PPOB</span>
          </div>

          <h1 className="text-3xl font-bold text-center mb-2">
            Lengkapi data untuk
            <br />
            membuat akun
          </h1>

          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <div className="relative">
              <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                placeholder="masukan email anda"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="nama depan"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="nama belakang"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-red-500"
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type={showPassword ? "text" : "password"}
                placeholder="buat password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
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

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="konfirmasi password"
                value={formData.confirmPassword}
                onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-red-500"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-500 text-white py-3 rounded-md font-semibold hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Loading..." : "Registrasi"}
            </button>
          </form>

          {success && (
            <div className="mt-4 p-3 bg-green-50 border border-green-500 text-green-700 text-sm rounded-md">
              <span>Registrasi berhasil! Mengalihkan ke halaman login...</span>
            </div>
          )}

          {(error || authError) && (
            <div className="mt-4 p-3 bg-red-50 border border-red-500 text-red-500 text-sm rounded-md flex items-center justify-between">
              <span>{error || authError}</span>
              <button onClick={() => { setError(""); dispatch(clearError()); }} className="text-red-500 hover:text-red-600">
                ✕
              </button>
            </div>
          )}

          <p className="text-center text-sm text-gray-600 mt-6">
            sudah punya akun? login{" "}
            <Link to="/login" className="text-red-500 font-semibold hover:underline">
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
