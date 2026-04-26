import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import GenreList from "../genre-list/GenreList";
import useClickOutside from "../../hooks/useClickOutside";

import { getUserNotification } from "../../data/api"; // Import hàm lấy thông báo của người dùng

const Sidebar = () => {
    const notificationCount = getUserNotification().filter(noti => noti.is_read === false).length; // Lấy số lượng thông báo chưa đọc
    const [isGenreOpen, setIsGenreOpen] = useState(false);
    // Sử dụng hook: Truyền vào một hàm để đóng popup
    // domNode trả về sẽ được dùng làm mốc (ref)
    const genreRef = useClickOutside(() => {
        setIsGenreOpen(false); // Khi click ra ngoài, set state về false
    });
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
                    {/* MỞ RỘNG NẾU CẦN: <li><Link to="/authors" className="block py-2 px-3 rounded hover:bg-sky-700 transition">Tác giả</Link></li> */}
                    <li><Link to="/notifications" className="block py-2 px-3 rounded hover:bg-sky-700 transition flex justify-between">
                        <span>Thông báo</span>
                        {/* Badge số lượng thông báo mới */}
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
                    <li><Link to="/my-list" className="block py-2 px-3 rounded hover:bg-sky-700 transition">Danh sách yêu thích</Link></li>
                    <li><Link to="/history" className="block py-2 px-3 rounded hover:bg-sky-700 transition">Lịch sử đọc</Link></li>
                </ul>
            </div>
            {/* Account Section */}
            <div>
                <div className="uppercase text-xs text-sky-400 font-bold mb-2 tracking-wider">Quản lý tài khoản</div>
                <ul>
                    <li><Link to="/login" className="block py-2 px-3 rounded hover:bg-sky-700 transition">Đăng nhập</Link></li>
                    <li><Link to="/register" className="block py-2 px-3 rounded hover:bg-sky-700 transition">Đăng kí</Link></li>
                    <li><Link to="/profile" className="block py-2 px-3 rounded hover:bg-sky-700 transition">Profile của tôi</Link></li>
                </ul>
            </div>
        </div>

    )
}

export default Sidebar