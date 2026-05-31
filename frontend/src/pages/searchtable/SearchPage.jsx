import React, { useEffect, useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import FilterTable from "../../components/genre-list/FilterTable";
import MangaCard from "../../components/manga/MangaCard";
import { getGenreById, getMangasByGenre, searchMangas } from "../../data/api";

const SearchPage = ({ mode = "genre", results = null }) => {
  const { genreId } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [filters, setFilters] = useState({ genreIds: [], authorId: null, status: "", sort: "latest" });
  const [displayResults, setDisplayResults] = useState([]);
  const [pageTitle, setPageTitle] = useState("");
  const [pageSubtitle, setPageSubtitle] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (results) {
      setDisplayResults(results);
      setPageTitle("");
      setPageSubtitle("");
      return;
    }

    if (mode === "genre" && genreId) {
      let cancelled = false;

      const loadGenrePage = async () => {
        setIsLoading(true);
        try {
          const [genre, mangas] = await Promise.all([
            getGenreById(genreId),
            getMangasByGenre(genreId),
          ]);

          if (cancelled) return;

          setDisplayResults(mangas);
          setPageTitle(genre?.name || "Thể loại");
          setPageSubtitle(genre?.description || "Không có mô tả");
        } finally {
          if (!cancelled) setIsLoading(false);
        }
      };

      loadGenrePage();

      return () => {
        cancelled = true;
      };
    }

    if (mode === "search") {
      const searchResults = searchMangas({ keyword, ...filters });
      setDisplayResults(searchResults);
      setPageTitle(keyword ? `Kết quả tìm kiếm: "${keyword}"` : "Kết quả duyệt truyện");
      setPageSubtitle(`${searchResults.length} truyện được tìm thấy`);
      setIsLoading(false);
    }

    return undefined;
  }, [mode, genreId, keyword, filters, results]);

  if (mode !== "genre" && mode !== "search" && !results) {
    return <div className="bg-neutral-900 text-white p-8">Mode không hợp lệ</div>;
  }

  return (
    <div className="bg-neutral-900 text-white flex flex-col px-8 py-8 min-h-screen">
      <div className="relative flex-col w-full mb-6">
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className="w-full flex items-center justify-start gap-2 py-2 px-3 rounded hover:bg-sky-700 transition cursor-pointer"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className={`h-4 w-4 transition-colors duration-300 ${isFilterOpen ? "text-sky-400" : "text-white"}`}
            fill={isFilterOpen ? "currentColor" : "none"}
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z"
            />
          </svg>
          <span>Bộ lọc</span>
        </button>

        {isFilterOpen && (
          <FilterTable
            initialFilters={filters}
            onApply={(nextFilters) => {
              setFilters(nextFilters);
              setSearchParams({});
              setIsFilterOpen(false);
            }}
            onClose={() => setIsFilterOpen(false)}
          />
        )}
      </div>

      <h2 className="text-3xl font-bold mb-4 text-white">{pageTitle}</h2>
      <p className="text-gray-300 mb-6">{pageSubtitle}</p>

      {isLoading ? (
        <div className="col-span-full text-center py-12">
          <p className="text-gray-400 text-lg">Đang tải...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayResults.length > 0 ? (
            displayResults.map((manga) => (
              <MangaCard key={manga.id ?? manga.manga_id} manga={manga} />
            ))
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-gray-400 text-lg">
                {mode === "genre"
                  ? "Chưa có dữ liệu thể loại này"
                  : "Không tìm thấy truyện nào trùng khớp với tìm kiếm của bạn."}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default SearchPage;
