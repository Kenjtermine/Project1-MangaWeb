import React, { useState, useEffect } from 'react';
import { getAllMangas } from '../data/api'; // Kiểm tra lại đường dẫn import cho đúng nhé bro

const Homepage = () => {
  const [mangas, setMangas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const data = await getAllMangas();
        
        // Đảm bảo dữ liệu lấy về là mảng trước khi slice để tránh lỗi crash
        if (Array.isArray(data)) {
          setMangas(data.slice(0, 6)); 
        } else {
          setMangas([]);
        }
      } catch (error) {
        console.error("Lỗi khi load danh sách truyện tại trang chủ:", error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) return <div className="text-center p-5">Đang tải danh sách truyện...</div>;

  return (
    <div className="homepage-container">
      {/* Code giao diện hiển thị danh sách truyện của bro ở đây */}
      {mangas.map((manga) => (
        <div key={manga.id}>{manga.title}</div>
      ))}
    </div>
  );
};

export default Homepage;