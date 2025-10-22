import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppDispatch } from "@/lib/hooks";
import { logout } from "@/lib/features/auth/authSlice";
import { LogOut } from "lucide-react";
import Logo from "@/lib/public/Logo.png";

export function Header() {
  const location = useLocation(); 
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const isActive = (path: string) => location.pathname === path;

  const handleLogout = () => {
    dispatch(logout());
    navigate("/login");
  };

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
          <img src={Logo} alt="logo" />

          </div>
          <span className="font-bold text-lg">SIMS PPOB</span>
        </Link>

        <nav className="flex gap-8 items-center">
          <Link
            to="/topup"
            className={`text-sm font-medium ${
              isActive("/topup") ? "text-red-500" : "text-gray-700 hover:text-red-500"
            }`}
          >
            Top Up
          </Link>
          <Link
            to="/transaction"
            className={`text-sm font-medium ${
              isActive("/transaction") ? "text-red-500" : "text-gray-700 hover:text-red-500"
            }`}
          >
            Transaction
          </Link>
          <Link
            to="/account"
            className={`text-sm font-medium ${
              isActive("/account") ? "text-red-500" : "text-gray-700 hover:text-red-500"
            }`}
          >
            Akun
          </Link>
          <button
            onClick={handleLogout}
            className="text-sm font-medium text-gray-700 hover:text-red-500 flex items-center gap-1"
          >
            <LogOut size={16} />
            Logout
          </button>
        </nav>
      </div>
    </header>
  );
}
