import { useState } from "react"; // Đừng quên import useState
import { Link } from "react-router-dom";
import FavBtn from "../favorite/FavoriteBt";
import { getGenres } from "../../data/api";

const statusLabel = {
  ongoing: "Đang ra",
  completed: "Hoàn thành",
  hiatus: "Tạm ngưng",
  cancelled: "Đã hủy",
};

const genreNameById = getGenres().reduce((acc, genre) => {
  acc[genre.id] = genre.name;
  return acc;
}, {});

const MangaCard = ({ manga, className = "" }) => {
  // Biến state độc lập cho TỪNG thẻ truyện
  const [isHovered, setIsHovered] = useState(false);

  if (!manga) return null;

  const mangaId = manga.manga_id || manga.id;
  const tags = (manga.genreIds || [])
    .slice(0, 3)
    .map((genreId) => genreNameById[genreId])
    .filter(Boolean);

  return (
    <article
      // Xóa class 'group', thêm sự kiện onMouseLeave để tắt Overlay khi chuột rời khỏi thẻ
      className={`relative flex h-[360px] overflow-hidden rounded-lg bg-neutral-900 text-white shadow-md transition hover:shadow-xl md:h-96 ${className}`}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`flex h-full w-full flex-col transition-opacity duration-300 ${isHovered ? "opacity-0" : "opacity-100"}`}>
        
        {/* VÙNG KÍCH HOẠT HOVER (Chỉ nằm ở khu vực ảnh) */}
        <div 
            className="h-52 w-full md:h-64 cursor-pointer"
            onMouseEnter={() => setIsHovered(true)}
        >
            <img src={manga.cover} alt={manga.title} className="h-full w-full object-cover" />
        </div>

        {/* VÙNG THÔNG TIN BÊN DƯỚI (Trỏ chuột vào đây sẽ không kích hoạt Overlay) */}
        <div className="flex flex-1 flex-col justify-between gap-3 p-3">
          <div>
            <h3 className="text-sm font-semibold line-clamp-2" title={manga.title}>
              {manga.title}
            </h3>
            <p className="mt-1 text-xs text-gray-400 line-clamp-1">{manga.author || "Đang cập nhật"}</p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              to={`/search?keyword=${encodeURIComponent(manga.title)}`}
              className="flex h-10 flex-1 items-center justify-center rounded bg-sky-600 px-2 text-sm font-semibold text-white transition hover:bg-sky-500"
            >
              Đọc ngay <i className="fa fa-arrow-right ml-2"></i>
            </Link>
            <FavBtn mangaId={mangaId} compact />
          </div>
        </div>
      </div>

      {/* OVERLAY: Ẩn/Hiện dựa vào state isHovered */}
      <div 
        className={`absolute inset-0 flex flex-col gap-3 bg-neutral-800 p-4 transition-all duration-300 
          ${isHovered ? "opacity-100 z-10" : "opacity-0 pointer-events-none -z-10"}
        `}
      >
        <h3 className="text-lg font-bold text-sky-400 line-clamp-2" title={manga.title}>
          {manga.title}
        </h3>

        <div className="flex flex-wrap gap-1">
          {tags.length > 0 ? (
            tags.map((tag) => (
              <span key={tag} className="rounded bg-neutral-700 px-2 py-1 text-[10px] text-gray-100">
                {tag}
              </span>
            ))
          ) : (
            <span className="rounded bg-neutral-700 px-2 py-1 text-[10px] text-gray-100">Đang cập nhật</span>
          )}
        </div>

        <div className="flex flex-wrap gap-2 text-xs text-gray-300">
          <span>{statusLabel[manga.status] || manga.status || "Đang cập nhật"}</span>
          {manga.avg_rating ? <span>{manga.avg_rating} ★</span> : null}
          {manga.latest_chapter ? <span>Chap {manga.latest_chapter}</span> : null}
        </div>

        <p className="mt-1 text-sm leading-6 text-gray-300 line-clamp-5">
          {manga.summary || "Chưa có mô tả cho truyện này."}
        </p>

        <div className="mt-auto flex items-center gap-2">
          <Link
            to={`/search?keyword=${encodeURIComponent(manga.title)}`}
            className="flex h-10 flex-1 items-center justify-center rounded bg-sky-600 px-2 text-sm font-semibold text-white shadow-lg transition hover:bg-sky-500"
          >
            Bắt đầu đọc <i className="fa fa-play ml-2"></i>
          </Link>
          <FavBtn mangaId={mangaId} compact />
        </div>
      </div>
    </article>
  );
};

export default MangaCard;