import React, { useState } from 'react';

const AddChapter = () => {
  const [formData, setFormData] = useState({ comicId: '', chapterNumber: '', chapterTitle: '' });
  const [images, setImages] = useState([]); 
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMultipleImagesChange = (e) => {
    const files = Array.from(e.target.files); 
    
    // NGOẠI LỆ 2: Kiểm tra định dạng ảnh (Chỉ nhận JPG, PNG)
    const invalidFiles = files.filter(file => !file.type.startsWith('image/'));
    
    if (invalidFiles.length > 0) {
      setError('Có tệp không phải là hình ảnh. Vui lòng chỉ chọn file JPG/PNG!');
      setImages([]);
      e.target.value = ''; // Reset input
    } else {
      setError('');
      setImages(files);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // NGOẠI LỆ 1: Bắt lỗi bỏ trống
    if (!formData.comicId || !formData.chapterNumber) {
      setError('Vui lòng chọn Truyện và nhập Số chương!');
      setSuccess('');
      return;
    }

    if (images.length === 0) {
      setError('Vui lòng tải lên ít nhất 1 trang truyện!');
      setSuccess('');
      return;
    }

    if (formData.chapterNumber === "1") {
      setError('Chương này đã tồn tại, vui lòng kiểm tra lại!');
      setSuccess('');
      return;
    }

    setError('');
    setSuccess('Đang tải ảnh lên hệ thống...');
    
    console.log("=== DỮ LIỆU ĐĂNG CHƯƠNG ===");
    console.log("Truyện ID:", formData.comicId);
    console.log("Chương số:", formData.chapterNumber, "- Tên:", formData.chapterTitle);
    console.log(`Đã đính kèm ${images.length} trang truyện.`);

    setTimeout(() => {
      setSuccess('Đăng chương thành công! (Dữ liệu đã in ra Console)');
    }, 1500);
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-lg mt-10">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Thêm Chương Mới</h2>
      
      {error && <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-6 rounded">{error}</div>}
      {success && <div className="bg-green-100 border-l-4 border-green-500 text-green-700 p-4 mb-6 rounded">{success}</div>}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Chọn Truyện <span className="text-red-500">*</span></label>
          <select name="comicId" onChange={handleInputChange} className="w-full border border-gray-300 p-2.5 rounded focus:outline-none focus:ring-2 focus:ring-blue-500">
            <option value="">-- Chọn bộ truyện --</option>
            {/* Tạm thời code cứng danh sách này, sau này sẽ dùng API gọi từ Database lên */}
            <option value="comic_001">Solo Leveling</option>
            <option value="comic_002">One Piece</option>
            <option value="comic_003">Demon Slayer</option>
          </select>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Số Chương <span className="text-red-500">*</span></label>
            <input type="number" name="chapterNumber" onChange={handleInputChange} className="w-full border border-gray-300 p-2.5 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="VD: 12" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tên Chương (Không bắt buộc)</label>
            <input type="text" name="chapterTitle" onChange={handleInputChange} className="w-full border border-gray-300 p-2.5 rounded focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="VD: Sự trỗi dậy" />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Tải lên các trang truyện <span className="text-red-500">*</span></label>
          {/* Thuộc tính 'multiple' cho phép quét chọn nhiều file cùng lúc */}
          <input type="file" multiple accept="image/png, image/jpeg" onChange={handleMultipleImagesChange} className="w-full border border-gray-300 p-4 rounded bg-gray-50 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-blue-700 hover:file:bg-blue-200 cursor-pointer" />
          <p className="mt-2 text-sm text-gray-500">
            Đã chọn: <span className="font-bold text-blue-600">{images.length}</span> trang truyện.
          </p>
        </div>

        <div className="flex justify-end space-x-4 pt-4 border-t">
          <button type="button" className="px-6 py-2 border border-gray-300 rounded text-gray-700 hover:bg-gray-50 font-medium">Lưu nháp</button>
          <button type="submit" className="px-6 py-2 bg-blue-600 rounded text-white hover:bg-blue-700 font-medium shadow-sm">Đăng chương</button>
        </div>
      </form>
    </div>
  );
};

export default AddChapter;