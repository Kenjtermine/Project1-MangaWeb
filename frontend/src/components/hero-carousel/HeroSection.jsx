import { useEffect, useState } from "react";
import FavBtn from "../favorite/FavoriteBt";
import { Link } from "react-router-dom";
import { getRankingMangas, getGenresByMangaId } from "../../data/api";

const HeroSection = () => {
    const top1Manga = getRankingMangas(1)[0];
    const mangaId = top1Manga?.manga_id || top1Manga?.id;
    const [genresOfManga, setGenresOfManga] = useState([]);

    useEffect(() => {
        if (!mangaId) return;

        let cancelled = false;
        getGenresByMangaId(mangaId).then((genres) => {
            if (!cancelled) setGenresOfManga(genres);
        });

        return () => {
            cancelled = true;
        };
    }, [mangaId]);

    if (!top1Manga) return null;

    return (
        <div 
            className="relative w-full h-auto md:h-[400px] overflow-hidden shadow-lg mb-8" 
            style={{ 
                backgroundImage: `url(${top1Manga.cover})`, 
                backgroundSize: 'cover', 
                backgroundPosition: 'center' 
            }}
        >
            <div className="absolute inset-0 bg-neutral-600/70 backdrop-blur-sm"></div>

            <div className="relative z-10 w-full max-w-7xl mx-auto h-full flex flex-col md:flex-row items-center md:items-start p-6 md:p-12 gap-8">
                
                <div className="shrink-0">
                    <img 
                        src={top1Manga.cover} 
                        alt="Manga Cover" 
                        className="h-64 w-44 md:h-80 md:w-56 object-cover rounded-lg shadow-[0_0_15px_rgba(0,0,0,0.5)] border border-white/10" 
                    />
                </div>

                <div className="flex flex-col text-white pt-2">
                    <h2 className="text-sm font-semibold text-sky-300 uppercase tracking-widest mb-2">TOP 1 Truyện được yêu thích tháng này</h2>
                    
                    <h1 className="text-3xl md:text-4xl font-extrabold mb-4 drop-shadow-md">
                        {top1Manga.title}
                    </h1>
                    
                    {/* Thể loại (Tags) nổi bật */}
                    <div className="flex flex-wrap gap-2 mb-4">
                        {genresOfManga.map((genre) => {
                            return (
                                <span key={genre.genre_id} className="px-3 py-1 text-xs font-bold bg-white text-black rounded-sm uppercase">
                                    {genre?.genre_name}
                                </span>
                            );
                        })}
                    </div>

                    {/* Tóm tắt nội dung */}
                    <p className="text-gray-300 text-sm md:text-base leading-relaxed max-w-3xl line-clamp-4">
                        {top1Manga.summary}
                    </p>
                    {/* Tác giả */}               
                    <div className="mt-auto pt-6 text-sm italic text-yellow-400 font-semibold">
                        {top1Manga.author}
                    </div>
                    <div className="h-px w-full bg-gray-400 my-4"></div>
                    <div className="flex flex-row gap-4 items-center">
                        <button className="mt-6 bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-6 rounded-md transition w-max">
                            {/* Phần này của KhangLe sao tới h chưa thấy push manga section :((*/}
                            <Link to = "/manga/1">Xem ngay</Link>
                        </button>
                        
                        {/* Nút yêu thích (Favorite) */}
                        <FavBtn className="mt-6" compact />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default HeroSection;
