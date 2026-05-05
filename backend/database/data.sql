-- Data Population for MangaWeb Database
-- This file contains INSERT statements based on mockData.json
-- Run AFTER schema.sql to populate the database with sample data

-- =========================================================
-- USERS DATA
-- =========================================================
-- Note: Passwords should be hashed in production
INSERT INTO users (user_id, user_name, user_email, user_password, user_avatar, user_gender, user_role, is_banned, created_at, updated_at)
VALUES
  (1, 'Anh Kiet', 'kiet.bui2k5@hcmut.edu.vn', '123456', 'https://i.imgur.com/1n7f1bF.jpg', 'male', 'user', FALSE, '2026-04-01T08:00:00Z', '2026-04-01T08:00:00Z'),
  (2, 'Khang Le', 'le.khang@hcmut.edu.vn', '123456', 'https://i.imgur.com/2n7f1bF.jpg', 'male', 'user', FALSE, '2026-04-03T08:00:00Z', '2026-04-03T08:00:00Z'),
  (3, 'Lam Vu', 'vu.lam@hcmut.edu.vn', '123456', 'https://i.imgur.com/3n7f1bF.jpg', 'male', 'user', FALSE, '2026-04-05T08:00:00Z', '2026-04-05T08:00:00Z'),
  (83, 'Kenjtermine', 'kiet.bui2k5admin@hcmut.edu.vn', '123456', 'https://i.imgur.com/1n7f1bF.jpg', 'male', 'admin', FALSE, '2026-04-01T07:00:00Z', '2026-04-01T07:00:00Z');

-- =========================================================
-- GENRES DATA
-- =========================================================
INSERT INTO genres (genre_id, genre_name, genre_description)
VALUES
  (1, 'Shonen', 'Truyện hành động, phiêu lưu hướng đến độc giả trẻ.'),
  (2, 'Shoujo', 'Truyện cảm xúc, tình cảm và trưởng thành.'),
  (3, 'Romance', 'Tập trung vào tình yêu và các mối quan hệ.'),
  (4, 'Comedy', 'Nội dung hài hước, nhẹ nhàng, dễ đọc.'),
  (5, 'Tragedy', 'Câu chuyện nhiều biến cố và cảm xúc nặng.'),
  (6, 'Martial Arts', 'Võ thuật, tu luyện và các trận đấu kỹ năng.'),
  (7, 'Drama', 'Tập trung vào xung đột, lựa chọn và cảm xúc nhân vật.'),
  (8, 'Harem', 'Nhiều nhân vật xoay quanh một tuyến nhân vật chính.'),
  (9, 'Isekai', 'Chuyển sinh hoặc du hành sang thế giới khác.'),
  (10, 'Fantasy', 'Thế giới giả tưởng, phép thuật và sinh vật đặc biệt.'),
  (11, 'Sci-fi', 'Khoa học viễn tưởng, công nghệ và tương lai.'),
  (12, 'Slice of Life', 'Đời thường, học đường và nhịp sống nhẹ nhàng.');

