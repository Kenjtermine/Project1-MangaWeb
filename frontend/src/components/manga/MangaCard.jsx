import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import FavBtn from "../favorite/FavoriteBt";
import { getGenresByMangaId } from "../../data/api";
import axios from "axios";

const statusLabel = {
  ongoing: "Đang ra",
  completed: "Hoàn thành",
  hiatus: "Tạm ngưng",
  cancelled: "Đã hủy",
};

const MangaCard = ({ manga, className = "" }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [tags, setTags] = useState([]);
  const navigate = useNavigate();

  // 1. Đồng bộ hóa ID và các trường thông tin từ Postgres Database Neon
  const mangaId = manga?.manga_id || manga?.id;
  const title = manga?.manga_title || manga?.title;
  const cover = manga?.manga_cover_image || manga?.cover;
  const author = manga?.manga_author || manga?.author;
  const summary = manga?.manga_summary || manga?.summary;
  const status = manga?.manga_status || manga?.status;

  useEffect(() => {
    if (!mangaId) {
      setTags([]);
      return;
    }

    let cancelled = false;
    getGenresByMangaId(mangaId).then((genres) => {
      if (!cancelled) setTags(genres);
    });

    return () => {
      cancelled = true;
    };
  }, [mangaId]);

  // 🔥 2. Hàm kích hoạt gọi API ghi nhận Lượt xem khi User bấm Đọc Truyện
  const handleReadManga = async (e) => {
    e.preventDefault(); 
    try {
      // Đã sửa 'mangas' thành 'manga' cho khớp với backend
      await axios.post("http://localhost:5000/api/manga/log-view", {
        manga_id: mangaId,
        chapter_id: manga?.latest_chapter_id || null 
      });
      console.log("✅ Đã cộng view thành công cho truyện:", mangaId);
    } catch (error) {
      console.error("❌ Lỗi ghi nhận log view từ Client:", error);
    } finally {
      // Dù thành công hay lỗi thì vẫn chuyển sang trang đọc truyện cho user
      navigate(`/manga/${mangaId}`);
    }
  };

  if (!manga) return null;

  return (
    <article
      className={`relative flex h-[360px] overflow-hidden rounded-lg bg-neutral-900 text-white shadow-md transition hover:shadow-xl md:h-96 ${className}`}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`flex h-full w-full flex-col transition-opacity duration-300 ${isHovered ? "opacity-0" : "opacity-100"}`}>
        
        {/* VÙNG KÍCH HOẠT HOVER */}
        <div 
          className="h-52 w-full md:h-64 cursor-pointer"
          onMouseEnter={() => setIsHovered(true)}
        >
          <img src={cover} alt={title} className="h-full w-full object-cover" />
        </div>

        {/* VÙNG THÔNG TIN BÊN DƯỚI */}
        <div className="flex flex-1 flex-col justify-between gap-3 p-3">
          <div>
            <h3 className="text-sm font-semibold line-clamp-2" title={title}>
              {title}
            </h3>
            <p className="mt-1 text-xs text-gray-400 line-clamp-1">{author || "Đang cập nhật"}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleReadManga}
              className="flex h-10 flex-1 items-center justify-center rounded bg-sky-600 px-2 text-sm font-semibold text-white transition hover:bg-sky-500 cursor-pointer"
            >
              Đọc ngay <i className="fa fa-arrow-right ml-2"></i>
            </button>
            <FavBtn mangaId={mangaId} compact />
          </div>
        </div>
      </div>

      {/* OVERLAY PANEL */}
      <div 
        className={`absolute inset-0 flex flex-col gap-3 bg-neutral-800 p-4 transition-all duration-300 
          ${isHovered ? "opacity-100 z-10" : "opacity-0 pointer-events-none -z-10"}
        `}
      >
        <h3 className="text-lg font-bold text-sky-400 line-clamp-2" title={title}>
          {title}
        </h3>

        <div className="flex flex-wrap gap-1">
          {tags && tags.length > 0 ? (
            tags.map((tag) => (
              <span key={tag.genre_id} className="rounded bg-neutral-700 px-2 py-1 text-[10px] text-gray-100">
                {tag.genre_name}
              </span>
            ))
          ) : (
            <span className="rounded bg-neutral-700 px-2 py-1 text-[10px] text-gray-100">Đang cập nhật</span>
          )}
        </div>

        <div className="flex flex-wrap gap-2 text-xs text-gray-300">
          <span>{statusLabel[status] || status || "Đang cập nhật"}</span>
          {manga.avg_rating ? <span>{manga.avg_rating} ★</span> : null}
          {manga.latest_chapter ? <span>Chap {manga.latest_chapter}</span> : null}
        </div>

        <p className="mt-1 text-sm leading-6 text-gray-300 line-clamp-5">
          {summary || "Chưa có mô tả cho truyện này."}
        </p>

        <div className="mt-auto flex items-center gap-2">
          <button
            onClick={handleReadManga}
            className="flex h-10 flex-1 items-center justify-center rounded bg-sky-600 px-2 text-sm font-semibold text-white shadow-lg transition hover:bg-sky-500 cursor-pointer"
          >
            Bắt đầu đọc <i className="fa fa-play ml-2"></i>
          </button>
          <FavBtn mangaId={mangaId} compact />
        </div>
      </div>
    </article>
  );
};

export default MangaCard;