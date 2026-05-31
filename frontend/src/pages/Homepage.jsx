import { useEffect, useState } from "react";
import HeroCarousel from "../components/hero-carousel/HeroCarousel";
import MangaCard from "../components/manga/MangaCard";
import { fetchHotMangas, fetchMangaList } from "../data/api";

const Homepage = () => {
  const [latestManga, setLatestManga] = useState([]);
  const [hotManga, setHotManga] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      setError("");

      const [latestRes, hotRes] = await Promise.all([
        fetchMangaList({ limit: 12 }),
        fetchHotMangas(5),
      ]);

      if (latestRes.ok) {
        setLatestManga(latestRes.mangas.slice(0, 8));
      } else {
        setError(latestRes.message || "Không tải được danh sách truyện");
      }

      if (hotRes.ok) {
        setHotManga(hotRes.mangas);
      }

      setIsLoading(false);
    };

    loadData();
  }, []);

  return (
    <div className="flex flex-col">
      <div className="flex-1 flex flex-col bg-neutral-900 text-white p-8">
        <h2 className="text-2xl font-semibold mb-6 text-white">Truyện hot hôm nay</h2>
        {isLoading ? (
          <div className="h-72 flex items-center justify-center text-gray-400 rounded-xl bg-neutral-800">
            Đang tải truyện nổi bật...
          </div>
        ) : hotManga.length > 0 ? (
          <HeroCarousel mangaList={hotManga} />
        ) : (
          <div className="h-72 flex items-center justify-center text-gray-400 rounded-xl bg-neutral-800">
            Chưa có truyện để hiển thị
          </div>
        )}
      </div>

      <main className="flex-1 p-6 bg-neutral-950">
        <section>
          <h2 className="text-2xl font-semibold mb-6 text-white">Truyện mới cập nhật</h2>

          {isLoading ? (
            <div className="text-center text-gray-400 py-10">Đang tải truyện từ hệ thống...</div>
          ) : error ? (
            <div className="text-center text-red-400 py-10">{error}</div>
          ) : latestManga.length === 0 ? (
            <div className="text-center text-gray-400 py-10">Chưa có truyện nào.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {latestManga.map((manga) => (
                <MangaCard key={manga.manga_id} manga={manga} />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default Homepage;
