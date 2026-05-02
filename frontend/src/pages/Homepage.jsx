import React from "react";
import HeroCarousel from "../components/hero-carousel/HeroCarousel";
import MangaCard from "../components/manga/MangaCard";
import { getAllMangas } from "../data/api";

const Homepage = () => {
  const featuredManga = getAllMangas().slice(0, 8);

  return (
    <div className="flex-col">
      <div className="flex-1 flex flex-col bg-neutral-900 text-white p-8">
        <h2 className="text-2xl font-semibold mb-6 text-white">Truyện hot hôm nay</h2>
        <HeroCarousel />
      </div>

      <main className="flex-1 p-6">
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-indigo-700">Truyện mới cập nhật</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {featuredManga.map((manga) => (
              <MangaCard key={manga.id} manga={manga} />
            ))}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Homepage;
