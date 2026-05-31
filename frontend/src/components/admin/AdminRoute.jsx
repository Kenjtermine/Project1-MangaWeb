import { Navigate, Outlet } from "react-router-dom";
import { getAuthToken, getCurrentUser } from "../../data/api";

const AdminRoute = () => {
  const token = getAuthToken();
  const user = getCurrentUser();

  if (!token || !user) {
    return <Navigate to="/login" replace state={{ from: "/admin" }} />;
  }

  if (user.user_role !== "admin") {
    return (
      <div className="min-h-screen bg-neutral-900 flex items-center justify-center text-white p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Không có quyền truy cập</h1>
          <p className="text-gray-400 mb-4">Chỉ tài khoản admin mới vào được khu vực quản trị.</p>
          <a href="/" className="text-sky-400 hover:underline">Về trang chủ</a>
        </div>
      </div>
    );
  }

  return <Outlet />;
};

export default AdminRoute;
