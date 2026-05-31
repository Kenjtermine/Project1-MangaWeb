import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { createNewManga, getCurrentUser, getGenres } from "../../data/api";

const AddComic = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ title: "", author: "", description: "" });
  const [genresList, setGenresList] = useState([]);
  const [selectedGenreIds, setSelectedGenreIds] = useState([]);
  const [coverImage, setCoverImage] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loadingGenres, setLoadingGenres] = useState(true);

  useEffect(() => {
    getGenres().then((genres) => {
      setGenresList(genres);
      setLoadingGenres(false);
    });
  }, []);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const toggleGenre = (genreId) => {
    setSelectedGenreIds((prev) =>
      prev.includes(genreId) ? prev.filter((id) => id !== genreId) : [...prev, genreId]
    );
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError("Ảnh bìa vượt quá dung lượng 2MB. Vui lòng chọn ảnh khác!");
        setCoverImage(null);
        e.target.value = "";
      } else {
        setError("");
        setCoverImage(file);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const user = getCurrentUser();

    if (!formData.title || !formData.author) {
      setError("Vui lòng nhập đầy đủ Tên truyện và Tác giả!");
      setSuccess("");
      return;
    }

    if (!user?.user_id) {
      setError("Lỗi: Không tìm thấy thông tin tài khoản. Vui lòng đăng nhập lại!");
      setSuccess("");
      return;
    }

    setError("");
    setSuccess("Đang tải ảnh lên Cloudinary và lưu dữ liệu...");

    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("author", formData.author);
    payload.append("summary", formData.description);
    payload.append("genreIds", JSON.stringify(selectedGenreIds));

    if (coverImage) {
      payload.append("coverImage", coverImage);
    }

    const res = await createNewManga(payload);

    if (res.ok) {
      setSuccess("Thêm truyện thành công! Mời bạn quay lại Studio để kiểm tra.");
      setFormData({ title: "", author: "", description: "" });
      setSelectedGenreIds([]);
      setCoverImage(null);
    } else {
      setError(res.message || "Lưu truyện thất bại, vui lòng thử lại.");
      setSuccess("");
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Thêm truyện mới</h2>

      {error && (
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">{error}</div>
      )}
      {success && (
        <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded">{success}</div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tên truyện <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2.5 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="VD: Solo Leveling"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tác giả <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="author"
              value={formData.author}
              onChange={handleInputChange}
              className="w-full border border-gray-300 p-2.5 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Nhập tên tác giả"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Thể loại <span className="text-gray-400 font-normal">(chọn một hoặc nhiều)</span>
          </label>
          {loadingGenres ? (
            <p className="text-sm text-gray-500">Đang tải thể loại...</p>
          ) : genresList.length === 0 ? (
            <p className="text-sm text-gray-500">Chưa có thể loại. Admin cần thêm tại /admin/genres.</p>
          ) : (
            <ul className="flex flex-wrap gap-2">
              {genresList.map((genre) => (
                <li key={genre.id}>
                  <button
                    type="button"
                    onClick={() => toggleGenre(genre.id)}
                    className={`px-3 py-1.5 text-sm rounded-full border transition select-none
                      ${
                        selectedGenreIds.includes(genre.id)
                          ? "bg-sky-600 border-sky-600 text-white"
                          : "bg-white border-gray-300 text-gray-700 hover:border-sky-400"
                      }`}
                  >
                    {genre.name}
                  </button>
                </li>
              ))}
            </ul>
          )}
          {selectedGenreIds.length > 0 && (
            <p className="mt-2 text-xs text-gray-500">
              Đã chọn {selectedGenreIds.length} thể loại
            </p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Mô tả truyện</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            rows="4"
            className="w-full border border-gray-300 p-2.5 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Nhập tóm tắt nội dung truyện..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Ảnh bìa (Tối đa 2MB)</label>
          <input
            type="file"
            accept="image/png, image/jpeg, image/webp"
            onChange={handleImageChange}
            className="w-full border border-gray-300 p-2 rounded text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <div className="flex justify-end space-x-4 pt-4 border-t">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="px-6 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 font-medium"
          >
            Hủy bỏ
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-blue-600 rounded text-white hover:bg-blue-700 font-medium shadow-sm"
          >
            Lưu truyện
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddComic;