-- =========================================================
-- MANGA DATA
-- =========================================================
INSERT INTO manga (manga_id, manga_title, manga_slug, manga_author, manga_summary, manga_cover_image, manga_status, publish_year, avg_rating, rating_count, total_views, created_at, updated_at)
VALUES
  (1, 'One Piece', 'one-piece', 'Eiichiro Oda', 'Hành trình cậu bé Monkey D. Luffy ra khơi tìm kho báu One Piece và trở thành Vua Hải Tặc.', 'https://d28hgpri8am2if.cloudfront.net/book_images/onix/cvr9781421541969/one-piece-vol-62-9781421541969_hr.jpg', 'ongoing', 1997, 4.9, 1920, 1250000, '2026-04-01T00:00:00Z', '2026-04-30T10:00:00Z'),
  (2, 'Naruto', 'naruto', 'Masashi Kishimoto', 'Cậu bé Naruto theo đuổi ước mơ trở thành Hokage và được mọi người công nhận.', 'https://i.pinimg.com/736x/25/17/10/251710a727922d9d91bab9e4105b188f.jpg', 'completed', 1999, 4.7, 1700, 980000, '2026-04-01T00:00:00Z', '2026-04-20T10:00:00Z'),
  (3, 'Attack on Titan', 'attack-on-titan', 'Hajime Isayama', 'Nhân loại chiến đấu để sinh tồn sau những bức tường khổng lồ.', 'https://images-na.ssl-images-amazon.com/images/S/compressed.photo.goodreads.com/books/1617069374i/57575433.jpg', 'completed', 2009, 4.8, 1340, 870000, '2026-04-01T00:00:00Z', '2026-04-18T10:00:00Z'),
  (4, 'Demon Slayer', 'demon-slayer', 'Koyoharu Gotouge', 'Tanjiro trở thành kiếm sĩ diệt quỷ để cứu em gái Nezuko.', 'https://i.pinimg.com/736x/91/f8/71/91f8712ea4835ebcd90c075219b5fa37.jpg', 'completed', 2016, 4.6, 1180, 760000, '2026-04-01T00:00:00Z', '2026-04-27T10:00:00Z'),
  (5, 'Horimiya', 'horimiya', 'HERO', 'Horimiya là một câu chuyện tình yêu nhẹ nhàng, hài hước và đầy cảm động giữa hai học sinh trung học, Kyouko Hori và Izumi Miyamura. Mặc dù Hori là một học sinh nổi bật, xinh đẹp và rất hòa đồng trong lớp, cô ấy lại giữ một cuộc sống hoàn toàn khác ở nhà: chăm sóc em trai và làm việc nhà. Miyamura, một cậu học sinh trầm tính và có vẻ ngoài ''xấu xí'', là người bạn ngồi cạnh Hori trong lớp. Mọi chuyện bắt đầu thay đổi khi họ tình cờ phát hiện ra những bí mật của nhau.', 'https://i.pinimg.com/originals/13/46/bf/1346bf37f0a2b9bc6fe4edcdc20a3d42.jpg', 'completed', 2011, 4.5, 820, 420000, '2026-04-01T00:00:00Z', '2026-04-12T10:00:00Z'),
  (6, 'Kaguya-sama: Love Is War', 'kaguya-sama-love-is-war', 'Aka Akasaka', 'Kaguya Shinomiya và Miyuki Shirogane cùng là thành viên của hội học sinh học viện Shuchi''in, được xem như là những thiên tài giữa các thiên tài. Thời gian bên nhau dần phát triển tình cảm họ dành cho nhau, nhưng lòng kiêu hãnh không cho phép họ là người thú nhận và ngỏ lời trước. Tình trường là chiến trường và trận chiến để khiến đối phương phải tỏ tình trước bắt đầu!', 'https://d28hgpri8am2if.cloudfront.net/book_images/onix/cvr9781974700301/kaguya-sama-love-is-war-vol-1-9781974700301_hr.jpg', 'completed', 2015, 4.7, 960, 530000, '2026-04-01T00:00:00Z', '2026-04-22T10:00:00Z'),
  (7, 'Solo Leveling', 'solo-leveling', 'Chugong', 'Sung Jinwoo xuất hiện với hình ảnh của một thợ săn hạng E luôn bị xem là gánh nặng trong mỗi lần vào cổng. Sau biến cố ở hầm ngục kép, cậu lại là người duy nhất nhìn thấy một hệ thống có thể giúp mình tăng cấp từng bước. Bản truyện tranh manhwa này vì thế tạo cảm giác rất mạnh từ sự chênh lệch giữa điểm xuất phát thấp nhất và tốc độ thay đổi quá nhanh của nhân vật chính. Phần mở đầu của Tôi Thăng Cấp Một Mình vừa căng thẳng, vừa gợi rõ cảm giác một trật tự quen thuộc đang bị phá vỡ.', 'https://m.media-amazon.com/images/I/81ZAC67DE1S._SL1500_.jpg', 'completed', 2018, 4.8, 1510, 920000, '2026-04-01T00:00:00Z', '2026-04-28T10:00:00Z'),
  (8, 'Blue Lock', 'blue-lock', 'Muneyuki Kaneshiro', 'Blue Lock là một bộ manga thể thao xoay quanh bóng đá với góc nhìn tuyệt đối cạnh tranh và cá nhân hóa, thay vì làm theo tinh thần đội nhóm truyền thống. Sau khi đội tuyển Nhật Bản thất bại thảm hại tại World Cup 2018, Liên đoàn Bóng đá Nhật Bản quyết định khởi động chương trình huấn luyện cực kỳ khắc nghiệt mang tên "Blue Lock" nhằm tìm ra tiền đạo xuất sắc nhất thế giới, người có thể dẫn dắt đội tuyển vươn tới chức vô địch thế giới.', 'https://static.animecorner.me/2022/11/weekly-shonen-magazine-blue-lock.jpg', 'ongoing', 2018, 4.4, 640, 390000, '2026-04-01T00:00:00Z', '2026-04-29T10:00:00Z'),
  (9, 'Frieren: Beyond Journey''s End', 'frieren-beyond-journeys-end', 'Kanehito Yamada', 'Tổ đội anh hùng đã đánh bại được quỷ vương và kết thúc cuộc hành trình của họ. Nhưng thế chưa phải là hết, cuộc đời của cô nàng pháp sư Elf này sẽ còn rất dài, hơn cả những người đồng đội cũ của cô, một cuộc phiêu lưu mới để cô trải qua nhiều cung bậc cảm xúc, cũng như là học hỏi thêm về con người.', 'https://animotaku.fr/wp-content/uploads/2022/09/Manga-frieren-tome-7.jpeg', 'ongoing', 2020, 4.9, 710, 360000, '2026-04-01T00:00:00Z', '2026-04-30T09:00:00Z'),
  (10, 'Dandadan', 'dandadan', 'Yukinobu Tatsu', 'Dan Da Dan là bộ manga của Yukinobu Tatsu. Tác phẩm xoay quanh Ayase Momo và Takakura Ken, hai học sinh có niềm tin hoàn toàn trái ngược về ma quỷ và người ngoài hành tinh. Một màn thách nhau tưởng rất trẻ con lại đẩy cả hai vào chuỗi sự cố không còn đường lùi. Bộ manga này không đứng yên ở một màu kinh dị hay hài hước, mà liên tục đổi nhịp giữa quái dị, bạo lực và rung động tuổi học trò. Vì thế, Vũ Trang Siêu Nhiên tạo ra cảm giác rất ồn, rất lạ và rất khó đoán ngay từ những chương đầu.', 'https://i.postimg.cc/zf1Kj4yG/dandadan.png', 'ongoing', 2021, 4.6, 590, 310000, '2026-04-01T00:00:00Z', '2026-04-29T08:00:00Z');

