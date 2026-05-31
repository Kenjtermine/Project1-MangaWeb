const db = require('../config/db'); 

// Hàm tạo slug cho chương
const generateSlug = (title) => {
    return title ? title.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '') : '';
};

// ==========================================
// CÁC HÀM XỬ LÝ (CONTROLLERS)
// ==========================================

// 1. View chapters feature (Của bạn Lâm)
async function viewCountChapter(req, res) {
    const { chapterId } = req.params;
    try {
        const viewCount = await db.query(
            `UPDATE chapters SET view_count = view_count + 1 WHERE chapter_id = $1 RETURNING view_count`,
            [chapterId]
        );
        res.status(200).json(viewCount.rows[0]);
    } catch (error) {
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

// 2. Hàm Thêm chương mới & Lưu nhiều trang truyện cùng lúc
async function createChapter(req, res, next) {
    try {
        const { manga_id, chapter_number, chapter_title } = req.body;
        
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'Không tìm thấy trang truyện nào!' });
        }

        // Bước 1: Tạo slug cho chương
        const rawTitle = chapter_title ? chapter_title : `chapter-${chapter_number}-manga-${manga_id}`;
        const chapter_slug = generateSlug(rawTitle);

        // Bước 2: Lưu thẳng vào bảng chapters
        const insertChapterQuery = `
            INSERT INTO chapters (
                manga_id, 
                chapter_number, 
                chapter_title, 
                chapter_slug, 
                view_count, 
                published_at
            )
            VALUES ($1, $2, $3, $4, 0, NOW())
            RETURNING chapter_id
        `;
        const chapterResult = await db.query(insertChapterQuery, [
            manga_id, chapter_number, chapter_title || '', chapter_slug
        ]);
        
        const newChapterId = chapterResult.rows[0].chapter_id;

        // Bước 3: Vòng lặp lưu từng link ảnh vào bảng pages
        for (let i = 0; i < req.files.length; i++) {
            const pageUrl = req.files[i].path; 
            const pageNumber = i + 1; 

            const insertPageQuery = `
                INSERT INTO pages (chapter_id, image_url, page_number)
                VALUES ($1, $2, $3)
            `;
            await db.query(insertPageQuery, [newChapterId, pageUrl, pageNumber]);
        }

        return res.status(201).json({ 
            message: 'Đăng chương và lưu ảnh thành công rực rỡ!',
            chapter_id: newChapterId
        });

    } catch (error) {
        console.error("Lỗi lưu chương truyện:", error);
        return res.status(500).json({ message: 'Lỗi server khi lưu truyện', error: error.message });
    }
}

// ==========================================
// EXPORT CÁC HÀM RA NGOÀI
// ==========================================
module.exports = {
    viewCountChapter,
    createChapter
};