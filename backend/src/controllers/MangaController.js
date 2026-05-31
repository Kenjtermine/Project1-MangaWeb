const db = require('../config/db');

// Hàm hỗ trợ tạo đường dẫn thân thiện (slug)
const generateSlug = (title) => {
  return title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
};

// ==========================================
// PHẦN 1: CÁC HÀM CỦA HIẾU (QUẢN LÝ STUDIO)
// ==========================================

// Hàm đăng truyện mới
async function createManga(req, res, next) {
  try {
    const { title, author, summary, poster_id } = req.body;
    const coverImageUrl = req.file ? req.file.path : '';

    if (!title || !author) {
      return res.status(400).json({ message: 'Title and Author are required' });
    }
    if (!poster_id) {
      return res.status(400).json({ message: 'Lỗi: Không tìm thấy ID người đăng truyện!' });
    }

    const slug = generateSlug(title);
    const status = 'ongoing'; 
    
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

    return res.status(201).json({ 
      message: 'Thêm truyện thành công!',
      manga: insertResult.rows[0] 
    });

  } catch (error) {
    return next(error);
  }
}

// Hàm lấy danh sách truyện của một tác giả cụ thể (Dùng trong Studio)
async function getMyMangas(req, res, next) {
  try {
    const { poster_id } = req.query; 

    if (!poster_id) {
      return res.status(400).json({ message: 'Thiếu ID của người đăng truyện' });
    }

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

// ==========================================
// PHẦN 2: CÁC HÀM CỦA LÂM (TRANG CHỦ & ĐỌC TRUYỆN)
// ==========================================

// Hàm lấy toàn bộ danh sách truyện (Trang chủ, Tìm kiếm, Phân trang)
async function getMangaList(req, res, next) {
  try {
    // Nhận các tham số tìm kiếm từ Frontend
    const { keyword, page = 1, limit = 20 } = req.query;
    const offset = (page - 1) * limit;
    
    let queryParams = [];
    let conditions = ["manga_status IN ('ongoing', 'completed')"];  
    if (keyword) {
      queryParams.push(`%${keyword}%`);
      conditions.push(`manga_title ILIKE $${queryParams.length}`);
    }

    let whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

    const query = `
      SELECT * FROM manga
      ${whereClause}
      ORDER BY created_at DESC
      LIMIT $${queryParams.length + 1} OFFSET $${queryParams.length + 2}
    `;
    
    queryParams.push(limit, offset);
    const result = await db.query(query, queryParams);

    return res.status(200).json({
      message: 'Lấy danh sách truyện thành công',
      data: result.rows
    });
  } catch (error) {
    console.error("Lỗi getMangaList:", error);
    return next(error);
  }
}

// Hàm lấy thông tin chi tiết 1 bộ truyện bằng Slug (Trang chi tiết truyện)
async function getMangaBySlug(req, res, next) {
  try {
    const { slug } = req.params;
    const query = `
      SELECT * FROM manga 
      WHERE manga_slug = $1 AND manga_status IN ('ongoing', 'completed')
    `;
    const result = await db.query(query, [slug]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy truyện' });
    }
    
    return res.status(200).json({
      message: 'Lấy thông tin truyện thành công',
      data: result.rows[0]
    });
  } catch (error) {
    console.error("Lỗi getMangaBySlug:", error);
    return next(error);
  }
}

// Hàm lấy thông tin chi tiết 1 bộ truyện bằng ID
async function getMangaById(req, res, next) {
  try {
    const { id } = req.params;
    const query = `
      SELECT * FROM manga 
      WHERE manga_id = $1 AND manga_status IN ('completed', 'ongoing')
    `;
    const result = await db.query(query, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy truyện' });
    }
    
    return res.status(200).json({
      message: 'Lấy thông tin truyện thành công',
      data: result.rows[0]
    });
  } catch (error) {
    console.error("Lỗi getMangaById:", error);
    return next(error);
  }
}

// ==========================================
// EXPORT TẤT CẢ RA NGOÀI
// ==========================================
module.exports = {
  createManga,
  getMyMangas,
  getMangaList,
  getMangaBySlug,
  getMangaById
};