-- =========================================================
-- MANGA_GENRES (Many-to-Many)
-- =========================================================
INSERT INTO manga_genres (manga_id, genre_id)
VALUES
  -- One Piece: Shonen, Comedy, Fantasy
  (1, 1), (1, 4), (1, 10),
  -- Naruto: Shonen, Drama, Fantasy
  (2, 1), (2, 7), (2, 10),
  -- Attack on Titan: Shonen, Tragedy, Drama
  (3, 1), (3, 5), (3, 7),
  -- Demon Slayer: Shonen, Tragedy, Fantasy
  (4, 1), (4, 5), (4, 10),
  -- Horimiya: Shoujo, Romance, Slice of Life
  (5, 2), (5, 3), (5, 12),
  -- Kaguya-sama: Romance, Comedy, Slice of Life
  (6, 3), (6, 4), (6, 12),
  -- Solo Leveling: Shonen, Isekai, Fantasy
  (7, 1), (7, 9), (7, 10),
  -- Blue Lock: Shonen, Drama
  (8, 1), (8, 7),
  -- Frieren: Drama, Fantasy, Slice of Life
  (9, 7), (9, 10), (9, 12),
  -- Dandadan: Shonen, Comedy, Sci-fi
  (10, 1), (10, 4), (10, 11);

-- =========================================================
-- CHAPTERS DATA
-- =========================================================
INSERT INTO chapters (chapter_id, manga_id, chapter_number, chapter_title, chapter_slug, view_count, published_at, created_at, updated_at)
VALUES
  (1, 1, 1118, 'Tương lai mở ra', 'chapter-1118', 18400, '2026-04-30T10:00:00Z', '2026-04-30T10:00:00Z', '2026-04-30T10:00:00Z'),
  (2, 2, 700, 'Uzumaki Naruto', 'chapter-700', 13200, '2026-04-20T10:00:00Z', '2026-04-20T10:00:00Z', '2026-04-20T10:00:00Z'),
  (3, 3, 139, 'Hướng về cái cây', 'chapter-139', 11600, '2026-04-18T10:00:00Z', '2026-04-18T10:00:00Z', '2026-04-18T10:00:00Z'),
  (4, 7, 179, 'Trận chiến cuối', 'chapter-179', 16200, '2026-04-28T10:00:00Z', '2026-04-28T10:00:00Z', '2026-04-28T10:00:00Z'),
  (5, 9, 128, 'Ký ức mới', 'chapter-128', 8900, '2026-04-30T09:00:00Z', '2026-04-30T09:00:00Z', '2026-04-30T09:00:00Z');

