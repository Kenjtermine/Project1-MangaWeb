import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { FaArrowLeft, FaArrowRight, FaHome, FaList } from "react-icons/fa";
import { addReadingHistory, getChapterById, getChaptersByMangaId, getMangaById, getReaderPages } from "../../data/api";

const ChapterReader = () => {
  const { mangaId, chapterId } = useParams();
  const manga = getMangaById(mangaId);
  const chapter = getChapterById(chapterId);
  const chapters = getChaptersByMangaId(mangaId);
  const pages = getReaderPages(mangaId, chapterId);
  const currentIndex = chapters.findIndex((item) => item.chapter_id === Number(chapterId));
  const prevChapter = currentIndex >= 0 ? chapters[currentIndex + 1] : null;
  const nextChapter = currentIndex > 0 ? chapters[currentIndex - 1] : null;

  useEffect(() => {
    if (manga && chapter) {
      addReadingHistory({ mangaId: manga.id, chapterId: chapter.chapter_id, pageNumber: 1, progressPercent: 5 });
    }
  }, [manga, chapter]);

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
          {pages.map((page) => (
            <img
              key={page.page_number}
              src={page.image_url}
              alt={`${manga.title} chapter ${chapter.chapter_number} page ${page.page_number}`}
              className="mx-auto w-full max-w-[900px] rounded bg-neutral-900 shadow-xl"
              loading="lazy"
            />
          ))}
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
      </main>
    </div>
  );
};

export default ChapterReader;
