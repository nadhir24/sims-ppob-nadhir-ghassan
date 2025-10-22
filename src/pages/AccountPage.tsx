import { useState, useEffect, useRef } from "react";
import { Header } from "@/components/Header";
import { AtSign, User, Edit2 } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { updateProfileAsync, logout } from "@/lib/features/auth/authSlice";
import { useNavigate } from "react-router-dom";
import { updateProfileImage } from "@/lib/api/auth";


export function AccountPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isLoading } = useAppSelector((state) => state.auth);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    email: "",
    firstName: "",
    lastName: "",
  });
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (user) {
      setFormData({
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
      });
    }
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    try {
      await dispatch(updateProfileAsync({
        email: formData.email,
        first_name: formData.firstName,
        last_name: formData.lastName,
      })).unwrap();
      setIsEditing(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      setError(err || "Gagal update profile");
    }
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 100 * 1024) {
      setError("Ukuran gambar maksimal 100KB");
      return;
    }

    if (!file.type.startsWith("image/")) {
      setError("File harus berupa gambar");
      return;
    }

    setUploading(true);
    setError("");

    try {
      await updateProfileImage(file);
      window.location.reload();
    } catch (err: any) {
      setError(err || "Gagal upload foto profil");
    } finally {
      setUploading(false);
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="max-w-4xl mx-auto px-6 py-12">
        <div className="flex flex-col items-center mb-12">
          <div className="relative mb-4">
            <div className="w-32 h-32 bg-gray-300 rounded-full flex items-center justify-center overflow-hidden">
              <img 
                src={user?.profile_image && user.profile_image !== "null" ? user.profile_image : "/ProfilePhoto.png"} 
                alt="Profile" 
                className="w-full h-full object-cover" 
              />
              {uploading && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="absolute bottom-0 right-0 w-10 h-10 bg-white border-2 border-gray-300 rounded-full flex items-center justify-center hover:bg-gray-50 transition disabled:opacity-50"
            >
              <Edit2 size={18} className="text-gray-600" />
            </button>
          </div>
          <h2 className="text-3xl font-bold">{formData.firstName} {formData.lastName}</h2>
        </div>

        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
          <div>
            <label className="block text-sm text-gray-600 mb-2">Email</label>
            <div className="relative">
              <AtSign className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                disabled={!isEditing}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-red-500 disabled:bg-gray-100 disabled:text-gray-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">Nama Depan</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                disabled={!isEditing}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-red-500 disabled:bg-gray-100 disabled:text-gray-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm text-gray-600 mb-2">Nama Belakang</label>
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                disabled={!isEditing}
                className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:border-red-500 disabled:bg-gray-100 disabled:text-gray-500"
              />
            </div>
          </div>

          {success && (
            <div className="p-3 bg-green-50 border border-green-500 text-green-700 text-sm rounded-md">
              <span>Profile berhasil diupdate!</span>
            </div>
          )}

          {error && (
            <div className="p-3 bg-red-50 border border-red-500 text-red-500 text-sm rounded-md flex items-center justify-between">
              <span>{error}</span>
              <button onClick={() => setError("")} className="text-red-500 hover:text-red-600">
                ✕
              </button>
            </div>
          )}

          {isEditing ? (
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={isLoading}
                className="flex-1 bg-red-500 text-white py-3 rounded-md font-semibold hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? "Loading..." : "Simpan"}
              </button>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-md font-semibold hover:bg-gray-50 transition"
              >
                Batalkan
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="w-full border border-red-500 text-red-500 py-3 rounded-md font-semibold hover:bg-red-50 transition"
            >
              Edit Profile
            </button>
          )}
        </form>

        <div className="text-center mt-8">
          <button onClick={handleLogout} className="text-red-500 font-semibold hover:underline">
            Logout
          </button>
        </div>
      </main>
    </div>
  );
}