-- =========================================================
-- RATINGS DATA
-- =========================================================
INSERT INTO ratings (user_id, manga_id, score, review_text, created_at, updated_at)
VALUES
  (1, 1, 5, 'Đọc lâu nhưng vẫn cuốn.', '2026-04-20T08:00:00Z', '2026-04-20T08:00:00Z'),
  (1, 7, 5, 'Cày rất đã.', '2026-04-21T08:00:00Z', '2026-04-21T08:00:00Z'),
  (2, 5, 4, 'Nhẹ nhàng.', '2026-04-22T08:00:00Z', '2026-04-22T08:00:00Z');

-- =========================================================
-- USER FAVORITES DATA
-- =========================================================
INSERT INTO user_favorites (user_id, manga_id, created_at)
VALUES
  (1, 1, '2026-04-25T10:00:00Z'),
  (1, 7, '2026-04-27T10:00:00Z'),
  (2, 5, '2026-04-22T10:00:00Z');

-- =========================================================
-- READING HISTORY DATA
-- =========================================================
INSERT INTO reading_history (history_id, user_id, manga_id, chapter_id, page_number, progress_percent, last_read_at, created_at)
VALUES
  (1, 1, 1, 1, 12, 46, '2026-04-30T12:30:00Z', '2026-04-30T12:30:00Z'),
  (2, 1, 7, 4, 25, 88, '2026-04-29T20:15:00Z', '2026-04-29T20:15:00Z'),
  (3, 1, 9, 5, 5, 20, '2026-04-28T21:45:00Z', '2026-04-28T21:45:00Z'),
  (4, 2, 5, 5, 14, 61, '2026-04-25T18:15:00Z', '2026-04-25T18:15:00Z');

-- =========================================================
-- COMMENTS DATA
-- =========================================================
INSERT INTO comments (comment_id, chapter_id, user_id, parent_comment_id, root_comment_id, content, like_count, dislike_count, is_deleted, created_at, updated_at)
VALUES
  (1, 1, 1, NULL, 1, 'Chap này hay thật, đoạn cuối để lại nhiều thứ để bàn.', 12, 0, FALSE, '2026-04-25T00:00:00Z', '2026-04-25T00:00:00Z'),
  (2, 1, 2, 1, 1, 'Mình cũng đang hóng chap mới, nhịp truyện đang rất ổn.', 6, 0, FALSE, '2026-04-25T01:00:00Z', '2026-04-25T01:00:00Z');

-- =========================================================
-- NOTIFICATIONS DATA
-- =========================================================
INSERT INTO notifications (notification_id, user_id, title, content, is_read, created_at)
VALUES
  (1, 1, 'One Piece đã có chap mới', 'Chap 1118 của One Piece đã được cập nhật. Đọc tiếp để không bỏ lỡ diễn biến mới.', FALSE, '2026-04-30T10:00:00Z'),
  (2, 1, 'Solo Leveling đang lọt top ngày', 'Bộ truyện bạn yêu thích đang đứng trong nhóm truyện được đọc nhiều nhất hôm nay.', FALSE, '2026-04-29T11:00:00Z'),
  (3, 1, 'MangaWeb bảo trì ngắn', 'Hệ thống sẽ bảo trì dữ liệu mock trong thời gian ngắn để kiểm thử tính năng mới.', TRUE, '2026-04-25T12:00:00Z'),
  (4, 2, 'Horimiya có bình luận mới', 'Có người vừa phản hồi trong bộ truyện bạn theo dõi.', FALSE, '2026-04-27T12:00:00Z');

-- =========================================================
-- MANGA DAILY VIEWS DATA
-- =========================================================
INSERT INTO manga_daily_views (view_date, manga_id, view_count)
VALUES
  ('2026-04-30', 1, 18400),
  ('2026-04-30', 7, 16200),
  ('2026-04-30', 2, 13200),
  ('2026-04-30', 3, 11600),
  ('2026-04-30', 9, 8900),
  ('2026-04-30', 6, 7600),
  ('2026-04-30', 10, 6900);

-- =========================================================
-- RESET IDENTITY SEQUENCES
-- =========================================================
-- (Optional: ensure next inserts start at appropriate ID values)
SELECT setval('users_user_id_seq', 84);
SELECT setval('genres_genre_id_seq', 13);
SELECT setval('manga_manga_id_seq', 11);
SELECT setval('chapters_chapter_id_seq', 6);
SELECT setval('comments_comment_id_seq', 3);
SELECT setval('notifications_notification_id_seq', 5);
SELECT setval('reading_history_history_id_seq', 5);