import { Link } from "react-router-dom";
import { getUserFavorites, getUserLogin } from "../../data/api";

const MyFavorites = () => {
    const user = getUserLogin();
    const favorites = getUserFavorites();

    return (
        <div className="bg-sky-900 text-white flex flex-col px-8 py-8 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Danh sách truyện yêu thích</h1>
            <div className="h-px border-sky-300 w-full my-4 border-b-2"></div>
            <div className="flex flex-col gap-4 min-h-[65vh]">
                {!user && <p className="text-center">Bạn cần đăng nhập để xem danh sách yêu thích.</p>}
                {user && favorites.length === 0 && <p className="text-center">Bạn chưa có bộ truyện yêu thích</p>}
                {favorites.map((favorite) => (
                    <div key={favorite.manga_id} className="p-4 rounded bg-sky-700 transition flex gap-4">
                        <img src={favorite.manga.cover} alt={favorite.manga.title} className="h-24 w-16 rounded object-cover" />
                        <div>
                            <h2 className="font-semibold">{favorite.manga.title}</h2>
                            <p className="text-sm text-sky-100">{favorite.manga.author}</p>
                            <p className="mt-2 text-sm text-sky-100 line-clamp-2">{favorite.manga.summary}</p>
                            <Link to={`/search?keyword=${encodeURIComponent(favorite.manga.title)}`} className="mt-3 inline-block text-sm font-semibold text-yellow-300 hover:text-yellow-200">
                                Xem truyện
                            </Link>
                        </div>
                    </div>
                ))}
            </div>
            <div className="h-px border-sky-800 w-full my-4 border-b-2"></div>
        </div>
    );
}

export default MyFavorites;
