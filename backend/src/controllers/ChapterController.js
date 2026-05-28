// Chức năng chính của query chapter lâm làm nha




// View chapters feature
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

module.exports = {
    viewCountChapter
    // addChapter,
    // updateChapter,
    // deleteChapter,
    // getChaptersByMangaId,
    // getChapter,
};