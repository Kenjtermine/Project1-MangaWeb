import { useState } from "react";
import { isFavoriteManga, toggleFavoriteManga } from "../../data/api";
import { toast } from "react-hot-toast";

const FavBtn = ({ mangaId = 1, className = "", buttonClassName = "", compact = false }) => {
    const [isClicked, setIsClicked] = useState(isFavoriteManga(mangaId));
    const [message, setMessage] = useState("");

    const handleToggle = () => {
        const result = toggleFavoriteManga(mangaId);
        setIsClicked(result.isFavorite);
        setMessage(result.message);
        window.setTimeout(() => setMessage(""), 1800);

        if (result.ok == false) {
            toast.error(result.message);
        }
    };

    return (
        <div className={`relative ${className}`}>
            <button
                type="button"
                onClick={handleToggle}
                aria-label={isClicked ? "Bỏ khỏi yêu thích" : "Thêm vào yêu thích"}
                title={isClicked ? "Bỏ khỏi yêu thích" : "Thêm vào yêu thích"}
                className={`font-bold rounded-md border transition flex items-center justify-center ${
                    compact ? "h-10 w-10 p-0" : "py-2 px-4 w-max"
                } ${
                    isClicked
                        ? "border-red-500 bg-red-500 text-white hover:bg-red-600"
                        : "border-neutral-600 bg-neutral-800 text-white hover:border-red-400 hover:bg-neutral-700 hover:text-red-300"
                } ${buttonClassName}`}
            >
                {/* Dùng far fa-heart-o cho trái tim rỗng (FontAwesome 5-6) */}
                {isClicked ? <i className="fa fa-heart text-xl"></i> : <i className="far fa-heart text-xl"></i>}
            </button>
            {message && (
                <div className="absolute right-0 top-full z-20 mt-2 w-56 rounded bg-neutral-950 px-3 py-2 text-xs text-white shadow-lg border border-white/10">
                    {message}
                </div>
            )}
        </div>
    );
};

export default FavBtn;
