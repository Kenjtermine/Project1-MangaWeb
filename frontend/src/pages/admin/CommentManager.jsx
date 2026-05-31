import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { adminDeleteComment, adminGetComments } from "../../data/api";

const CommentManager = () => {
  const [comments, setComments] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");

  const loadComments = async (keyword = search) => {
    setLoading(true);
    const res = await adminGetComments({ search: keyword, limit: 100 });
    if (res.ok) setComments(res.comments);
    else setMessage(res.message || "Không tải được bình luận");
    setLoading(false);
  };

  useEffect(() => {
    loadComments();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    loadComments(search);
  };

  const handleDelete = async (commentId) => {
    if (!window.confirm("Xóa bình luận này?")) return;
    const res = await adminDeleteComment(commentId);
    if (res.ok) {
      setMessage("Đã xóa bình luận.");
      loadComments();
    } else {
      setMessage(res.message);
    }
  };

  return (
    <div className="bg-white min-h-full p-6 rounded-lg">
      <h1 className="text-2xl font-bold text-gray-800 mb-4">Quản lý bình luận</h1>

      <form onSubmit={handleSearch} className="flex gap-2 mb-4">
        <input
          className="flex-1 border border-gray-300 rounded px-3 py-2 text-sm"
          placeholder="Tìm theo nội dung, user, tên truyện..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <button type="submit" className="px-4 py-2 bg-sky-600 text-white rounded text-sm">
          Tìm
        </button>
      </form>

      {message && <p className="mb-4 text-sm text-gray-700">{message}</p>}

      {loading ? (
        <p className="text-gray-500">Đang tải...</p>
      ) : comments.length === 0 ? (
        <p className="text-gray-500">Không có bình luận.</p>
      ) : (
        <div className="space-y-3">
          {comments.map((comment) => (
            <div
              key={comment.comment_id}
              className="border border-gray-200 rounded-lg p-4 flex flex-col sm:flex-row sm:justify-between gap-3"
            >
              <div className="flex-1 min-w-0">
                <p className="text-sm text-gray-800 break-words">{comment.content}</p>
                <p className="text-xs text-gray-500 mt-2">
                  <span className="font-medium">{comment.user_name || "Ẩn danh"}</span>
                  {" · "}
                  {comment.manga_title ? (
                    <>
                      {comment.manga_title} — Chap {comment.chapter_number}
                      {comment.manga_id && comment.chapter_id && (
                        <>
                          {" · "}
                          <Link
                            to={`/manga/${comment.manga_id}/chapter/${comment.chapter_id}`}
                            className="text-sky-600 hover:underline"
                          >
                            Xem
                          </Link>
                        </>
                      )}
                    </>
                  ) : (
                    `Chapter #${comment.chapter_id}`
                  )}
                  {" · "}
                  {new Date(comment.created_at).toLocaleString("vi-VN")}
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleDelete(comment.comment_id)}
                className="shrink-0 text-red-600 text-sm font-medium hover:underline self-start"
              >
                Xóa
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CommentManager;
