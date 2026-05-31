import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminGetStats } from "../../data/api";

const AdminOverview = () => {
  const [stats, setStats] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    adminGetStats().then((res) => {
      if (res.ok) setStats(res.stats);
      else setError(res.message || "Không tải được thống kê");
    });
  }, []);

  const cards = [
    { label: "Người dùng", value: stats?.totalUsers, to: "/admin/users" },
    { label: "Thể loại", value: stats?.totalGenres, to: "/admin/genres" },
    { label: "Bình luận", value: stats?.totalComments, to: "/admin/comments" },
    { label: "Tài khoản bị khóa", value: stats?.bannedUsers, to: "/admin/users" },
  ];

  return (
    <div className="bg-white min-h-full p-6 rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-2">Tổng quan hệ thống</h1>
      <p className="text-gray-500 mb-6">Theo dõi nhanh dữ liệu MangaWeb</p>

      {error && <p className="text-red-600 mb-4">{error}</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            to={card.to}
            className="block rounded-lg border border-gray-200 p-5 hover:border-sky-500 hover:shadow-md transition"
          >
            <p className="text-sm text-gray-500">{card.label}</p>
            <p className="text-3xl font-bold text-gray-900 mt-2">
              {stats ? card.value ?? 0 : "—"}
            </p>
          </Link>
        ))}
      </div>

      <div className="mt-8 rounded-lg bg-sky-50 border border-sky-100 p-4 text-sm text-gray-700">
        <p className="font-semibold text-sky-800 mb-1">Gợi ý module mở rộng</p>
        <ul className="list-disc list-inside space-y-1">
          <li>Duyệt / gỡ chương truyện (Studio)</li>
          <li>Thông báo hệ thống (broadcast)</li>
          <li>Báo cáo vi phạm từ người dùng</li>
        </ul>
      </div>
    </div>
  );
};

export default AdminOverview;
