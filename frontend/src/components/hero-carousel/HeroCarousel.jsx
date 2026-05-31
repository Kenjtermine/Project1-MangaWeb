import React, { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";

const HeroCarousel = ({ mangaList = [] }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlay, setIsAutoPlay] = useState(true);

    const nextSlide = () => {
        if (mangaList.length > 0) {
            setCurrentSlide((prev) => (prev + 1) % mangaList.length);
        }
    };

    const prevSlide = () => {
        if (mangaList.length > 0) {
            setCurrentSlide((prev) => (prev - 1 + mangaList.length) % mangaList.length);
        }
    };

    useEffect(() => {
        if (isAutoPlay && mangaList.length > 0) {
            const interval = setInterval(nextSlide, 5000);
            return () => clearInterval(interval);
        }
    }, [isAutoPlay, mangaList.length]);

    // Nếu chưa có dữ liệu thì hiện loading cho đẹp
    if (!mangaList || mangaList.length === 0) {
        return <div className="text-gray-400 text-center py-10 h-72 flex items-center justify-center bg-neutral-800 rounded-xl">Đang tải truyện nổi bật...</div>;
    }

    return (
        <div className="relative bg-neutral-900 text-white rounded-xl shadow-lg" onMouseEnter={() => setIsAutoPlay(false)} onMouseLeave={() => setIsAutoPlay(true)}>
            <div className="overflow-hidden rounded-xl">
                <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                    {mangaList.map((manga, index) => (
                        // Thêm flex-shrink-0 để ảnh không bị bóp méo
                        <div key={manga.manga_id || index} className="w-full flex-shrink-0 relative">
                            <LazyLoadImage
                                src={manga.manga_cover_image}
                                alt={manga.manga_title}
                                className="w-full h-72 object-cover"
                            />
                            {/* Overlay info */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-8">
                                <h3 className="text-3xl font-bold text-white mb-2 drop-shadow-lg">{manga.manga_title}</h3>
                                <p className="text-gray-200 mb-4 line-clamp-2 drop-shadow">{manga.manga_summary}</p>
                                <Link to={`/manga/${manga.manga_id}`}>
                                    <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-bold px-8 py-2 rounded shadow-lg transition">Đọc ngay</button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Nút chuyển slide */}
            <div className="absolute top-1/2 transform -translate-y-1/2 left-4 cursor-pointer z-10 bg-black/50 p-2 rounded-full hover:bg-black transition" onClick={prevSlide}>
                <FiChevronLeft className="text-white text-3xl drop-shadow-lg" />
            </div>
            <div className="absolute top-1/2 transform -translate-y-1/2 right-4 cursor-pointer z-10 bg-black/50 p-2 rounded-full hover:bg-black transition" onClick={nextSlide}>
                <FiChevronRight className="text-white text-3xl drop-shadow-lg" />
            </div>
            {/* Indicator dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {mangaList.map((_, idx) => (
                    <button
                        key={idx}
                        className={`w-3 h-3 rounded-full ${idx === currentSlide ? 'bg-yellow-400 scale-125' : 'bg-white/50'} border border-white/50 transition-all`}
                        onClick={() => setCurrentSlide(idx)}
                        aria-label={`Chuyển đến slide ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroCarousel;