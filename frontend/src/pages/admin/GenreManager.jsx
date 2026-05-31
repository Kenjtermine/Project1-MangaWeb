import { useEffect, useState } from "react";
import {
  adminCreateGenre,
  adminDeleteGenre,
  adminGetGenres,
  adminUpdateGenre,
} from "../../data/api";

const emptyForm = { name: "", description: "" };

const GenreManager = () => {
  const [genres, setGenres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const loadGenres = async () => {
    setLoading(true);
    const res = await adminGetGenres();
    if (res.ok) setGenres(res.genres);
    else setMessage(res.message || "Không tải được thể loại");
    setLoading(false);
  };

  useEffect(() => {
    loadGenres();
  }, []);

  const resetForm = () => {
    setForm(emptyForm);
    setEditingId(null);
    setShowForm(false);
  };

  const startEdit = (genre) => {
    setEditingId(genre.id);
    setForm({ name: genre.name, description: genre.description || "" });
    setShowForm(true);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) {
      setMessage("Vui lòng nhập tên thể loại.");
      return;
    }

    setMessage("");
    const payload = { name: form.name.trim(), description: form.description.trim() };
    const res = editingId
      ? await adminUpdateGenre(editingId, payload)
      : await adminCreateGenre(payload);

    if (res.ok) {
      setMessage(editingId ? "Cập nhật thể loại thành công." : "Thêm thể loại thành công.");
      resetForm();
      loadGenres();
    } else {
      setMessage(res.message);
    }
  };

  const handleDelete = async (genre) => {
    if (!window.confirm(`Xóa thể loại "${genre.name}"?`)) return;
    const res = await adminDeleteGenre(genre.id);
    if (res.ok) {
      setMessage("Đã xóa thể loại.");
      loadGenres();
    } else {
      setMessage(res.message);
    }
  };

  return (
    <div className="bg-white min-h-full p-6 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý thể loại</h1>
        <button
          type="button"
          onClick={() => {
            resetForm();
            setShowForm(true);
          }}
          className="px-4 py-2 bg-sky-600 text-white rounded hover:bg-sky-700 text-sm"
        >
          + Thêm thể loại
        </button>
      </div>

      {message && <p className="mb-4 text-sm text-gray-700">{message}</p>}

      {showForm && (
        <form onSubmit={handleSubmit} className="mb-8 p-4 border border-gray-200 rounded-lg space-y-3">
          <h2 className="font-semibold">{editingId ? "Sửa thể loại" : "Thêm thể loại mới"}</h2>
          <input
            className="w-full border rounded px-3 py-2 text-sm"
            placeholder="Tên thể loại"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <textarea
            className="w-full border rounded px-3 py-2 text-sm"
            rows={2}
            placeholder="Mô tả (tuỳ chọn)"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <div className="flex gap-2">
            <button type="submit" className="px-4 py-2 bg-sky-600 text-white rounded text-sm">
              {editingId ? "Lưu" : "Tạo"}
            </button>
            <button type="button" onClick={resetForm} className="px-4 py-2 bg-gray-200 rounded text-sm">
              Hủy
            </button>
          </div>
        </form>
      )}

      {loading ? (
        <p className="text-gray-500">Đang tải...</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs uppercase text-gray-500">ID</th>
                <th className="px-4 py-3 text-left text-xs uppercase text-gray-500">Tên</th>
                <th className="px-4 py-3 text-left text-xs uppercase text-gray-500">Mô tả</th>
                <th className="px-4 py-3 text-right text-xs uppercase text-gray-500">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {genres.map((genre) => (
                <tr key={genre.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3 text-gray-500">{genre.id}</td>
                  <td className="px-4 py-3 font-medium">{genre.name}</td>
                  <td className="px-4 py-3 text-gray-600 max-w-md truncate">
                    {genre.description || "—"}
                  </td>
                  <td className="px-4 py-3 text-right space-x-3">
                    <button type="button" onClick={() => startEdit(genre)} className="text-sky-600">
                      Sửa
                    </button>
                    <button type="button" onClick={() => handleDelete(genre)} className="text-red-600">
                      Xóa
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default GenreManager;
