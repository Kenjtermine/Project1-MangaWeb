import { useState, useEffect, useCallback } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";

const HeroCarousel = ({ mangaList = [] }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlay, setIsAutoPlay] = useState(true);

  const slides = mangaList.map((manga) => ({
    id: manga.manga_id ?? manga.id,
    title: manga.title ?? manga.manga_title ?? "",
    cover: manga.cover ?? manga.manga_cover_image ?? "",
    description: manga.summary ?? manga.manga_summary ?? "",
  }));

  const nextSlide = useCallback(() => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = () => {
    if (slides.length === 0) return;
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    setCurrentSlide(0);
  }, [slides.length]);

  useEffect(() => {
    if (!isAutoPlay || slides.length <= 1) return undefined;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlay, nextSlide, slides.length]);

  if (slides.length === 0) {
    return null;
  }

  return (
    <div
      className="relative bg-neutral-900 text-white rounded-xl shadow-lg"
      onMouseEnter={() => setIsAutoPlay(false)}
      onMouseLeave={() => setIsAutoPlay(true)}
    >
      <div className="overflow-hidden rounded-xl">
        <div
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((manga) => (
            <div key={manga.id} className="w-full shrink-0 relative">
              <LazyLoadImage
                src={manga.cover}
                alt={manga.title}
                className="w-full h-72 object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-8">
                <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">{manga.title}</h3>
                <p className="text-white mb-4 line-clamp-2 drop-shadow">
                  {manga.description || "Chưa có mô tả."}
                </p>
                <Link to={`/manga/${manga.id}`}>
                  <button
                    type="button"
                    className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2 rounded shadow transition"
                  >
                    Đọc ngay
                  </button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {slides.length > 1 && (
        <>
          <div
            className="absolute top-1/2 -translate-y-1/2 left-4 cursor-pointer z-10"
            onClick={prevSlide}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && prevSlide()}
          >
            <FiChevronLeft className="text-white text-3xl drop-shadow-lg" />
          </div>
          <div
            className="absolute top-1/2 -translate-y-1/2 right-4 cursor-pointer z-10"
            onClick={nextSlide}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && nextSlide()}
          >
            <FiChevronRight className="text-white text-3xl drop-shadow-lg" />
          </div>
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {slides.map((_, idx) => (
              <button
                key={idx}
                type="button"
                className={`w-3 h-3 rounded-full ${
                  idx === currentSlide ? "bg-yellow-400" : "bg-white/50"
                } border border-white`}
                onClick={() => setCurrentSlide(idx)}
                aria-label={`Chuyển đến slide ${idx + 1}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default HeroCarousel;
