import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import GenreList from "../genre-list/GenreList";
import useClickOutside from "../../hooks/useClickOutside";

import { getCurrentUser, getUserNotification, logoutUser } from "../../data/api"; 

const Sidebar = () => {
    const user = getCurrentUser();
    const notificationCount = getUserNotification().filter(noti => noti.is_read === false).length; // Lấy số lượng thông báo chưa đọc
    const [isGenreOpen, setIsGenreOpen] = useState(false);
    // Sử dụng hook: Truyền vào một hàm để đóng popup
    // domNode trả về sẽ được dùng làm mốc (ref)
    const genreRef = useClickOutside(() => {
        setIsGenreOpen(false); // Khi click ra ngoài, set state về false
    });

    const handleLogOut = () => {
        logoutUser(); // Xóa thông tin đăng nhập khỏi localStorage
        window.location.href = "/"; // Chuyển về trang chủ sau khi đăng xuất
    };

    return (
        <div className="h-full bg-sky-800 text-white p-4 flex flex-col gap-6">
            {/* General Section */}
            <div>
                <div className="uppercase text-xs text-sky-400 font-bold mb-2 tracking-wider">Chung</div>
                <ul>
                    <li><Link to="/" className="block py-2 px-3 rounded hover:bg-sky-700 transition">Trang chủ</Link></li>
                    <li><Link to="/browse" className="block py-2 px-3 rounded hover:bg-sky-700 transition">Khám phá</Link></li>
                    <li><Link to="/ranking" className="block py-2 px-3 rounded hover:bg-sky-700 transition">Bảng xếp hạng</Link></li>
                    <li ref={genreRef} className="relative flex-row">
                        <button 
                            onClick={() => setIsGenreOpen(!isGenreOpen)}
                            
                            className="w-full flex items-center justify-between py-2 px-3 rounded hover:bg-sky-700 transition cursor-pointer"
                        >
                            <span>Thể loại</span>
                            {/* Icon mũi tên trỏ xuống CỐ ĐỊNH, cực kỳ tối giản */}
                            <svg 
                                xmlns="http://www.w3.org/2000/svg" 
                                className="h-4 w-4" 
                                fill="none" viewBox="0 0 24 24" stroke="currentColor"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                        </button>
                        <div>
                            {isGenreOpen && <GenreList />}
                        </div>
                    </li>
                    <li><Link to="/notifications" className="block py-2 px-3 rounded hover:bg-sky-700 transition flex justify-between">
                        <span>Thông báo</span>
                        {notificationCount > 0 && (
                            <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded-full justify-center items-center flex">
                                {notificationCount > 99 ? '99+' : notificationCount}
                            </span>
                        )}
                    </Link></li>
                    
                </ul>
            </div>
            {/* Library Section */}
            <div>
                <div className="uppercase text-xs text-sky-400 font-bold mb-2 tracking-wider">Thư viện</div>
                <ul>
                    <li><Link to="/my-fav" className="block py-2 px-3 rounded hover:bg-sky-700 transition">Danh sách yêu thích</Link></li>
                    <li><Link to="/history" className="block py-2 px-3 rounded hover:bg-sky-700 transition">Lịch sử đọc</Link></li>
                </ul>
            </div>
            {/* Account Section */}
            <div>
                <div className="uppercase text-xs text-sky-400 font-bold mb-2 tracking-wider">Quản lý tài khoản</div>
                <ul>
                    {!user ? (
                        <>
                            <li><Link to="/login" className="block py-2 px-3 rounded hover:bg-sky-700 transition">Đăng nhập</Link></li>
                            <li><Link to="/register" className="block py-2 px-3 rounded hover:bg-sky-700 transition">Đăng kí</Link></li>
                        </>)
                         : (
                            <>
                                <li><Link to="/logout" className="block py-2 px-3 rounded hover:bg-sky-700 transition" onClick={handleLogOut}>Đăng xuất</Link></li>
                            </>
                        )
                    }
                    <li><Link to="/profile" className="block py-2 px-3 rounded hover:bg-sky-700 transition">Profile của tôi</Link></li>
                    {/* Chỉ dành cho role admin có Protected Route */}
                    {user && user.user_role?.toLowerCase() === "admin" && (
                        <li><Link to="/admin" className="block py-2 px-3 rounded hover:bg-sky-700 transition flex gap-2 items-center">Trang quản trị viên <i className="fa fa-wrench"></i></Link></li>
                    )}
                </ul>
            </div>
            {user && user.is_uploader && (
                <div>
                    <div className="uppercase text-xs text-sky-400 font-bold mb-2 tracking-wider">Dành cho tác giả</div>
                    <ul>
                        <li>
                            <Link to="/studio" className="block py-2 px-3 rounded hover:bg-sky-700 transition">
                                 Creator Studio
                            </Link>
                        </li>
                    </ul>
                </div>
            )}

            {/* Other Section */}
            <div>
                <div className="uppercase text-xs text-sky-400 font-bold mb-2 tracking-wider">Khác</div>
                <ul>
                    <li><Link to="/about" className="block py-2 px-3 rounded hover:bg-sky-700 transition">Về MangaWeb</Link></li>

                    {user && !user.is_uploader && user.role !== "Admin" && (
                        <li>
                            <Link to="/studio" className="block py-2 px-3 rounded hover:bg-sky-700 transition text-yellow-300">
                                 Trở thành Uploader
                            </Link>
                        </li>
                    )}
                </ul>
            </div>
        </div>

    )
}

export default Sidebar
