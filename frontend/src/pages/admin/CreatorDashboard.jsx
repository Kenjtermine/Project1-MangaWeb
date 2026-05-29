import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaEye, FaStar, FaComment, FaEllipsisH, FaPlus } from 'react-icons/fa';
// Tạm thời vẫn dùng hàm Mock, sau này nhóm em đổi thành hàm fetch API từ Neon
import { getUserLogin, becomeUploader } from '../../data/api'; 

const CreatorDashboard = () => {
  const [user, setUser] = useState(getUserLogin());
  const [myMangas, setMyMangas] = useState([]);
  // State để quản lý việc mở/đóng dropdown của từng truyện
  const [openDropdownId, setOpenDropdownId] = useState(null);

  useEffect(() => {
    if (user?.is_poster) {
      // TẠM THỜI: Vẫn đọc từ LocalStorage để em test UI
      // SAU NÀY: Thay đoạn này bằng API gọi lên Node.js -> Neon DB
      const savedMangas = JSON.parse(localStorage.getItem('mangas')) || [];
      const filtered = savedMangas.filter(m => m.poster_username === user.username);
      setMyMangas(filtered);
    }
  }, [user]);

  const toggleDropdown = (mangaId) => {
    setOpenDropdownId(openDropdownId === mangaId ? null : mangaId);
  };

  const handleRegister = () => {
    const res = becomeUploader();
    if (res.ok) {
      setUser(getUserLogin()); 
      alert("Chúc mừng! Bạn đã trở thành Creator của MangaWeb!");
    }
  };

  // MÀN HÌNH 1: DÀNH CHO NGƯỜI CHƯA LÀ UPLOADER 
  if (user && !user.is_poster) {
    return (
        <div className="flex flex-col items-center justify-center h-full p-10 bg-gray-50 min-h-screen">
          <div className="max-w-xl bg-white p-10 rounded-2xl shadow-xl text-center">
            <div className="text-6xl mb-6">🎨</div>
            <h2 className="text-3xl font-bold text-sky-800 mb-4">Trở thành Content Creator</h2>
            <p className="text-gray-600 mb-8 leading-relaxed">
              Bạn muốn chia sẻ những bộ truyện hay đến cộng đồng? Hãy tham gia đội ngũ Creator của MangaWeb ngay hôm nay!
            </p>
            <button 
              onClick={handleRegister}
              className="w-full py-4 bg-sky-600 text-white rounded-xl font-bold hover:bg-sky-700 transition duration-300 shadow-lg"
            >
              Tôi đồng ý với nội quy và muốn bắt đầu
            </button>
          </div>
        </div>
      );
  }

  // MÀN HÌNH 2: DASHBOARD CHÍNH (FORMAT MỚI)
  return (
    <div className="max-w-5xl mx-auto p-4 md:p-8 min-h-screen bg-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 border-b pb-4">
        <div>
<<<<<<< Updated upstream
          <h2 className="text-2xl font-bold text-sky-800">Studio của {user?.user_name}</h2>
          <p className="text-gray-500 text-sm mt-1">Quản lý và đăng tải truyện của bạn tại đây.</p>
=======
          <h2 className="text-3xl font-bold text-gray-800">Truyện của Tôi</h2>
>>>>>>> Stashed changes
        </div>
        <Link 
          to="/studio/add-comic" 
          className="mt-4 md:mt-0 px-6 py-2 bg-orange-500 text-white rounded font-semibold hover:bg-orange-600 transition flex items-center shadow-sm"
        >
          <FaPlus className="mr-2" /> Truyện Mới
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex space-x-6 border-b mb-6 text-sm font-medium">
        <button className="pb-3 border-b-2 border-orange-500 text-gray-900">Đã đăng tải</button>
        <button className="pb-3 text-gray-500 hover:text-gray-900">Tất cả truyện</button>
        <button className="pb-3 text-gray-500 hover:text-gray-900">Series</button>
      </div>

      {/* DANH SÁCH TRUYỆN (List View) */}
      {myMangas.length > 0 ? (
        <div className="space-y-0 divide-y">
          {myMangas.map((manga) => (
            <div key={manga.id} className="py-6 flex flex-col md:flex-row gap-6 relative group">
              
              {/* Cột 1: Hamburger Icon (Chỉ hiện khi hover) */}
              <div className="hidden md:flex items-center text-gray-400 cursor-grab">
                <div className="space-y-1">
                  <div className="w-5 h-0.5 bg-gray-400"></div>
                  <div className="w-5 h-0.5 bg-gray-400"></div>
                  <div className="w-5 h-0.5 bg-gray-400"></div>
                </div>
              </div>

              {/* Cột 2: Ảnh bìa */}
              <div className="flex-shrink-0">
                <img 
                  src={manga.coverImage} 
                  alt={manga.title} 
                  className="w-24 h-36 object-cover rounded shadow-md border border-gray-200"
                />
              </div>

              {/* Cột 3: Thông tin */}
              <div className="flex-grow flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 hover:text-orange-500 cursor-pointer">
                    {user.username} | {manga.title}
                  </h3>
                  {/* Tạm thời fake số chương, sau này có API sẽ đếm số lượng chapter thật */}
                  <p className="text-teal-500 text-sm font-semibold mt-1">2 Chương đã đăng</p>
                  <p className="text-gray-500 text-xs mt-1">Đã cập nhật Th05 11, 2026</p>
                </div>

                {/* Thống kê */}
                <div className="flex items-center space-x-4 text-gray-500 text-sm mt-4">
                  <span className="flex items-center"><FaEye className="mr-1" /> 144</span>
                  <span className="flex items-center"><FaStar className="mr-1" /> 25</span>
                  <span className="flex items-center"><FaComment className="mr-1" /> 3</span>
                </div>
              </div>

              {/* Cột 4: Cụm Nút Action (Bên phải) */}
              <div className="flex items-start md:items-center space-x-3 mt-4 md:mt-0 relative">
                
                {/* Nút Tiếp tục viết + Dropdown */}
                <div className="flex rounded shadow-sm">
                  <button className="px-4 py-2 bg-orange-500 text-white text-sm font-semibold rounded-l hover:bg-orange-600 transition">
                    Tiếp tục đăng
                  </button>
                  <button 
                    onClick={() => toggleDropdown(manga.id)}
                    className="px-3 py-2 bg-orange-500 border-l border-orange-600 text-white text-sm rounded-r hover:bg-orange-600 transition"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/></svg>
                  </button>
                </div>

                {/* Nút Thống kê */}
                <button className="hidden md:flex px-3 py-2 border border-gray-300 text-gray-600 rounded hover:bg-gray-50 text-sm">
                   Thống kê
                </button>
                
                {/* Nút Ba chấm */}
                <button className="p-2 border border-gray-300 text-gray-600 rounded hover:bg-gray-50">
                  <FaEllipsisH />
                </button>

                {/* DROPDOWN MENU (Chỉ hiện khi click) */}
                {openDropdownId === manga.id && (
                  <div className="absolute right-0 top-full mt-2 w-64 bg-white border border-gray-200 rounded shadow-xl z-10">
                    <div className="p-2">
                      <Link 
                        to={`/studio/add-chapter?mangaId=${manga.id}`} 
                        className="block w-full py-2 bg-orange-500 text-white text-center font-semibold rounded hover:bg-orange-600 transition"
                      >
                        + Chương Mới
                      </Link>
                    </div>
                  </div>
                )}
              </div>

            </div>
          ))}
        </div>
      ) : (
        <div className="py-20 text-center border-2 border-dashed border-gray-200 rounded-lg">
          <p className="text-gray-500 mb-4">Bạn chưa có tác phẩm nào.</p>
          <Link to="/studio/add-comic" className="px-6 py-2 bg-gray-800 text-white rounded font-semibold hover:bg-gray-900 transition">
            Bắt đầu sáng tác
          </Link>
        </div>
      )}
    </div>
  );
};

export default CreatorDashboard;