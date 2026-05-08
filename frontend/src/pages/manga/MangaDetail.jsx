import React from "react";
import { Link, useParams } from "react-router-dom";
import { FaBookOpen, FaEye, FaHeart, FaList, FaRss, FaStar, FaTags, FaUser } from "react-icons/fa";
import FavBtn from "../../components/favorite/FavoriteBt";
import { getChaptersByMangaId, getGenres, getMangaById } from "../../data/api";

const statusLabel = {
  ongoing: "Đang tiến hành",
  completed: "Hoàn thành",
  hiatus: "Tạm ngưng",
  cancelled: "Đã hủy",
};

const formatNumber = (value = 0) => new Intl.NumberFormat("vi-VN").format(Math.round(value));

const formatDate = (value) =>
  value
    ? new Intl.DateTimeFormat("vi-VN", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      }).format(new Date(value))
    : "Đang cập nhật";

const MangaDetail = () => {
  const { mangaId } = useParams();
  const manga = getMangaById(mangaId);
  const chapters = getChaptersByMangaId(mangaId);
  const genreMap = getGenres().reduce((acc, genre) => {
    acc[genre.id] = genre.name;
    return acc;
  }, {});

  if (!manga) {
    return (
      <div className="min-h-screen bg-neutral-900 px-8 py-10 text-white">
        <h1 className="text-2xl font-bold">Không tìm thấy truyện</h1>
        <Link to="/" className="mt-4 inline-flex rounded bg-sky-600 px-4 py-2 font-semibold hover:bg-sky-500">
          Về trang chủ
        </Link>
      </div>
    );
  }

  const firstChapter = chapters[chapters.length - 1];
  const latestChapter = chapters[0];
  const genreNames = (manga.genreIds || []).map((id) => genreMap[id]).filter(Boolean);

  return (
    <div className="min-h-screen bg-neutral-900 px-6 py-8 text-white md:px-8">
      <section className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <div className="overflow-hidden rounded-lg bg-neutral-800 shadow-xl">
          <img src={manga.cover} alt={manga.title} className="h-[380px] w-full object-cover" />
        </div>

        <div>
          <p className="text-sm italic text-gray-400">Cập nhật lúc: {formatDate(manga.updated_at)}</p>
          <h1 className="mt-2 text-3xl font-bold uppercase text-white">{manga.title}</h1>

          <div className="mt-6 grid gap-4 text-sm text-gray-200 sm:grid-cols-2">
            <div className="flex items-start gap-3">
              <FaUser className="mt-1 text-sky-400" />
              <span>
                <b>Tác giả:</b> {manga.author || "Đang cập nhật"}
              </span>
            </div>
            <div className="flex items-start gap-3">
              <FaRss className="mt-1 text-sky-400" />
              <span>
                <b>Tình trạng:</b> {statusLabel[manga.status] || "Đang cập nhật"}
              </span>
            </div>
            <div className="flex items-start gap-3">
              <FaTags className="mt-1 text-sky-400" />
              <span>
                <b>Thể loại:</b> {genreNames.length ? genreNames.join(" - ") : "Đang cập nhật"}
              </span>
            </div>
            <div className="flex items-start gap-3">
              <FaEye className="mt-1 text-sky-400" />
              <span>
                <b>Lượt xem:</b> {formatNumber(manga.total_views)}
              </span>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-1 text-yellow-400">
              {Array.from({ length: 5 }, (_, index) => (
                <FaStar key={index} className={index < Math.round(manga.avg_rating || 0) ? "" : "text-neutral-600"} />
              ))}
            </div>
            <span className="text-sm text-gray-300">
              {manga.avg_rating || 0}/5 - {formatNumber(manga.rating_count)} lượt đánh giá
            </span>
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <FavBtn mangaId={manga.id} />
            <span className="flex items-center gap-2 text-sm text-gray-300">
              <FaHeart className="text-rose-400" /> {formatNumber(Math.max(1000, manga.total_views / 12))} người đã theo dõi
            </span>
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {firstChapter && (
              <Link
                to={`/manga/${manga.id}/chapter/${firstChapter.chapter_id}`}
                className="inline-flex items-center gap-2 rounded bg-amber-500 px-4 py-2 font-semibold text-black transition hover:bg-amber-400"
              >
                <FaBookOpen /> Đọc từ đầu
              </Link>
            )}
            {latestChapter && (
              <Link
                to={`/manga/${manga.id}/chapter/${latestChapter.chapter_id}`}
                className="inline-flex items-center gap-2 rounded bg-sky-600 px-4 py-2 font-semibold text-white transition hover:bg-sky-500"
              >
                <FaBookOpen /> Đọc mới nhất
              </Link>
            )}
          </div>
        </div>
      </section>

      <section className="mt-8 border-t border-sky-700 pt-5">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-sky-300">
          <FaBookOpen /> Nội dung truyện {manga.title}
        </h2>
        <p className="mt-3 max-w-5xl text-sm leading-7 text-gray-300">{manga.summary || "Chưa có mô tả cho truyện này."}</p>
      </section>

      <section className="mt-8 border-t border-sky-700 pt-5">
        <h2 className="flex items-center gap-2 text-xl font-semibold text-sky-300">
          <FaList /> Danh sách chương
        </h2>

        <div className="mt-4 overflow-hidden rounded-lg border border-neutral-700 bg-neutral-950">
          <div className="grid grid-cols-[1fr_150px_120px] bg-neutral-800 px-4 py-3 text-sm font-semibold text-gray-200">
            <span>Số chương</span>
            <span>Cập nhật</span>
            <span>Lượt xem</span>
          </div>
          {chapters.map((chapter) => (
            <Link
              key={chapter.chapter_id}
              to={`/manga/${manga.id}/chapter/${chapter.chapter_id}`}
              className="grid grid-cols-[1fr_150px_120px] border-t border-neutral-800 px-4 py-3 text-sm text-gray-300 transition hover:bg-neutral-800 hover:text-white"
            >
              <span className="font-medium">
                Chapter {chapter.chapter_number}
                {chapter.chapter_title ? `: ${chapter.chapter_title}` : ""}
              </span>
              <span className="text-gray-400">{new Date(chapter.published_at).toLocaleDateString("vi-VN")}</span>
              <span className="text-gray-400">{formatNumber(chapter.view_count)}</span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default MangaDetail;
