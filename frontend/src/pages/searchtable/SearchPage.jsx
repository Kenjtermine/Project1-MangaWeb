import React, { useState } from "react";
import { useParams, useSearchParams } from "react-router-dom";
import mockData from "../../data/mockData.json";

const mockGenresData = mockData.genres;
const mockMangaByGenre = mockData.mangaByGenre;
const allMangaList = mockData.allMangas;

const SearchPage = ({ mode = "genre", searchData = null, results = null }) => {
  const { genreId } = useParams();
  const [searchParams] = useSearchParams();
  const keyword = searchParams.get("keyword");

  // Lấy dữ liệu genre từ ID nếu mode là "genre"
  let displayData = searchData;
  let displayResults = results;

  if (mode === "genre" && genreId) {
    const genre = mockGenresData.find(g => g.id === parseInt(genreId));
    displayData = genre || mockGenresData[0];
    displayResults = mockMangaByGenre[genreId] || [];
  } else if (mode === "search" && keyword) {
    // Lọc truyện dựa trên keyword (title)
    displayResults = allMangaList.filter(manga =>
      manga.title.toLowerCase().includes(keyword.toLowerCase())
    );
  }

  // Page có hai chế độ hiển thị theo mode: theo thể loại hoặc theo từ khóa tìm kiếm
  if (mode === "genre") {
    return (
      <div className="bg-neutral-900 text-white flex flex-col px-8 py-8 min-h-screen">
        <h2 className="text-3xl font-bold mb-4 text-white">{displayData?.name || "Thể loại"}</h2>
        <p className="text-gray-300 mb-6">{displayData?.description || "Không có mô tả"}</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayResults && displayResults.length > 0 ? (
            displayResults.map((manga) => (
              <div key={manga.id} className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden flex flex-col">
                <img src={manga.cover} alt={manga.title} className="h-48 w-full object-cover" />
                <div className="p-4">
                  <p className="text-lg font-bold text-gray-800">{manga.title}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">Chưa có dữ liệu thể loại này</p>
            </div>
          )}
        </div>
      </div>
    );
  } else if (mode === "search") {
    return (
      <div className="bg-neutral-900 text-white flex flex-col px-8 py-8 min-h-screen">
        <h2 className="text-3xl font-bold mb-4 text-white">Kết quả tìm kiếm: "{keyword}"</h2>
        <p className="text-gray-300 mb-6">{displayResults?.length || 0} truyện được tìm thấy</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {displayResults && displayResults.length > 0 ? (
            displayResults.map((manga) => (
              <div key={manga.id} className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden flex flex-col">
                <img src={manga.cover} alt={manga.title} className="h-48 w-full object-cover" />
                <div className="p-4">
                  <p className="text-lg font-bold text-gray-800">{manga.title}</p>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">Không tìm thấy kết quả cho "{keyword}"</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  return <div className="bg-neutral-900 text-white p-8">Mode không hợp lệ</div>;
};

export default SearchPage;