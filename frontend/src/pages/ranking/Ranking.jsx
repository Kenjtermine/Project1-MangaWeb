import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const Ranking = () => {
  // State quản lý dữ liệu bxh thực tế từ DB
  const [rankings, setRankings] = useState({ daily: [], weekly: [], monthly: [] });
  const [activeTab, setActiveTab] = useState("daily"); // tab mặc định là bxh Ngày
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Gọi API lấy dữ liệu BXH thực tế khi trang được load
  useEffect(() => {
    const fetchRankings = async () => {
      try {
        setLoading(true);
        const response = await fetch("http://localhost:5000/api/manga/rankings");
        
        if (!response.ok) {
          throw new Error("Không thể kết nối lấy dữ liệu bảng xếp hạng");
        }
        
        const data = await response.json();
        setRankings(data.rankings); // Lưu cụm dữ liệu { daily, weekly, monthly } vào state
      } catch (err) {
        console.error("Lỗi fetch bxh:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchRankings();
  }, []);

  // Xác định danh sách truyện hiển thị dựa theo Tab đang được chọn
  const currentList = rankings[activeTab] || [];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-900 text-white">
        <p className="text-lg font-semibold animate-pulse">🔄 Đang tải bảng xếp hạng thực tế...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-900 text-red-400">
        <p className="text-lg font-semibold">❌ Lỗi: {error}</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-900 px-4 py-8 text-white md:px-8">
      <div className="mb-6 flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h1 className="text-3xl font-bold">Bảng Xếp Hạng</h1>
          <p className="mt-2 text-sm text-gray-400">Dữ liệu lượt xem trực tuyến cập nhật theo thời gian thực.</p>
        </div>

        {/* BỘ CHUYỂN ĐỔI TAB: NGÀY / TUẦN / THÁNG */}
        <div className="flex gap-1 rounded-lg bg-neutral-800 p-1 border border-white/5 self-start">
          <button
            onClick={() => setActiveTab("daily")}
            className={`rounded px-4 py-1.5 text-sm font-medium transition cursor-pointer ${
              activeTab === "daily" ? "bg-sky-600 text-white shadow" : "text-gray-400 hover:text-white"
            }`}
          >
            Hôm nay
          </button>
          <button
            onClick={() => setActiveTab("weekly")}
            className={`rounded px-4 py-1.5 text-sm font-medium transition cursor-pointer ${
              activeTab === "weekly" ? "bg-sky-600 text-white shadow" : "text-gray-400 hover:text-white"
            }`}
          >
            Tuần này
          </button>
          <button
            onClick={() => setActiveTab("monthly")}
            className={`rounded px-4 py-1.5 text-sm font-medium transition cursor-pointer ${
              activeTab === "monthly" ? "bg-sky-600 text-white shadow" : "text-gray-400 hover:text-white"
            }`}
          >
            Tháng này
          </button>
        </div>
      </div>

      {/* DANH SÁCH BẢNG XẾP HẠNG */}
      <div className="space-y-4">
        {currentList.length > 0 ? (
          currentList.map((manga, index) => {
            // Định nghĩa an toàn các trường dữ liệu từ Postgres DB
            const mangaId = manga.manga_id;
            const title = manga.manga_title || "Truyện chưa có tên";
            const cover = manga.manga_cover_image || "https://via.placeholder.com/150";
            const author = manga.manga_author || "Đang cập nhật";
            const summary = manga.manga_summary || "Chưa có mô tả tóm tắt cho truyện này.";
            const views = parseInt(manga.total_views || 0);

            return (
              <div key={mangaId || index} className="flex gap-4 rounded-lg border border-white/10 bg-neutral-800 p-4 shadow-lg transition hover:border-white/20">
                
                {/* Vị trí thứ hạng */}
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded text-xl font-bold ${
                  index === 0 ? "bg-yellow-500 text-neutral-950" : index === 1 ? "bg-gray-300 text-neutral-950" : index === 2 ? "bg-amber-600 text-white" : "bg-neutral-700 text-gray-300"
                }`}>
                  {index + 1}
                </div>
                
                {/* Ảnh bìa */}
                <img src={cover} alt={title} className="h-28 w-20 shrink-0 rounded object-cover shadow-md bg-neutral-700" />
                
                {/* Thông tin chi tiết */}
                <div className="min-w-0 flex-1">
                  <h2 className="text-base font-bold text-white md:text-lg truncate" title={title}>
                    {title}
                  </h2>
                  <p className="text-xs text-sky-300 md:text-sm">{author}</p>
                  <p className="mt-1 line-clamp-2 text-xs text-gray-400 md:text-sm">{summary}</p>
                  
                  <div className="mt-2 flex flex-wrap gap-3 text-xs text-gray-400">
                    <span className="font-semibold text-sky-400">
                      🔥 {views.toLocaleString("vi-VN")} lượt xem {activeTab === "daily" ? "hôm nay" : activeTab === "weekly" ? "tuần này" : "tháng này"}
                    </span>
                  </div>
                </div>
                
                {/* Nút hành động */}
                <Link
                  to={`/manga/${mangaId}`}
                  className="self-center shrink-0 rounded bg-sky-600 px-4 py-2 text-xs font-semibold text-white hover:bg-sky-500 transition shadow"
                >
                  Đọc ngay
                </Link>
              </div>
            );
          })
        ) : (
          <div className="rounded-lg border border-dashed border-white/10 p-12 text-center text-gray-500">
            📭 Chưa có dữ liệu lượt xem cho khoảng thời gian này.
          </div>
        )}
      </div>
    </div>
  );
};

export default Ranking;