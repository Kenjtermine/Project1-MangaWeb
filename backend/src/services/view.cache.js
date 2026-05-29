// 1. Tạo một Map() để làm bộ nhớ đệm (RAM)
// Cấu trúc: { manga_id_1: 50, manga_id_2: 120 }
const viewCache = new Map();

// 2. Hàm này để Frontend gọi vào (Chạy cực nhanh vì chỉ +1 trên RAM)
const incrementView = (mangaId) => {
    if (viewCache.has(mangaId)) {
        viewCache.set(mangaId, viewCache.get(mangaId) + 1);
    } else {
        viewCache.set(mangaId, 1);
    }
};

const flushViewsToDB = async (db) => {
    if (viewCache.size === 0) return; // Không có ai xem thì thôi

    const viewsToUpdate = new Map(viewCache);
    viewCache.clear();

    console.log(`Đang lưu view cho ${viewsToUpdate.size} bộ truyện xuống DB...`);

    try {
        for (const [mangaId, views] of viewsToUpdate.entries()) {
            await db.query(
                `UPDATE manga SET total_views = total_views + $1 WHERE manga_id = $2`,
                [views, mangaId]
            );
        }
        console.log('Lưu view thành công!');
    } catch (error) {
        console.error('Lỗi khi lưu view ngầm:', error);
        for (const [mangaId, views] of viewsToUpdate.entries()) {
            incrementView(mangaId); 
        }
    }
};

// Thiết lập vòng lặp cứ 5 phút (300,000 ms) chạy hàm flush 1 lần
const startViewCronJob = (db) => {
    setInterval(() => {
        flushViewsToDB(db);
    }, 300000); 
};

module.exports = {
    incrementView,
    startViewCronJob
};