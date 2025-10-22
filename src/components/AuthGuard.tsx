import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { fetchProfileAsync } from "@/lib/features/auth/authSlice";
import { getAuthToken } from "@/lib/api/config";

export function AuthGuard() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { isLoading, user } = useAppSelector((state) => state.auth);
  const token = getAuthToken();

  useEffect(() => {
    if (token && !user && !isLoading) {
      dispatch(fetchProfileAsync());
    }
  }, [token, user, isLoading, dispatch]);

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isLoading && !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return <Outlet />;
}
