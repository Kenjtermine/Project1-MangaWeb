import { Link } from "react-router-dom";
import { getCurrentUser, getUserReadingHistory } from "../../data/api";

const MyHistory = () => {
    const user = getCurrentUser();
    const history = getUserReadingHistory();

    return (
        <div className="bg-sky-900 text-white flex flex-col px-8 py-8 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Lịch sử đọc truyện</h1>
            <div className="h-px border-sky-300 w-full my-4 border-b-2"></div>
            <div className="flex flex-col gap-4 min-h-[65vh]">
                {!user && <p className="text-center">Bạn cần đăng nhập để xem lịch sử đọc.</p>}
                {user && history.length === 0 && <p className="text-center">Lịch sử đọc truyện trống</p>}
                {history.map((trackedManga) => (
                    <div key={trackedManga.history_id} className="p-4 rounded bg-sky-700 transition flex gap-4">
                        <img src={trackedManga.manga.cover} alt={trackedManga.manga.title} className="h-24 w-16 rounded object-cover" />
                        <div className="flex-1">
                            <h2 className="font-semibold">{trackedManga.manga.title}</h2>
                            <p className="text-sm text-sky-100">
                                {trackedManga.chapter?.chapter_title || "Chương đang đọc"} - trang {trackedManga.page_number}
                            </p>
                            <div className="mt-3 h-2 overflow-hidden rounded bg-sky-950">
                                <div className="h-full bg-yellow-400" style={{ width: `${trackedManga.progress_percent}%` }} />
                            </div>
                            <div className="mt-2 flex justify-between text-xs text-sky-100">
                                <span>{trackedManga.progress_percent}%</span>
                                <span>{new Date(trackedManga.last_read_at).toLocaleString("vi-VN")}</span>
                            </div>
                            <Link to={`/search?keyword=${encodeURIComponent(trackedManga.manga.title)}`} className="mt-3 inline-block text-sm font-semibold text-yellow-300 hover:text-yellow-200">
                                Đọc tiếp
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
            <div className="h-px border-sky-800 w-full my-4 border-b-2"></div>
        </div>
    );
};

export default MyHistory;
