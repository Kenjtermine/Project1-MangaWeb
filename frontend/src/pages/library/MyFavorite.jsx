import { Link } from "react-router-dom";
import {useEffect, useState, useRef} from "react";
import { getCurrentUser, getUserFavorites, removeFavoriteManga } from "../../data/api";
import toast from "react-hot-toast";

const MyFavorites = () => {
    const user = getCurrentUser();
    const [favList, setFavList] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [hasError, setHasError] = useState(false);
    const retryCountRef = useRef(0);
    const hasLoadedRef = useRef(false); // Prevent duplicate loads
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 5000; // 5 seconds

    useEffect(() => {
        // Prevent duplicate loads
        if (hasLoadedRef.current) return;
        hasLoadedRef.current = true;

        if (!user) {
            toast.error("Vui lòng đăng nhập để xem danh sách truyện yêu thích.");
            setIsLoading(false);
            setHasError(true);
            return;
        }

        const loadFavorites = async () => {
            try {
                setIsLoading(true);
                setHasError(false);
                const favorites = await getUserFavorites();
                setFavList(favorites || []);
                retryCountRef.current = 0; // Reset retry counter on success
            } catch (error) {
                console.error('Lỗi tải danh sách yêu thích:', error);
                
                // Retry logic with delay
                if (retryCountRef.current < MAX_RETRIES) {
                    retryCountRef.current += 1;
                    console.log(`Sẽ thử lại lần ${retryCountRef.current} sau ${RETRY_DELAY / 1000}s...`);
                    toast.info(`Thử lại lần ${retryCountRef.current}/${MAX_RETRIES}...`);
                    
                    // Schedule retry
                    const retryTimer = setTimeout(() => {
                        loadFavorites(); // Recursive call for retry
                    }, RETRY_DELAY);
                    
                    return () => clearTimeout(retryTimer);
                } else {
                    // Max retries exceeded
                    console.error('Đã vượt quá số lần thử lại tối đa');
                    setHasError(true);
                    toast.error('Không thể tải danh sách yêu thích sau 3 lần thử. Vui lòng thử lại sau.');
                }
            } finally {
                setIsLoading(false);
            }
        };

        loadFavorites();
        
        // Cleanup function to prevent memory leaks
        return () => {
            retryCountRef.current = 0;
        };
    }, []); // Empty dependency array - load only once on mount

    // Manual reload function
    const handleReload = () => {
        retryCountRef.current = 0;
        setHasError(false);
        setFavList([]);
        // Trigger reload by temporarily changing the dependency
        window.location.reload();
    };

    const handleRemove = async (mangaId, mangaTitle) => {
        try {
            const result = await removeFavoriteManga(mangaId);
            if (result.ok) {
                // Reload danh sách favorites
                const favorites = await getUserFavorites();
                setFavList(favorites || []);
                toast.success(`Đã xóa ${mangaTitle} khỏi danh sách yêu thích.`);
            } else {
                toast.error(result.message || 'Lỗi khi xóa yêu thích');
            }
        } catch (error) {
            console.error('Lỗi khi xóa yêu thích:', error);
            toast.error('Lỗi: Không thể xóa yêu thích. Vui lòng thử lại sau.');
        }
    };

    return (
        <div className="bg-sky-900 text-white flex flex-col px-8 py-8 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Danh sách truyện yêu thích</h1>
            <div className="h-px border-sky-300 w-full my-4 border-b-2"></div>
            <div className="flex flex-col gap-4 min-h-[65vh]">
                {!user && <p className="text-center text-red-400">Vui lòng đăng nhập để xem danh sách truyện yêu thích.</p>}
                {user && hasError && !isLoading && (
                    <div className="text-center">
                        <p className="text-red-400 mb-4">Không thể tải danh sách yêu thích</p>
                        <button 
                            onClick={handleReload}
                            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded"
                        >
                            Thử lại
                        </button>
                    </div>
                )}
                {user && isLoading && !hasError && <p className="text-center text-yellow-400">⏳ Đang tải danh sách yêu thích...</p>}
                {user && !isLoading && !hasError && favList.length === 0 && <p className="text-center">Bạn chưa có bộ truyện yêu thích</p>}
                {favList.map((favorite) => (
                    <div key={favorite.manga_id} className="p-4 rounded bg-sky-700 transition flex flex-row justify-between">
                        <div className="flex gap-4">
                            <img 
                                src={favorite.manga_cover_image || "https://via.placeholder.com/64x96"} 
                                alt={favorite.manga_title} 
                                className="h-24 w-16 rounded object-cover" 
                            />
                            <div>
                                <h2 className="font-semibold">{favorite.manga_title}</h2>
                                <p className="text-sm text-sky-100">Thêm vào lúc: {new Date(favorite.favorited_at).toLocaleDateString('vi-VN')}</p>
                                <Link 
                                    to={`/manga/${favorite.manga_slug}`} 
                                    className="mt-3 inline-block text-sm font-semibold text-yellow-300 hover:text-yellow-200"
                                >
                                    Xem truyện
                                </Link>
                            </div>
                        </div>
                        <div className="flex flex-col items-center justify-center gap-1 group">
                            <button 
                                onClick={() => handleRemove(favorite.manga_id, favorite.manga_title)}
                                className="text-red-400 hover:text-red-300 transition-colors duration-200"
                                title="Bỏ theo dõi"
                            >
                                <i className="fa-solid fa-trash-can text-2xl"></i>
                            </button>
                            <span className="text-[10px] uppercase font-bold text-sky-200 opacity-0 group-hover:opacity-100 transition-opacity">
                                Bỏ theo dõi
                            </span>
                        </div>
                    </div>
                ))}
            </div>
            <div className="h-px border-sky-800 w-full my-4 border-b-2"></div>
        </div>
    );
}

export default MyFavorites;
