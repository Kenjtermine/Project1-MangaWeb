const db = require('../config/db');

const generateSlug = (title) => {
  return title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
};

async function createManga(req, res, next) {
  try {
    // 1. Chỉ lấy chữ từ req.body (Xóa coverImage ở đây đi)
    const { title, author, summary, poster_id } = req.body;

    // 2. Lấy link ảnh Cloudinary từ req.file do Multer trả về
    const coverImageUrl = req.file ? req.file.path : '';

    if (!title || !author) {
      return res.status(400).json({ message: 'Title and Author are required' });
    }
    if (!poster_id) {
      return res.status(400).json({ message: 'Lỗi: Không tìm thấy ID người đăng truyện!' });
    }

    const slug = generateSlug(title);
    const status = 'ongoing'; 
    
    // 3. Đưa coverImageUrl vào mảng giá trị (chỗ $5)
    const insertResult = await db.query(
      `
        INSERT INTO manga (
          manga_title, manga_slug, manga_author, manga_summary, manga_cover_image, manga_status, poster_id
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7)
        RETURNING *
      `,
      [title, slug, author, summary || '', coverImageUrl, status, poster_id] 
    );

    const newManga = insertResult.rows[0];

    return res.status(201).json({ 
      message: 'Thêm truyện thành công!',
      manga: newManga 
    });

  } catch (error) {
    return next(error);
  }
}
// Hàm lấy danh sách truyện của một tác giả (uploader) cụ thể
async function getMyMangas(req, res, next) {
  try {
    // Nhận poster_id từ Frontend gửi lên
    const { poster_id } = req.query; 

    // Nếu không có ID thì báo lỗi luôn
    if (!poster_id) {
      return res.status(400).json({ message: 'Thiếu ID của người đăng truyện' });
    }

    // Câu lệnh SQL: Chỉ lấy truyện có poster_id trùng khớp
    const query = `
      SELECT * FROM manga 
      WHERE poster_id = $1 
      ORDER BY created_at DESC
    `;
    const result = await db.query(query, [poster_id]);

    return res.status(200).json({
      message: 'Lấy dữ liệu thành công',
      mangas: result.rows 
    });

  } catch (error) {
    console.error("Lỗi lấy danh sách truyện Studio:", error);
    return next(error);
  }
}

module.exports = {
  createManga,
  getMyMangas, // Nhớ export hàm này ra
};
