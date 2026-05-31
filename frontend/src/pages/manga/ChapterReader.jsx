import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { FaArrowLeft, FaArrowRight, FaHome, FaList } from "react-icons/fa";
import CommentsSection from "../../components/comments/CommentsSection";
import { addReadingHistory, getChapterById, getChaptersByMangaId, getMangaById, getReaderPages } from "../../data/api";

const ChapterReader = () => {
  const { mangaId, chapterId } = useParams();
  
  // Khởi tạo State mặc định là null hoặc mảng rỗng để không bị báo lỗi "Cannot read properties of undefined"
  const [manga, setManga] = useState(null);
  const [chapter, setChapter] = useState(null);
  const [chapters, setChapters] = useState([]);
  const [pages, setPages] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        // Truyền đủ 2 tham số mangaId và chapterId cho getReaderPages như hàm Hybrid ở trên
        const [mangaData, chapterData, chaptersList, pagesList] = await Promise.all([
          getMangaById(mangaId),
          getChapterById(chapterId),
          getChaptersByMangaId(mangaId),
          getReaderPages(mangaId, chapterId) 
        ]);

        // Cập nhật State, đảm bảo dùng fallback rỗng nếu data bị hụt
        setManga(mangaData || null);
        setChapter(chapterData || null);
        setChapters(chaptersList || []);
        setPages(pagesList || []);
      } catch (error) {
        console.error("Lỗi Fatal khi tải dữ liệu chương truyện:", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (mangaId && chapterId) {
      fetchData();
    }
  }, [mangaId, chapterId]);

  useEffect(() => {
    const triggerViewLog = async () => {
      try {
        await fetch(`http://localhost:5000/api/mangas/chapters/${chapterId}/view`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' }
        });
      } catch (error) {
        console.warn("⚠️ API View Log chưa chạy (có thể do Backend đang lỗi):", error.message);
      }
    };

    // Chỉ trigger khi mọi thứ đã load xong
    if (chapterId && !isLoading && manga && chapter) {
      triggerViewLog();
      // addReadingHistory({ mangaId: manga.id, chapterId: chapter.chapter_id, pageNumber: 1, progressPercent: 5 });
    }
  }, [chapterId, isLoading, manga, chapter]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-950 flex items-center justify-center text-white">
        <h1 className="text-xl font-semibold animate-pulse">Đang tải truyện...</h1>
      </div>
    );
  }

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

  // Logic an toàn chống lỗi findIndex
  const safeChapters = chapters || [];
  const currentIndex = safeChapters.findIndex((item) => item.chapter_id === Number(chapterId));
  const prevChapter = currentIndex >= 0 ? safeChapters[currentIndex + 1] : null;
  const nextChapter = currentIndex > 0 ? safeChapters[currentIndex - 1] : null;

  return (
    <div className="min-h-screen bg-neutral-950 text-white">
      <div className="sticky top-0 z-20 border-b border-neutral-800 bg-neutral-950/95 px-4 py-4 backdrop-blur">
        <div className="mx-auto flex max-w-5xl flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-xl font-bold">{manga.title}</h1>
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
              to={`/manga/${manga.id}`}
              className="inline-flex h-10 items-center gap-2 rounded bg-neutral-800 px-3 text-sm font-semibold hover:bg-neutral-700"
            >
              <FaList /> Danh sách
            </Link>
            {prevChapter && (
              <Link
                to={`/manga/${manga.id}/chapter/${prevChapter.chapter_id}`}
                className="inline-flex h-10 items-center gap-2 rounded bg-sky-700 px-3 text-sm font-semibold hover:bg-sky-600"
              >
                <FaArrowLeft /> Chap trước
              </Link>
            )}
            {nextChapter && (
              <Link
                to={`/manga/${manga.id}/chapter/${nextChapter.chapter_id}`}
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
          {pages.length > 0 ? (
            pages.map((page) => (
              <img
                key={page.page_number}
                src={page.image_url}
                alt={`${manga.title} chapter ${chapter.chapter_number} page ${page.page_number}`}
                className="mx-auto w-full max-w-[900px] rounded bg-neutral-900 shadow-xl"
                loading="lazy"
              />
            ))
          ) : (
            <p className="text-center text-gray-400">Chưa có trang truyện nào được cập nhật.</p>
          )}
        </div>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {prevChapter && (
            <Link
              to={`/manga/${manga.id}/chapter/${prevChapter.chapter_id}`}
              className="inline-flex items-center gap-2 rounded bg-neutral-800 px-4 py-2 font-semibold hover:bg-neutral-700"
            >
              <FaArrowLeft /> Chap trước
            </Link>
          )}
          <Link to={`/manga/${manga.id}`} className="inline-flex items-center gap-2 rounded bg-sky-600 px-4 py-2 font-semibold hover:bg-sky-500">
            <FaList /> Danh sách chương
          </Link>
          {nextChapter && (
            <Link
              to={`/manga/${manga.id}/chapter/${nextChapter.chapter_id}`}
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