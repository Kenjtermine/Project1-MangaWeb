import { Outlet, Link } from "react-router-dom";
const AdminLayout = () => {
    return (
        <div className="flex-col h-screen">
            {/* Header */}
            <header className="bg-blue-900 text-white p-4 flex items-center justify-between pl-10 relative">
                <div className="flex items-center gap-4">
                <Link to="/" className="text-white hover:text-gray-300">
                {/* Quay trở lại trang chủ */}
                    <span className="absolute left-4 top-7"><i className="fas fa-home text-2xl"></i></span>
                </Link>
                <div className="flex-col items-center gap-2">
                    <h1 className="text-3xl font-bold">MangaWeb</h1>
                    <h2 className="text-sm">Admin System</h2>
                </div>
                </div>
                <div className="flex flex-row items-center gap-2 pr-8">
                    <p className="text-sm">Welcome, Admin!</p>
                    <img src="https://i.imgur.com/1n7f1bF.jpg" alt="Admin Avatar" className="w-10 h-10 rounded-full" />
                </div>
            </header>
            <div className="flex-1 flex h-full">
            {/* Sidebar */}
                <aside className="w-64 bg-gray-800 text-white p-4">
                    <h2 className="text-2xl font-bold mb-6">Admin Dashboard</h2>
                    <nav className="flex flex-col gap-4">
                        <ul className="flex flex-col gap-2">
                            <li><Link to="/admin/users" className="block py-2 px-3 rounded hover:bg-gray-700 transition">Quản lý người dùng</Link></li>
                            <li><Link to="/admin/mangas" className="block py-2 px-3 rounded hover:bg-gray-700 transition">Quản lý truyện</Link></li>
                            <li><Link to="/admin/comments" className="block py-2 px-3 rounded hover:bg-gray-700 transition">Quản lý bình luận</Link></li>
                            <li><Link to="/admin/analytics" className="block py-2 px-3 rounded hover:bg-gray-700 transition">Thống kê dữ liệu</Link></li>
                        </ul>
                    </nav>
                </aside>

                {/* Main Content */}
                <main className="flex-1 p-4">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

export default AdminLayout;