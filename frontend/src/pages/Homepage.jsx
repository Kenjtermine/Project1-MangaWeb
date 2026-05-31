import React, { useState, useEffect } from "react";
import HeroCarousel from "../components/hero-carousel/HeroCarousel";
import MangaCard from "../components/manga/MangaCard";
import { fetchMangaList } from "../data/api"; 

const Homepage = () => {
  const [featuredManga, setFeaturedManga] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      const res = await fetchMangaList();
      if (res.ok) {
        setFeaturedManga(res.mangas.slice(0, 8)); 
      }
      setIsLoading(false);
    };
    
    loadData();
  }, []);

  return (
    <div className="flex-col">
      <div className="flex-1 flex flex-col bg-neutral-900 text-white p-8">
        <h2 className="text-2xl font-semibold mb-6 text-white">Truyện hot hôm nay</h2>
        <HeroCarousel mangaList={featuredManga} />
      </div>

      <main className="flex-1 p-6">
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-indigo-700">Truyện mới cập nhật</h2>
          
          {isLoading ? (
            <div className="text-center text-white py-10">Đang tải truyện từ hệ thống...</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {featuredManga.map((manga) => (
                <MangaCard 
                  key={manga.manga_id} 
                  
                  manga={{
                    id: manga.manga_id,
                    title: manga.manga_title,
                    coverImage: manga.manga_cover_image,
                    author: manga.manga_author,
                  }} 
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Homepage;