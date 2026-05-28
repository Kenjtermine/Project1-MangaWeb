import { useState, useEffect } from "react";
import { getRatingStats, submitRating } from "../../data/api";
import { toast } from "react-hot-toast";
import { FaStar } from "react-icons/fa";

const RatingBt = ({ mangaId = 1, className = "", buttonClassName = "", compact = false }) => {
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [isLoading, setIsLoading] = useState(true);
    const [ratingStats, setRatingStats] = useState({ avg_rating: 0, rating_count: 0 });
    const [message, setMessage] = useState("");

    // Fetch rating stats khi component load
    useEffect(() => {
        const fetchRatingStats = async () => {
            try {
                const stats = await getRatingStats(mangaId);
                setRatingStats(stats);
                // Lưu ý: có thể lấy user rating từ backend nếu cần
                setRating(0);
            } catch (error) {
                console.error('Lỗi lấy thống kê rating:', error);
            } finally {
                setIsLoading(false);
            }
        };
        fetchRatingStats();
    }, [mangaId]);

    const handleRating = async (star) => {
        setIsLoading(true);
        try {
            const result = await submitRating(mangaId, star);
            
            if (result.ok) {
                setRating(star);
                setMessage(result.message);
                window.setTimeout(() => setMessage(""), 1800);
                toast.success(result.message);
                
                // Reload rating stats
                const stats = await getRatingStats(mangaId);
                setRatingStats(stats);
            } else {
                toast.error(result.message);
                setMessage(result.message);
                window.setTimeout(() => setMessage(""), 1800);
            }
        } catch (error) {
            toast.error('Lỗi: ' + error.message);
        } finally {
            setIsLoading(false);
        }
    };

    const displayRating = hoverRating || rating;

    return (
        <div className={`relative ${className}`}>
            <div className={`flex items-center gap-2 ${compact ? "flex-col" : "flex-row"}`}>
                <div className="flex items-center gap-1">
                    {Array.from({ length: 5 }, (_, index) => (
                        <button
                            key={index}
                            type="button"
                            onClick={() => handleRating(index + 1)}
                            onMouseEnter={() => setHoverRating(index + 1)}
                            onMouseLeave={() => setHoverRating(0)}
                            disabled={isLoading}
                            aria-label={`Đánh giá ${index + 1} sao`}
                            title={`Đánh giá ${index + 1} sao`}
                            className={`transition ${buttonClassName} ${
                                isLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer hover:scale-110'
                            }`}
                        >
                            <FaStar 
                                size={compact ? 20 : 24}
                                className={
                                    index < displayRating
                                        ? "text-yellow-400"
                                        : "text-neutral-600 hover:text-yellow-300"
                                }
                            />
                        </button>
                    ))}
                </div>
                
                {!compact && (
                    <span className="text-sm text-gray-300 whitespace-nowrap">
                        {ratingStats.avg_rating.toFixed(1)}/5 ({ratingStats.rating_count})
                    </span>
                )}
            </div>

            {message && (
                <div className="absolute right-0 top-full z-20 mt-2 w-56 rounded bg-neutral-950 px-3 py-2 text-xs text-white shadow-lg border border-white/10">
                    {message}
                </div>
            )}
        </div>
    );
};

export default RatingBt;
