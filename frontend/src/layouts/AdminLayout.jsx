import { Outlet, Link, NavLink } from "react-router-dom";
import { getCurrentUser } from "../data/api";

const navClass = ({ isActive }) =>
  `block py-2 px-3 rounded transition ${isActive ? "bg-sky-700 text-white" : "hover:bg-gray-700"}`;

const AdminLayout = () => {
  const user = getCurrentUser();

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      <header className="bg-blue-900 text-white p-4 flex items-center justify-between pl-10 relative">
        <div className="flex items-center gap-4">
          <Link to="/" className="text-white hover:text-gray-300">
            <span className="absolute left-4 top-7">
              <i className="fas fa-home text-2xl" />
            </span>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">MangaWeb</h1>
            <h2 className="text-sm opacity-80">Admin System</h2>
          </div>
        </div>
        <div className="flex items-center gap-3 pr-8">
          <p className="text-sm">Xin chào, {user?.user_name || "Admin"}</p>
          <img
            src={user?.user_avatar || "https://i.imgur.com/1n7f1bF.jpg"}
            alt=""
            className="w-10 h-10 rounded-full object-cover"
          />
        </div>
      </header>

      <div className="flex flex-1">
        <aside className="w-64 bg-gray-800 text-white p-4 shrink-0">
          <h2 className="text-lg font-bold mb-4">Menu</h2>
          <nav className="flex flex-col gap-1">
            <NavLink to="/admin" end className={navClass}>
              Tổng quan
            </NavLink>
            <NavLink to="/admin/users" className={navClass}>
              Quản lý người dùng
            </NavLink>
            <NavLink to="/admin/genres" className={navClass}>
              Quản lý thể loại
            </NavLink>
            <NavLink to="/admin/comments" className={navClass}>
              Quản lý bình luận
            </NavLink>
          </nav>
        </aside>

        <main className="flex-1 p-4 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
