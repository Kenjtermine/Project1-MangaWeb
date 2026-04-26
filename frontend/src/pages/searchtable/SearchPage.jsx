import React, { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import mockData from "../../data/mockData.json";
import FilterTable from "../../components/genre-list/FilterTable";

const mockGenresData = mockData.genres;
const mockMangaByGenre = mockData.mangaByGenre;
const allMangaList = mockData.allMangas;

const SearchPage = ({ mode = "genre", searchData = null, results = null }) => {
  const { genreId } = useParams();
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword") || "";
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // 1. Khởi tạo biến dữ liệu
  let displayResults = results || [];
  let pageTitle = "";
  let pageSubtitle = "";

  // 2. Xử lý Logic lấy dữ liệu và Text theo Mode
  if (mode === "genre" && genreId) {
    const genre = mockGenresData.find(g => g.id === parseInt(genreId));
    const genreData = genre || mockGenresData[0]; // Fallback tạm thời
    
    displayResults = mockMangaByGenre[genreId] || [];
    pageTitle = genreData?.name || "Thể loại";
    pageSubtitle = genreData?.description || "Không có mô tả";

  } else if (mode === "search") {
    if (keyword) {
      displayResults = allMangaList.filter(manga =>
        manga.title.toLowerCase().includes(keyword.toLowerCase())
      );
    }
    pageTitle = keyword ? `Kết quả tìm kiếm: "${keyword}"` : 'Kết quả duyệt truyện';
    pageSubtitle = `${displayResults.length} truyện được tìm thấy`;
  } else {
    return <div className="bg-neutral-900 text-white p-8">Mode không hợp lệ</div>;
  }

  // 3. RENDER UI - Chỉ viết 1 lần duy nhất!
  return (
    <div className="bg-neutral-900 text-white flex flex-col px-8 py-8 min-h-screen">
      <div className="relative flex-col w-full mb-6">
            <button 
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                
                className="w-full flex items-center justify-start gap-2 py-2 px-3 rounded hover:bg-sky-700 transition cursor-pointer"
            >
                {/* Icon Phễu Lọc (Funnel) */}
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    className={`h-4 w-4 transition-colors duration-300 ${isFilterOpen ? 'text-sky-400' : 'text-white'}`}
                    fill={isFilterOpen ? 'currentColor' : 'none'} viewBox="0 0 24 24" stroke="currentColor"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                </svg>
                <span>Bộ lọc</span>
            </button>
            <div>
                {isFilterOpen && <FilterTable onClose={()=> setIsFilterOpen(false) }/>}
            </div>
        </div>
      {/* Header động tùy theo mode */}
      <h2 className="text-3xl font-bold mb-4 text-white">{pageTitle}</h2>
      <p className="text-gray-300 mb-6">{pageSubtitle}</p>

      {/* Grid danh sách truyện dùng chung */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {displayResults.length > 0 ? (
          displayResults.map((manga) => (
            <div key={manga.id} className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden flex flex-col cursor-pointer">
              <img src={manga.cover} alt={manga.title} className="h-48 w-full object-cover" />
              <div className="p-4">
                {/* Text màu tối vì nền card đang là màu trắng */}
                <p className="text-lg font-bold text-gray-800 line-clamp-2">{manga.title}</p>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-full text-center py-12">
            <p className="text-gray-400 text-lg">
              {mode === "genre" ? "Chưa có dữ liệu thể loại này" : `Không tìm thấy truyện nào trùng khớp với tìm kiếm của bạn.`}
            </p>
          </div>
        )}
      </div>
      
    </div>
  );
};

export default SearchPage;