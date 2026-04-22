import React, { useState, useEffect } from "react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { Link } from "react-router-dom";

// Dữ liệu mock truyện nổi bật (có thể import từ Homepage nếu tách riêng file)
const mockFeaturedManga = [
    {
        id: 1,
        title: "One Piece",
        cover: "https://i.imgur.com/1n7f1bF.jpg",
        description: "Câu chuyện về Luffy và hành trình trở thành Vua Hải Tặc.",
    },
    {
        id: 2,
        title: "Naruto",
        cover: "https://i.imgur.com/2n7f1bF.jpg",
        description: "Hành trình trở thành Hokage của cậu bé Naruto.",
    },
    {
        id: 3,
        title: "Attack on Titan",
        cover: "https://i.imgur.com/3n7f1bF.jpg",
        description: "Cuộc chiến sinh tồn giữa loài người và Titan.",
    },
    {
        id: 4,
        title: "Demon Slayer",
        cover: "https://i.imgur.com/4n7f1bF.jpg",
        description: "Cuộc hành trình tiêu diệt quỷ của Tanjiro.",
    },
];

const HeroCarousel = ({ mangaList = mockFeaturedManga }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isAutoPlay, setIsAutoPlay] = useState(true);

    const nextSlide = () => {
        setCurrentSlide((prev) => (prev + 1) % mangaList.length);
    };

    const prevSlide = () => {
        setCurrentSlide((prev) => (prev - 1 + mangaList.length) % mangaList.length);
    };

    useEffect(() => {
        if (isAutoPlay) {
            const interval = setInterval(nextSlide, 5000);
            return () => clearInterval(interval);
        }
    }, [isAutoPlay]);

    return (
        <div className="relative bg-neutral-900 text-white rounded-xl shadow-lg" onMouseEnter={() => setIsAutoPlay(false)} onMouseLeave={() => setIsAutoPlay(true)}>
            <div className="overflow-hidden rounded-xl">
                <div
                    className="flex transition-transform duration-500 ease-in-out"
                    style={{ transform: `translateX(-${currentSlide * 100}%)` }}
                >
                    {mangaList.map((manga, index) => (
                        <div key={manga.id} className="w-full relative">
                            <LazyLoadImage
                                src={manga.cover}
                                alt={manga.title}
                                className="w-full h-72 object-cover"
                            />
                            {/* Overlay info */}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-8">
                                <h3 className="text-2xl font-bold text-white mb-2 drop-shadow-lg">{manga.title}</h3>
                                <p className="text-white mb-4 line-clamp-2 drop-shadow">{manga.description}</p>
                                <Link to={`/manga/${manga.id}`}>
                                    <button className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-6 py-2 rounded shadow transition">Đọc ngay</button>
                                </Link>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
            {/* Nút chuyển slide */}
            <div className="absolute top-1/2 transform -translate-y-1/2 left-4 cursor-pointer z-10" onClick={prevSlide}>
                <FiChevronLeft className="text-white text-3xl drop-shadow-lg" />
            </div>
            <div className="absolute top-1/2 transform -translate-y-1/2 right-4 cursor-pointer z-10" onClick={nextSlide}>
                <FiChevronRight className="text-white text-3xl drop-shadow-lg" />
            </div>
            {/* Indicator dots */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
                {mangaList.map((_, idx) => (
                    <button
                        key={idx}
                        className={`w-3 h-3 rounded-full ${idx === currentSlide ? 'bg-yellow-400' : 'bg-white/50'} border border-white`}
                        onClick={() => setCurrentSlide(idx)}
                        aria-label={`Chuyển đến slide ${idx + 1}`}
                    />
                ))}
            </div>
        </div>
    );
};

export default HeroCarousel;

