import React, { useState, useEffect } from 'react'; 
import { Link } from 'react-router-dom';
import { getCurrentUser, becomeUploader } from '../../data/api';

const CreatorDashboard = () => {
  const [user, setUser] = useState(getCurrentUser());
  const [myMangas, setMyMangas] = useState([]); 

  useEffect(() => {
    if (user?.user_role === "uploader") {
      const savedMangas = JSON.parse(localStorage.getItem('mangas')) || [];
      
      const filtered = savedMangas.filter(m => m.uploader_username === user.username);
      
      // 3. Cập nhật vào giao diện
      setMyMangas(filtered);
    }
  }, [user]);

  const handleRegister = async () => {
    const res = await becomeUploader();
    if (res.ok) {
      setUser(getCurrentUser()); 
      alert("Chúc mừng! Bạn đã trở thành Uploader của MangaWeb!");
      window.location.reload();
    }
    else {
      alert(res.message);
    }
  };

  if (user && user.user_role !== "uploader" ) {
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

  return (
    <div className="p-8 min-h-screen bg-gray-50">
      <div className="flex justify-between items-center mb-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-2xl font-bold text-sky-800">Studio của {user?.user_name}</h2>
          <p className="text-gray-500 text-sm mt-1">Quản lý và đăng tải truyện của bạn tại đây.</p>
        </div>
        <Link to="/studio/add-comic" className="px-6 py-3 bg-sky-600 text-white rounded-lg hover:bg-sky-700 font-semibold shadow-md transition">
          + Đăng truyện mới
        </Link>
      </div>

      {/* HIỂN THỊ DANH SÁCH TRUYỆN */}
      {myMangas.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {myMangas.map((manga) => (
            <div key={manga.id} className="bg-white p-4 rounded-xl shadow-sm border flex items-center space-x-4">
              <img src={manga.coverImage} alt="" className="w-16 h-20 object-cover rounded shadow-sm" />
              <div className="flex-1">
                <h4 className="font-bold text-gray-800 line-clamp-1">{manga.title}</h4>
                <p className="text-xs text-blue-500 font-medium mt-1">{manga.status}</p>
                <Link to={`/studio/add-chapter?mangaId=${manga.id}`} className="inline-block mt-2 text-xs text-sky-600 hover:underline">
                  + Thêm chương mới
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white p-20 rounded-xl shadow-sm border border-gray-100 text-center">
          <div className="text-4xl mb-4">📚</div>
          <h3 className="text-xl font-bold text-gray-700 mb-2">Bạn chưa có bộ truyện nào</h3>
          <p className="text-gray-500">Hãy bắt đầu bằng cách đăng bộ truyện đầu tiên nhé!</p>
        </div>
      )}
    </div>
  );
};

export default CreatorDashboard;