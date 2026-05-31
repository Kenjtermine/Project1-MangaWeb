const db = require('../config/db');

// Hàm hỗ trợ tạo đường dẫn thân thiện (slug)
const generateSlug = (title) => {
  return title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
};

function parseGenreIds(body) {
  const raw = body.genreIds;
  if (raw === undefined || raw === null || raw === '') return [];

  if (Array.isArray(raw)) {
    return raw.map(Number).filter((id) => Number.isInteger(id) && id > 0);
  }

  if (typeof raw === 'string') {
    try {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed.map(Number).filter((id) => Number.isInteger(id) && id > 0);
      }
    } catch {
      // fall through to comma-separated
    }
    return raw
      .split(',')
      .map((id) => Number(id.trim()))
      .filter((id) => Number.isInteger(id) && id > 0);
  }

  const single = Number(raw);
  return Number.isInteger(single) && single > 0 ? [single] : [];
}

// ==========================================
// PHẦN 1: CÁC HÀM CỦA HIẾU (QUẢN LÝ STUDIO)
// ==========================================
async function createManga(req, res, next) {
  try {
    const { title, author, summary, poster_id } = req.body;
    const coverImageUrl = req.file ? req.file.path : '';
    const genreIds = parseGenreIds(req.body);

    if (!title || !author) {
      return res.status(400).json({ message: 'Title and Author are required' });
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

    const newManga = insertResult.rows[0];

    if (genreIds.length > 0) {
      const values = genreIds
        .map((_, index) => `($1, $${index + 2})`)
        .join(', ');
      await db.query(
        `INSERT INTO manga_genres (manga_id, genre_id) VALUES ${values} ON CONFLICT DO NOTHING`,
        [newManga.manga_id, ...genreIds]
      );
    }

    return res.status(201).json({
      message: 'Thêm truyện thành công!',
      manga: newManga,
      genreIds,
    });
  } catch (error) {
    return next(error);
  }
}

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
      mangas: result.rows,
    });
  } catch (error) {
    return next(error);
  }
}

// ==========================================
// PHẦN 2: CÁC HÀM CỦA LÂM (TRANG CHỦ & ĐỌC TRUYỆN)
// ==========================================
async function getMangaList(req, res, next) {
  try {
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
      ORDER BY updated_at DESC, created_at DESC
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
// PHẦN 3: TÍNH NĂNG MỚI (LOG VIEW & BẢNG XẾP HẠNG)
// ==========================================
async function logView(req, res, next) {
  try {
    const manga_id = req.body.manga_id ? String(req.body.manga_id) : null;
    const chapter_id = req.body.chapter_id ? String(req.body.chapter_id) : null;

    if (!manga_id) {
      return res.status(400).json({ message: 'Thiếu thông tin manga_id' });
    }

    await db.query(
      `INSERT INTO manga_views (manga_id, chapter_id) VALUES ($1, $2)`,
      [manga_id, chapter_id]
    );

    await db.query(
      `UPDATE manga SET total_views = COALESCE(total_views, 0) + 1 WHERE manga_id = CAST($1 AS INTEGER)`,
      [manga_id]
    );

    return res.status(200).json({ message: 'Ghi nhận lượt xem thành công!' });
  } catch (error) {
    console.error("❌ Lỗi tại logView:", error);
    return next(error);
  }
}

async function getDashboardRankings(req, res, next) {
  try {
    const dailyQuery = `
      SELECT mv.manga_id, COUNT(*) as total_views, m.manga_title, m.manga_cover_image, m.manga_author, m.manga_summary
      FROM manga_views mv
      JOIN manga m ON m.manga_id = CAST(mv.manga_id AS INTEGER)
      WHERE mv.manga_id ~ '^[0-9]+$' 
        AND mv.created_at >= NOW() - INTERVAL '1 day'
      GROUP BY mv.manga_id, m.manga_id, m.manga_title, m.manga_cover_image, m.manga_author, m.manga_summary
      ORDER BY total_views DESC LIMIT 10
    `;

    const weeklyQuery = `
      SELECT mv.manga_id, COUNT(*) as total_views, m.manga_title, m.manga_cover_image, m.manga_author, m.manga_summary
      FROM manga_views mv
      JOIN manga m ON m.manga_id = CAST(mv.manga_id AS INTEGER)
      WHERE mv.manga_id ~ '^[0-9]+$' 
        AND mv.created_at >= NOW() - INTERVAL '7 days'
      GROUP BY mv.manga_id, m.manga_id, m.manga_title, m.manga_cover_image, m.manga_author, m.manga_summary
      ORDER BY total_views DESC LIMIT 10
    `;

    const monthlyQuery = `
      SELECT mv.manga_id, COUNT(*) as total_views, m.manga_title, m.manga_cover_image, m.manga_author, m.manga_summary
      FROM manga_views mv
      JOIN manga m ON m.manga_id = CAST(mv.manga_id AS INTEGER)
      WHERE mv.manga_id ~ '^[0-9]+$' 
        AND mv.created_at >= NOW() - INTERVAL '30 days'
      GROUP BY mv.manga_id, m.manga_id, m.manga_title, m.manga_cover_image, m.manga_author, m.manga_summary
      ORDER BY total_views DESC LIMIT 10
    `;

    const [dailyRes, weeklyRes, monthlyRes] = await Promise.all([
      db.query(dailyQuery).catch(() => ({ rows: [] })),
      db.query(weeklyQuery).catch(() => ({ rows: [] })),
      db.query(monthlyQuery).catch(() => ({ rows: [] }))
    ]);

    return res.status(200).json({
      message: 'Lấy dữ liệu bảng xếp hạng thành công!',
      rankings: {
        daily: dailyRes.rows || [],
        weekly: weeklyRes.rows || [],
        monthly: monthlyRes.rows || []
      }
    });
  } catch (error) {
    console.error("❌ Lỗi lấy dữ liệu BXH Dashboard:", error);
    return next(error);
  }
}

// ==========================================
// EXPORT TẤT CẢ RA NGOÀI (Chắc chắn đầy đủ)
// ==========================================
module.exports = {
  createManga,
  getMyMangas,
  getMangaList,
  getMangaBySlug,
  getMangaById,
  logView,
  getDashboardRankings
};