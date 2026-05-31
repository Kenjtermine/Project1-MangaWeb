import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaArrowLeft, FaArrowRight, FaHome, FaList } from "react-icons/fa";
import CommentsSection from "../../components/comments/CommentsSection";

// 1. IMPORT CÁC HÀM GỌI API THẬT
import { 
  fetchMangaById, 
  fetchChaptersByMangaId, 
  fetchPagesByChapterId,
  addReadingHistory 
} from "../../data/api";

const ChapterReader = () => {
  // 2. LẤY ID TỪ TRÊN URL XUỐNG
  const { mangaId, chapterId } = useParams();

  // 3. TẠO KHO CHỨA DỮ LIỆU THẬT
  const [manga, setManga] = useState(null);
  const [chapter, setChapter] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [pages, setPages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // 4. GỌI API ĐỒNG LOẠT KHI MỞ TRANG
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      
      // Chạy 3 API cùng 1 lúc để trang load nhanh hơn
      const [mangaRes, chapterList, pageList] = await Promise.all([
        fetchMangaById(mangaId),
        fetchChaptersByMangaId(mangaId),
        fetchPagesByChapterId(chapterId)
      ]);

      if (mangaRes.ok) setManga(mangaRes.manga);
      setChapters(chapterList);
      setPages(pageList);

      // Tìm thông tin của chương hiện tại từ trong danh sách vừa lấy về
      const currentChap = chapterList.find(c => String(c.chapter_id) === String(chapterId));
      setChapter(currentChap || null);

      setIsLoading(false);
    };

    loadData();
  }, [mangaId, chapterId]);

  // (Tùy chọn) Lưu lịch sử đọc truyện
  useEffect(() => {
    if (manga && chapter) {
      try {
        // Lưu ý: đổi manga.id thành manga.manga_id cho khớp Database
        addReadingHistory({ mangaId: manga.manga_id, chapterId: chapter.chapter_id, pageNumber: 1, progressPercent: 5 });
      } catch (err) {
        console.log("Tính năng lưu lịch sử tạm tắt.");
      }
    }
  }, [manga, chapter]);

  // 5. TÍNH TOÁN NÚT CHUYỂN CHƯƠNG PREV / NEXT
  const currentIndex = chapters.findIndex((item) => String(item.chapter_id) === String(chapterId));
  const prevChapter = currentIndex >= 0 && currentIndex < chapters.length - 1 ? chapters[currentIndex + 1] : null;
  const nextChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;

  // HIỂN THỊ MÀN HÌNH CHỜ
  if (isLoading) {
    return <div className="min-h-screen bg-neutral-950 px-8 py-10 text-white flex justify-center items-center">Đang tải ảnh truyện...</div>;
  }

  // BÁO LỖI NẾU KHÔNG CÓ DỮ LIỆU
  if (!manga || !chapter) {
    return (
      <div className="min-h-screen bg-neutral-950 px-8 py-10 text-white">
        <h1 className="text-2xl font-bold">Không tìm thấy chương truyện</h1>
        <Link to="/" className="mt-4 inline-flex rounded bg-sky-600 px-4 py-2 font-semibold hover:bg-sky-500">
          Về trang chủ
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="sticky top-0 z-20 border-b border-neutral-800 bg-neutral-950/95 px-4 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            {/* Đổi manga.title thành manga.manga_title */}
            <h1 className="text-xl font-bold">{manga.manga_title}</h1>
            <p className="text-sm text-gray-400">
              Chapter {chapter.chapter_number}
              {chapter.chapter_title ? `: ${chapter.chapter_title}` : ""}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link to="/" className="inline-flex h-10 items-center gap-2 rounded bg-neutral-800 px-3 text-sm font-semibold hover:bg-neutral-700">
              <FaHome /> Trang chủ
            </Link>
            <Link
              to={`/manga/${manga.manga_id}`}
              className="inline-flex h-10 items-center gap-2 rounded bg-neutral-800 px-3 text-sm font-semibold hover:bg-neutral-700"
            >
              <FaList /> Danh sách
            </Link>
            {prevChapter && (
              <Link
                to={`/manga/${manga.manga_id}/chapter/${prevChapter.chapter_id}`}
                className="inline-flex h-10 items-center gap-2 rounded bg-sky-700 px-3 text-sm font-semibold hover:bg-sky-600"
              >
                <FaArrowLeft /> Chap trước
              </Link>
            )}
            {nextChapter && (
              <Link
                to={`/manga/${manga.manga_id}/chapter/${nextChapter.chapter_id}`}
                className="inline-flex h-10 items-center gap-2 rounded bg-sky-600 px-3 text-sm font-semibold hover:bg-sky-500"
              >
                Chap sau <FaArrowRight />
              </Link>
            )}
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-4xl px-3 py-6">
        <div className="space-y-4">
          {/* MÁY CHIẾU ẢNH LÊN MÀN HÌNH */}
          {pages.length === 0 ? (
            <div className="text-center text-gray-400 py-10">Chương này chưa được cập nhật ảnh.</div>
          ) : (
            pages.map((page) => (
              <img
                key={page.page_id || page.page_number}
                src={page.image_url}
                alt={`${manga.manga_title} chapter ${chapter.chapter_number} page ${page.page_number}`}
                className="mx-auto w-full max-w-[900px] rounded bg-neutral-900 shadow-xl"
                loading="lazy"
              />
            ))
          )}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {prevChapter && (
            <Link
              to={`/manga/${manga.manga_id}/chapter/${prevChapter.chapter_id}`}
              className="inline-flex items-center gap-2 rounded bg-neutral-800 px-4 py-2 font-semibold hover:bg-neutral-700"
            >
              <FaArrowLeft /> Chap trước
            </Link>
          )}
          <Link to={`/manga/${manga.manga_id}`} className="inline-flex items-center gap-2 rounded bg-sky-600 px-4 py-2 font-semibold hover:bg-sky-500">
            <FaList /> Danh sách chương
          </Link>
          {nextChapter && (
            <Link
              to={`/manga/${manga.manga_id}/chapter/${nextChapter.chapter_id}`}
              className="inline-flex items-center gap-2 rounded bg-neutral-800 px-4 py-2 font-semibold hover:bg-neutral-700"
            >
              Chap sau <FaArrowRight />
            </Link>
          )}
        </div>
        <CommentsSection chapterId={chapter.chapter_id} />
      </main>
    </div>
  );
};

export default ChapterReader;