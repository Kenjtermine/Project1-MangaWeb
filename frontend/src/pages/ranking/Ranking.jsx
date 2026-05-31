import { Link } from "react-router-dom";
import { getRankingMangas } from "../../data/api";

const Ranking = () => {
  const ranking = getRankingMangas(10);

  return (
    <div className="min-h-screen bg-neutral-900 px-8 py-8 text-white">
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Bảng xếp hạng</h1>
      </div>

      <div className="space-y-4">
        {ranking.map((manga, index) => (
          <div key={manga.id} className="flex gap-4 rounded-lg border border-white/10 bg-neutral-800 p-4 shadow-lg">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded bg-sky-600 text-xl font-bold">
              {index + 1}
            </div>
            <img src={manga.cover} alt={manga.title} className="h-28 w-20 shrink-0 rounded object-cover" />
            <div className="min-w-0 flex-1">
              <h2 className="text-lg font-bold text-white">{manga.title}</h2>
              <p className="text-sm text-sky-200">{manga.author}</p>
              <p className="mt-2 line-clamp-2 text-sm text-gray-300">{manga.summary}</p>
              <div className="mt-3 flex flex-wrap gap-3 text-sm text-gray-300">
                <span>{manga.daily_views.toLocaleString("vi-VN")} lượt xem hôm nay</span>
                <span>{manga.total_views.toLocaleString("vi-VN")} tổng lượt xem</span>
                <span>{manga.avg_rating} ★</span>
              </div>
            </div>
            <Link
              to={`/search?keyword=${encodeURIComponent(manga.title)}`}
              className="self-center rounded bg-yellow-400 px-4 py-2 text-sm font-semibold text-neutral-950 hover:bg-yellow-300"
            >
              Xem
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Ranking;
