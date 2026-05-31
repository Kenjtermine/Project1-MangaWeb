const BASE_URL = "http://localhost:5000"; // Thay bằng URL Backend thực tế của bro nếu có

const request = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, options);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  } catch (error) {
    // Ép lỗi văng ra ngoài để block catch của các hàm con bắt được và chuyển sang Mock Data
    throw error; 
  }
};
export const getMangaById = async (mangaId) => {
  try {
    const data = await request(`/api/mangas/${mangaId}`, { method: "GET" });
    if (data && data.manga) return data.manga;
  } catch (error) {
    console.warn("⚠️ Không lấy được Manga từ DB, đang dùng Mock Data...", error.message);
  }
  
  // Fallback Mock Data
  return mockData.allMangas.find((manga) => manga.id === Number(mangaId) || manga.manga_id === Number(mangaId)) || null;
};

export const getChapterById = async (chapterId) => {
  try {
    const data = await request(`/api/mangas/chapters/${chapterId}`, { method: "GET" });
    if (data && data.chapter) return data.chapter;
  } catch (error) {
    console.warn("⚠️ Không lấy được Chapter từ DB, đang dùng Mock Data...", error.message);
  }
  
  // Fallback Mock Data
  const realChapter = mockData.chapters.find((chapter) => chapter.chapter_id === Number(chapterId));
  if (realChapter) return realChapter;

  return mockData.allMangas
    .flatMap((manga) => createMockChapters(manga)) // Giả định bro vẫn giữ hàm createMockChapters cũ
    .find((chapter) => chapter.chapter_id === Number(chapterId)) || null;
};

export const getChaptersByMangaId = async (mangaId) => {
  try {
    const data = await request(`/api/mangas/${mangaId}/chapters`, { method: "GET" });
    if (data && data.chapters && data.chapters.length > 0) {
      return data.chapters.sort((a, b) => Number(b.chapter_number) - Number(a.chapter_number));
    }
  } catch (error) {
    console.warn("⚠️ Không lấy được danh sách Chapter từ DB, đang dùng Mock Data...", error.message);
  }

  // Fallback Mock Data
  const manga = mockData.allMangas.find((manga) => manga.id === Number(mangaId) || manga.manga_id === Number(mangaId));
  if (!manga) return [];

  const existingChapters = mockData.chapters.filter((chapter) => chapter.manga_id === Number(mangaId));
  return existingChapters.sort((a, b) => Number(b.chapter_number) - Number(a.chapter_number));
};

export const getReaderPages = async (mangaId, chapterId) => {
  try {
    const data = await request(`/api/mangas/chapters/${chapterId}/pages`, { method: "GET" });
    if (data && data.pages && data.pages.length > 0) {
      return data.pages.sort((a, b) => a.page_number - b.page_number);
    }
  } catch (error) {
    console.warn("⚠️ Không lấy được số trang từ DB, đang dùng Mock Data...", error.message);
  }

  // Fallback Mock Data 
  const manga = mockData.allMangas.find((m) => m.id === Number(mangaId) || m.manga_id === Number(mangaId));
  const chapter = mockData.chapters.find((c) => c.chapter_id === Number(chapterId));
  
  if (!manga || !chapter) return [];

  return Array.from({ length: 6 }, (_, index) => ({
    page_number: index + 1,
    image_url: `https://picsum.photos/seed/${manga.slug}-${chapter.chapter_number}-${index + 1}/900/1300`,
  }));
};

export const isFavoriteManga = async (mangaId, userId = null) => {
  try {
    // Nếu có Backend và User đang đăng nhập thì gọi DB
    if (userId) {
      const data = await request(`/api/favorites/check?mangaId=${mangaId}&userId=${userId}`, { method: "GET" });
      if (data && typeof data.isFavorite !== 'undefined') {
        return data.isFavorite;
      }
    }
  } catch (error) {
    console.warn("⚠️ Lỗi API check yêu thích, đang dùng LocalStorage...", error.message);
  }

  // Fallback Mock Data
  const favorites = JSON.parse(localStorage.getItem("mock_favorites") || "[]");
  return favorites.includes(Number(mangaId));
};
export const toggleFavoriteManga = async (mangaId, userId = null) => {
  try {
    // Nếu có User đang đăng nhập thì gọi API lưu vào Database
    if (userId) {
      const data = await request(`/api/favorites/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ mangaId, userId })
      });
      
      // Giả sử API trả về { isFavorite: true/false }
      if (data && typeof data.isFavorite !== 'undefined') {
        return data.isFavorite; 
      }
    }
  } catch (error) {
    console.warn("⚠️ Lỗi API Toggle Favorite, chuyển sang dùng LocalStorage...", error.message);
  }

  // Fallback Mock Data: Xử lý bằng LocalStorage nếu không có API
  let favorites = JSON.parse(localStorage.getItem("mock_favorites") || "[]");
  const numId = Number(mangaId);
  const index = favorites.indexOf(numId);
  let isNowFavorite = false;

  if (index > -1) {
    // Nếu đã có trong mảng -> Xóa đi (Bỏ yêu thích)
    favorites.splice(index, 1);
    isNowFavorite = false;
  } else {
    // Nếu chưa có -> Thêm vào (Đã yêu thích)
    favorites.push(numId);
    isNowFavorite = true;
  }

  // Lưu lại mảng mới vào LocalStorage
  localStorage.setItem("mock_favorites", JSON.stringify(favorites));
  
  // Trả về trạng thái hiện tại để Frontend cập nhật UI
  return isNowFavorite;
};
// Thêm hàm này vào DƯỚI CÙNG file api.js nhé
export const getGenres = () => {
  // Nếu có mockData thì lấy luôn từ mockData cho an toàn
  if (typeof mockData !== 'undefined' && mockData.genres) {
    return mockData.genres;
  }

  // Fallback cứng đề phòng trường hợp mockData không có mảng genres
  return [
    { id: 1, name: "Action" },
    { id: 2, name: "Adventure" },
    { id: 3, name: "Comedy" },
    { id: 4, name: "Drama" },
    { id: 5, name: "Fantasy" },
    { id: 6, name: "Romance" },
    { id: 7, name: "Slice of Life" },
    { id: 8, name: "Sci-Fi" },
    { id: 9, name: "Horror" },
    { id: 10, name: "Mystery" }
  ];
};
export const getAllMangas = async () => {
  try {
    const data = await request(`/api/mangas`, { method: "GET" });
    
    // Tùy theo cách Backend của bro trả về dữ liệu (có thể nằm trong biến mangas hoặc là mảng trực tiếp)
    if (data && data.mangas) return data.mangas;
    if (Array.isArray(data)) return data;
    
  } catch (error) {
    console.warn("⚠️ Không lấy được danh sách truyện từ DB, đang dùng Mock Data...", error.message);
  }

  // Fallback Mock Data
  if (typeof mockData !== 'undefined' && mockData.allMangas) {
    return mockData.allMangas;
  }
  
  return []; // Trả về mảng rỗng nếu không có gì để chống crash trang
};
export const loginUser = async (credentials) => {
  try {
    const data = await request(`/api/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials), // chứa email/username và password
    });

    if (data && data.user) {
      // Lưu token vào localStorage nếu backend trả về token auth
      if (data.token) localStorage.setItem("token", data.token);
      return { success: true, user: data.user };
    }
  } catch (error) {
    console.warn("⚠️ API Đăng nhập lỗi hoặc Backend sập, đang kiểm tra bằng Mock Tài Khoản...", error.message);
  }

  // Fallback Mock Data: Tạo sẵn 1 tài khoản để bro test khi chưa có DB
  const mockAdminEmail = "admin@gmail.com";
  const mockAdminPassword = "admin"; // Hoặc mật khẩu tùy bro chọn để test

  if (credentials.email === mockAdminEmail && credentials.password === mockAdminPassword) {
    const mockUser = {
      id: 999,
      username: "Admin Đẹp Trai",
      email: mockAdminEmail,
      role: "admin",
      avatar: "https://picsum.photos/200"
    };
    
    // Giả lập lưu token giả để qua cổng bảo mật Frontend
    localStorage.setItem("token", "mock-jwt-token-xyz");
    return { success: true, user: mockUser };
  }

  // Nếu sai tài khoản mock luôn thì trả về thất bại
  return { success: false, message: "Sai tài khoản hoặc mật khẩu (Tài khoản test: admin@gmail.com / admin)" };
};
export const registerUser = async (userData) => {
  try {
    const data = await request(`/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData), // chứa username, email, password...
    });

    if (data && data.success) {
      return { success: true, message: "Đăng ký tài khoản thành công!" };
    }
  } catch (error) {
    console.warn("⚠️ API Đăng ký lỗi hoặc Backend sập, đang chạy chế độ Mock...", error.message);
  }

  // Fallback Mock Data: Giả lập đăng ký thành công luôn để Frontend không bị kẹt
  return { 
    success: true, 
    message: "Đăng ký thành công (Chế độ Mock Data)!", 
    user: { id: Date.now(), username: userData.username, email: userData.email } 
  };
};
export const getCurrentUser = async () => {
  const token = localStorage.getItem("token");
  
  // Nếu không có cả token auth lẫn token mock thì coi như chưa đăng nhập
  if (!token) return null;

  try {
    // Nếu có Backend thì gửi Token lên verify
    const data = await request(`/api/auth/me`, {
      method: "GET",
      headers: { 
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
    });

    if (data && data.user) return data.user;
  } catch (error) {
    console.warn("⚠️ API Lấy thông tin user lỗi, đang check chế độ Mock...", error.message);
  }

  // Fallback Mock Data: Nếu đang dùng token giả của tài khoản admin test
  if (token === "mock-jwt-token-xyz") {
    return {
      id: 999,
      username: "Admin Đẹp Trai",
      email: "admin@gmail.com",
      role: "admin",
      avatar: "https://picsum.photos/200"
    };
  }

  return null;
};
export const logoutUser = async () => {
  try {
    const token = localStorage.getItem("token");
    if (token && token !== "mock-jwt-token-xyz") {
      // Nếu là token thật thì báo cho Backend biết để hủy session/blacklist token
      await request(`/api/auth/logout`, {
        method: "POST",
        headers: { "Authorization": `Bearer ${token}` }
      });
    }
  } catch (error) {
    console.warn("⚠️ Không gọi được API Logout của Backend, tiến hành xóa LocalStorage ở Frontend...", error.message);
  } finally {
    // Luôn luôn xóa sạch token ở Frontend dù Backend có phản hồi hay không
    localStorage.removeItem("token");
    localStorage.removeItem("mock_favorites"); // Xóa luôn đống favorite mock nếu muốn sạch sẽ
  }

  return { success: true, message: "Đã đăng xuất!" };
};
export const getUnreadNotificationCount = async (userId = null) => {
  try {
    // Nếu có User đang đăng nhập thì gọi API của Backend
    if (userId) {
      const data = await request(`/api/notifications/unread-count?userId=${userId}`, { method: "GET" });
      if (data && typeof data.count !== 'undefined') {
        return data.count;
      }
    }
  } catch (error) {
    console.warn("⚠️ Không lấy được số thông báo từ DB, đang dùng Chế độ Mock...", error.message);
  }

  // Fallback Mock Data: Trả về số thông báo giả lập để bro test UI cái chuông
  // Nếu có token (đã đăng nhập) thì cho hiện 3 thông báo cho đẹp, chưa đăng nhập thì trả về 0
  const token = localStorage.getItem("token");
  return token ? 3 : 0;
};
export const getUserNotifications = async (userId = null) => {
  try {
    if (userId) {
      const data = await request(`/api/notifications?userId=${userId}`, { method: "GET" });
      if (data && data.notifications) return data.notifications;
      if (Array.isArray(data)) return data;
    }
  } catch (error) {
    console.warn("⚠️ Không lấy được danh sách thông báo từ DB, đang dùng Mock Data...", error.message);
  }

  // Fallback Mock Data: Trả về vài thông báo mẫu để UI của bro trông xịn xò luôn
  const token = localStorage.getItem("token");
  if (!token) return []; // Chưa đăng nhập thì không có thông báo

  return [
    {
      id: "noti-1",
      title: "🎉 Truyện mới ra mắt!",
      message: "Siêu phẩm manga vừa được cập nhật hệ thống, đọc ngay thôi bro.",
      createdAt: "5 phút trước",
      isRead: false,
      link: "/manga/1"
    },
    {
      id: "noti-2",
      title: "🔥 Có Chapter mới",
      message: "Truyện bạn yêu thích vừa ra Chapter mới nhất rồi đấy!",
      createdAt: "2 giờ trước",
      isRead: false,
      link: "/manga/2"
    },
    {
      id: "noti-3",
      title: "🛠️ Hệ thống cập nhật",
      message: "Tính năng Yêu thích và Auth vừa được nâng cấp mượt mà hơn.",
      createdAt: "1 ngày trước",
      isRead: true,
      link: "#"
    }
  ];
};
export const getUserNotification = async (userId = null) => {
  try {
    if (userId) {
      const data = await request(`/api/notifications?userId=${userId}`, { method: "GET" });
      if (data && data.notifications) return data.notifications;
      if (Array.isArray(data)) return data;
    }
  } catch (error) {
    console.warn("⚠️ Không lấy được thông báo từ DB, đang dùng Mock Data...", error.message);
  }

  // Fallback Mock Data giống hàm getUserNotifications để giao diện đồng bộ
  const token = localStorage.getItem("token");
  if (!token) return [];

  return [
    {
      id: "noti-1",
      title: "🎉 Truyện mới ra mắt!",
      message: "Siêu phẩm manga vừa được cập nhật hệ thống, đọc ngay thôi bro.",
      createdAt: "5 phút trước",
      isRead: false,
      link: "/manga/1"
    },
    {
      id: "noti-2",
      title: "🔥 Có Chapter mới",
      message: "Truyện bạn yêu thích vừa ra Chapter mới nhất rồi đấy!",
      createdAt: "2 giờ trước",
      isRead: false,
      link: "/manga/2"
    },
    {
      id: "noti-3",
      title: "🛠️ Hệ thống cập nhật",
      message: "Tính năng Yêu thích và Auth vừa được nâng cấp mượt mà hơn.",
      createdAt: "1 ngày trước",
      isRead: true,
      link: "#"
    }
  ];
};
export const getAuthors = () => {
  // Nếu mockData của bro có sẵn danh sách tác giả thì lấy luôn
  if (typeof mockData !== 'undefined' && mockData.authors) {
    return mockData.authors;
  }

  // Fallback Mock Data: Tự động gom tất cả tác giả từ danh sách truyện ra (bỏ trùng lặp)
  if (typeof mockData !== 'undefined' && mockData.allMangas) {
    const authorsSet = new Set(
      mockData.allMangas
        .map((manga) => manga.author)
        .filter(Boolean) // Loại bỏ các giá trị null/undefined nếu có
    );
    
    // Chuyển Set thành mảng Object giống cấu trúc Genres để dễ map UI
    return Array.from(authorsSet).map((authorName, index) => ({
      id: index + 1,
      name: authorName
    }));
  }

  // Thêm một mảng cứng dự phòng cuối cùng nếu toàn bộ mockData trống trơn
  return [
    { id: 1, name: "Eiichiro Oda" },
    { id: 2, name: "Akira Toriyama" },
    { id: 3, name: "Hajime Isayama" },
    { id: 4, name: "Gege Akutami" },
    { id: 5, name: "Kohei Horikoshi" }
  ];
};
export const getMangasByGenre = async (genreId) => {
  try {
    // Ưu tiên gọi API Backend nếu có
    const data = await request(`/api/mangas/genre/${genreId}`, { method: "GET" });
    if (data && data.mangas) return data.mangas;
    if (Array.isArray(data)) return data;
  } catch (error) {
    console.warn(`⚠️ Không lấy được truyện thuộc thể loại ${genreId} từ DB, đang lọc bằng Mock Data...`, error.message);
  }

  // Fallback Mock Data: Lọc thủ công từ mảng allMangas
  if (typeof mockData !== 'undefined' && mockData.allMangas) {
    return mockData.allMangas.filter((manga) => {
      // Kiểm tra xem mảng genreIds của truyện có chứa genreId đang cần tìm không
      if (Array.isArray(manga.genreIds)) {
        return manga.genreIds.includes(Number(genreId)) || manga.genreIds.includes(String(genreId));
      }
      return false;
    });
  }

  return []; // Trả về mảng rỗng để giao diện không bị lỗi map()
};
export const searchMangas = async (query) => {
  if (!query || !query.trim()) return [];
  
  const keyword = query.toLowerCase().trim();

  try {
    // Ưu tiên gọi API Backend để tìm kiếm
    const data = await request(`/api/mangas/search?q=${encodeURIComponent(keyword)}`, { method: "GET" });
    if (data && data.mangas) return data.mangas;
    if (Array.isArray(data)) return data;
  } catch (error) {
    console.warn("⚠️ API Tìm kiếm lỗi, đang thực hiện tìm kiếm thủ công trên Mock Data...", error.message);
  }

  // Fallback Mock Data: Tự tìm kiếm trên Frontend
  if (typeof mockData !== 'undefined' && mockData.allMangas) {
    return mockData.allMangas.filter((manga) => {
      const matchTitle = manga.title ? manga.title.toLowerCase().includes(keyword) : false;
      const matchAuthor = manga.author ? manga.author.toLowerCase().includes(keyword) : false;
      const matchSummary = manga.summary ? manga.summary.toLowerCase().includes(keyword) : false;
      
      // Trả về truyện nếu khớp tiêu đề, tác giả hoặc mô tả ngắn
      return matchTitle || matchAuthor || matchSummary;
    });
  }

  return []; // Trả về mảng rỗng để không bị sập UI
};

// =====================================
// HÀM TẠO TRUYỆN MỚI (Dùng cho AddComic.jsx)
// =====================================
export const createNewManga = async (mangaData) => {
  try {
    // Ưu tiên gọi API POST của Backend để lưu vào DB
    const data = await request(`/api/mangas`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(mangaData)
    });

    if (data && data.success) {
      return { success: true, message: "Thêm truyện mới thành công!", manga: data.manga };
    }
  } catch (error) {
    console.warn("⚠️ Không gọi được API thêm truyện, đang chạy chế độ Mock...", error.message);
  }

  // Fallback Mock Data: Giả lập lưu thành công ở Frontend để không gãy luồng UI
  const newMockManga = {
    id: Date.now(), // Tạo id ngẫu nhiên không trùng
    manga_id: Date.now(),
    title: mangaData.title || "Truyện Mock Mới",
    author: mangaData.author || "Ẩn danh",
    cover: mangaData.cover || "https://picsum.photos/400/600",
    summary: mangaData.summary || "Chưa có mô tả.",
    status: mangaData.status || "ongoing",
    genreIds: mangaData.genreIds || [],
    latest_chapter: 0,
    avg_rating: 5.0
  };

  // Đẩy tạm vào mockData nếu mảng này đang tồn tại trên window/global để các trang khác thấy được luôn
  if (typeof mockData !== 'undefined' && Array.isArray(mockData.allMangas)) {
    mockData.allMangas.unshift(newMockManga); // Đẩy lên đầu danh sách
  }

  return { 
    success: true, 
    message: "Thêm truyện thành công (Chế độ Mock Data)!", 
    manga: newMockManga 
  };
};
export const createNewChapter = async (chapterData) => {
  try {
    // Ưu tiên gọi API POST của Backend để lưu chapter vào DB
    const data = await request(`/api/mangas/chapters`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(chapterData) // chứa mangaId, chapterNumber, title, pages...
    });

    if (data && data.success) {
      return { success: true, message: "Thêm chapter mới thành công!", chapter: data.chapter };
    }
  } catch (error) {
    console.warn("⚠️ Không gọi được API thêm chapter, đang chạy chế độ Mock...", error.message);
  }

  // Fallback Mock Data: Giả lập lưu thành công ở Frontend
  const newMockChapter = {
    chapter_id: Date.now(), // Tạo id ngẫu nhiên cho chapter
    manga_id: Number(chapterData.mangaId || chapterData.manga_id),
    chapter_number: chapterData.chapterNumber || chapterData.chapter_number || "1",
    title: chapterData.title || `Chapter ${chapterData.chapterNumber}`,
    updated_at: "Vừa xong"
  };

  // Đẩy tạm vào mockData chapters hệ thống để các component khác có thể đọc được ngay
  if (typeof mockData !== 'undefined' && Array.isArray(mockData.chapters)) {
    mockData.chapters.unshift(newMockChapter);
  }

  // Cập nhật luôn số chapter mới nhất cho truyện đó trong mockData.allMangas cho đồng bộ UI
  if (typeof mockData !== 'undefined' && Array.isArray(mockData.allMangas)) {
    const manga = mockData.allMangas.find(m => m.id === newMockChapter.manga_id || m.manga_id === newMockChapter.manga_id);
    if (manga) {
      manga.latest_chapter = newMockChapter.chapter_number;
    }
  }

  return { 
    success: true, 
    message: "Thêm chapter thành công (Chế độ Mock Data)!", 
    chapter: newMockChapter 
  };
};
export const clearUserNotifications = async (userId = null) => {
  try {
    if (userId) {
      // Ưu tiên gọi API Backend để cập nhật DB (Đánh dấu đã đọc hết hoặc xóa)
      const data = await request(`/api/notifications/clear`, {
        method: "PUT", // Hoặc DELETE tùy theo thiết kế Backend của bro
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId })
      });

      if (data && data.success) {
        return { success: true, message: "Đã xóa/đọc toàn bộ thông báo!" };
      }
    }
  } catch (error) {
    console.warn("⚠️ Không gọi được API xóa thông báo, đang xử lý trên Mock Data...", error.message);
  }

  // Fallback Mock Data: Giả lập xóa/đọc hết thông báo ở Frontend
  // (Ví dụ: Giả định bro đang import hoặc dùng mảng mock dữ liệu thông báo, ta sẽ clear UI của user)
  return { 
    success: true, 
    message: "Đã dọn dẹp thông báo (Chế độ Mock Data)!" 
  };
};
export const markAllNotificationsRead = async (userId = null) => {
  try {
    if (userId) {
      // Ưu tiên gọi API Backend để update trạng thái trong DB
      const data = await request(`/api/notifications/mark-all-read`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId })
      });

      if (data && data.success) {
        return { success: true, message: "Đã đánh dấu đọc tất cả thông báo!" };
      }
    }
  } catch (error) {
    console.warn("⚠️ Không gọi được API đánh dấu đọc thông báo, đang chạy chế độ Mock...", error.message);
  }

  // Fallback Mock Data: Giả lập thành công để Frontend cập nhật trạng thái các icon thông báo
  return { 
    success: true, 
    message: "Đã đánh dấu đọc tất cả (Chế độ Mock Data)!" 
  };
};
export const getRankingMangas = async (limit = 5) => {
  try {
    // Ưu tiên gọi API Backend lấy danh sách Top truyện
    const data = await request(`/api/mangas/ranking?limit=${limit}`, { method: "GET" });
    if (data && data.mangas) return data.mangas;
    if (Array.isArray(data)) return data.slice(0, limit);
  } catch (error) {
    console.warn("⚠️ Không lấy được bảng xếp hạng từ DB, đang tự động lọc từ Mock Data...", error.message);
  }

  // Fallback Mock Data: Tự động lọc ra những truyện có điểm đánh giá (avg_rating) cao nhất
  if (typeof mockData !== 'undefined' && Array.isArray(mockData.allMangas)) {
    // Copy mảng ra để tránh làm đảo lộn mảng gốc, sau đó sort giảm dần theo rating
    const sortedMangas = [...mockData.allMangas].sort((a, b) => {
      const ratingA = a.avg_rating || 0;
      const ratingB = b.avg_rating || 0;
      return ratingB - ratingA; 
    });

    // Lấy đúng số lượng (limit) truyện đứng đầu
    return sortedMangas.slice(0, limit);
  }

  return []; // Trả về mảng rỗng để chống crash UI slider
};
export const getUserFavorites = async (userId = null) => {
  const token = localStorage.getItem("token");

  try {
    // Ưu tiên gọi API Backend nếu có Token đăng nhập
    if (token && token !== "mock-jwt-token-xyz") {
      const data = await request(`/api/favorites`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (data && data.favorites) return data.favorites;
      if (Array.isArray(data)) return data;
    }
  } catch (error) {
    console.warn("⚠️ Không lấy được danh sách yêu thích từ DB, đang chuyển sang Mock LocalStorage...", error.message);
  }

  // Fallback Mock Data: Đọc danh sách ID truyện đã thích từ LocalStorage
  const mockFavs = localStorage.getItem("mock_favorites");
  const favoriteIds = mockFavs ? JSON.parse(mockFavs) : [1, 3]; // Mặc định cho thích truyện id 1 và 3 nếu chưa có gì

  // Khớp danh sách ID này với đống mockData.allMangas để trả về mảng chứa đầy đủ thông tin truyện
  if (typeof mockData !== 'undefined' && Array.isArray(mockData.allMangas)) {
    return mockData.allMangas.filter(manga => 
      favoriteIds.includes(Number(manga.id)) || favoriteIds.includes(String(manga.id)) ||
      favoriteIds.includes(Number(manga.manga_id)) || favoriteIds.includes(String(manga.manga_id))
    );
  }

  return []; // Trả về mảng rỗng nếu hệ thống không có dữ liệu để tránh sập UI
};
export const removeFavoriteManga = async (mangaId) => {
  const token = localStorage.getItem("token");

  try {
    // Ưu tiên gọi API Backend để xóa trong Database
    if (token && token !== "mock-jwt-token-xyz") {
      const data = await request(`/api/favorites/${mangaId}`, {
        method: "DELETE",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (data && data.success) {
        return { success: true, message: "Đã xóa khỏi danh sách yêu thích!" };
      }
    }
  } catch (error) {
    console.warn(`⚠️ Không xóa được yêu thích ID ${mangaId} trên DB, đang xử lý qua Mock LocalStorage...`, error.message);
  }

  // Fallback Mock Data: Xóa ID truyện khỏi localStorage ở Frontend
  const mockFavs = localStorage.getItem("mock_favorites");
  if (mockFavs) {
    let favoriteIds = JSON.parse(mockFavs);
    // Lọc bỏ ID truyện vừa bấm xóa (hỗ trợ cả kiểu dữ liệu String lẫn Number)
    favoriteIds = favoriteIds.filter(id => Number(id) !== Number(mangaId));
    localStorage.setItem("mock_favorites", JSON.stringify(favoriteIds));
  }

  return { 
    success: true, 
    message: "Đã xóa khỏi danh sách yêu thích (Chế độ Mock Data)!" 
  };
};
export const getUserReadingHistory = async (userId = null) => {
  const token = localStorage.getItem("token");

  try {
    // Ưu tiên gọi API Backend nếu đã đăng nhập và có token thật
    if (token && token !== "mock-jwt-token-xyz") {
      const data = await request(`/api/history`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (data && data.history) return data.history;
      if (Array.isArray(data)) return data;
    }
  } catch (error) {
    console.warn("⚠️ Không lấy được lịch sử đọc từ DB, đang chuyển sang Mock LocalStorage...", error.message);
  }

  // Fallback Mock Data: Đọc lịch sử từ LocalStorage ở Frontend
  const mockHistoryData = localStorage.getItem("mock_reading_history");
  
  if (mockHistoryData) {
    return JSON.parse(mockHistoryData);
  }

  // Nếu LocalStorage trống trơn, trả về vài dữ liệu mẫu xịn xò khớp với mockData.allMangas để test UI
  if (typeof mockData !== 'undefined' && Array.isArray(mockData.allMangas)) {
    // Lấy tạm 2 truyện đầu tiên trong mockData làm lịch sử mẫu
    return mockData.allMangas.slice(0, 2).map((manga, index) => ({
      id: `history-${manga.id}`,
      manga_id: manga.id,
      title: manga.title,
      cover: manga.cover,
      last_read_chapter: index === 0 ? "Chapter 50" : "Chapter 12",
      read_at: index === 0 ? "10 phút trước" : "Hôm qua"
    }));
  }

  return []; // Trả về mảng rỗng để chống crash trang nếu không có dữ liệu gì
};

export const getRatingStats = async (mangaId) => {
  try {
    // Ưu tiên gọi API Backend để lấy số liệu thống kê từ DB
    const data = await request(`/api/mangas/${mangaId}/rating-stats`, { method: "GET" });
    if (data && data.stats) return data.stats;
    if (data && typeof data['5_star'] !== 'undefined') return data; // Nếu backend trả về trực tiếp object stats
  } catch (error) {
    console.warn(`⚠️ Không lấy được thống kê đánh giá cho truyện ID ${mangaId} từ DB, đang dùng Mock Data...`, error.message);
  }

  // Fallback Mock Data: Tự tạo thống kê sao ngẫu nhiên nhưng logic dựa theo rating của truyện
  let avgRating = 4.5; // Điểm mặc định nếu không tìm thấy truyện
  
  if (typeof mockData !== 'undefined' && Array.isArray(mockData.allMangas)) {
    const manga = mockData.allMangas.find(m => Number(m.id) === Number(mangaId) || Number(m.manga_id) === Number(mangaId));
    if (manga && manga.avg_rating) {
      avgRating = manga.avg_rating;
    }
  }

  // Giả lập số lượt vote dựa trên số điểm trung bình để UI hiển thị biểu đồ phần trăm siêu đẹp
  const totalVotes = 120; // Giả lập tổng số 120 lượt đánh giá
  
  // Phân bổ số vote dựa theo form điểm (ví dụ: điểm cao thì vote 5 sao và 4 sao sẽ chiếm đa số)
  const isHighRating = avgRating >= 4.0;
  
  return {
    total_votes: totalVotes,
    avg_rating: avgRating,
    stars: {
      5: isHighRating ? 75 : 20,
      4: isHighRating ? 25 : 30,
      3: isHighRating ? 12 : 40,
      2: isHighRating ? 5 : 20,
      1: isHighRating ? 3 : 10
    }
  };
};

export const submitRating = async (mangaId, starCount) => {
  const token = localStorage.getItem("token");

  try {
    // Ưu tiên gọi API POST của Backend để lưu lượt vote vào DB
    if (token && token !== "mock-jwt-token-xyz") {
      const data = await request(`/api/mangas/rate`, {
        method: "POST",
        headers: { 
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ mangaId, score: Number(starCount) })
      });

      if (data && data.success) {
        return { success: true, message: "Cảm ơn bro đã đánh giá truyện!", avgRating: data.avgRating };
      }
    }
  } catch (error) {
    console.warn(`⚠️ Không gửi được đánh giá lên DB, đang xử lý ở chế độ Mock...`, error.message);
  }

  // Fallback Mock Data: Giả lập lưu đánh giá thành công ở Frontend
  // Tự động cập nhật điểm trung bình (avg_rating) trong mockData cho truyện đó để UI thay đổi theo luôn
  let newAvgRating = 4.8;
  if (typeof mockData !== 'undefined' && Array.isArray(mockData.allMangas)) {
    const manga = mockData.allMangas.find(m => Number(m.id) === Number(mangaId) || Number(m.manga_id) === Number(mangaId));
    if (manga) {
      // Công thức giả lập nhanh: Lấy điểm cũ cộng điểm mới chia đôi cho có sự thay đổi UI
      const currentRating = manga.avg_rating || 4.5;
      manga.avg_rating = Number(((currentRating + Number(starCount)) / 2).toFixed(1));
      newAvgRating = manga.avg_rating;
    }
  }

  return { 
    success: true, 
    message: `Đánh giá ${starCount} sao thành công (Chế độ Mock Data)!`,
    avgRating: newAvgRating
  };
};
// =====================================
// HÀM LẤY TỔNG SỐ LƯỢT YÊU THÍCH CỦA TRUYỆN (Dùng cho MangaDetail.jsx)
// =====================================
export const getTotalFavorites = async (mangaId) => {
  try {
    // Ưu tiên gọi API Backend để lấy tổng số lượt tim từ DB
    const data = await request(`/api/mangas/${mangaId}/total-favorites`, { method: "GET" });
    if (data && typeof data.total !== 'undefined') return data.total;
    if (data && typeof data.count !== 'undefined') return data.count;
  } catch (error) {
    console.warn(`⚠️ Không lấy được tổng số yêu thích cho truyện ID ${mangaId} từ DB, đang dùng số Mock...`, error.message);
  }

  // Fallback Mock Data: Giả lập số lượt thích dựa theo ID hoặc Rating của truyện cho logic
  let baseFavorites = 350; // Con số mặc định ban đầu
  
  if (typeof mockData !== 'undefined' && Array.isArray(mockData.allMangas)) {
    const manga = mockData.allMangas.find(m => Number(m.id) === Number(mangaId) || Number(m.manga_id) === Number(mangaId));
    if (manga && manga.avg_rating) {
      // Truyện điểm càng cao thì lượt thích giả lập càng nhiều cho chân thực
      baseFavorites = Math.floor(manga.avg_rating * 120);
    }
  } else {
    // Nếu không có mockData truyện, tạo số ngẫu nhiên theo mangaId để mỗi truyện hiện một số khác nhau
    baseFavorites = Math.floor((Number(mangaId) || 1) * 87 + 120) % 1000;
  }

  return baseFavorites;
};
// =====================================
// HÀM LIKE / DISLIKE BÌNH LUẬN (Dùng cho Comment.jsx)
// =====================================
export const toggleReaction = async (commentId, reactionType = "like") => {
  const token = localStorage.getItem("token");

  try {
    // Ưu tiên gọi API Backend để lưu lượt Like vào DB nếu đã đăng nhập
    if (token && token !== "mock-jwt-token-xyz") {
      const data = await request(`/api/comments/${commentId}/reaction`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({ type: reactionType }) // 'like' hoặc 'dislike'
      });

      if (data && data.success) {
        return { 
          success: true, 
          likes: data.likes, 
          dislikes: data.dislikes, 
          hasReacted: data.hasReacted 
        };
      }
    }
  } catch (error) {
    console.warn(`⚠️ Không gửi được reaction cho comment ID ${commentId}, đang chạy chế độ Mock...`, error.message);
  }

  // Fallback Mock Data: Giả lập đảo trạng thái reaction ở Frontend để test UI bấm nút nhảy số
  // Tạo số lượng like ngẫu nhiên nếu UI cần cập nhật trực tiếp
  const randomLikes = Math.floor(Math.random() * 10) + 5;

  return {
    success: true,
    message: `Đã ${reactionType === "like" ? "Thích" : "Không thích"} bình luận (Chế độ Mock Data)!`,
    likes: reactionType === "like" ? randomLikes + 1 : randomLikes,
    dislikes: reactionType === "dislike" ? 2 : 0,
    hasReacted: true // Đánh dấu là user này đã nhấn rồi
  };
};
// =====================================
// HÀM XÓA BÌNH LUẬN (Dùng cho CommentsSection.jsx)
// =====================================
export const deleteComment = async (commentId) => {
  const token = localStorage.getItem("token");

  try {
    // Ưu tiên gọi API DELETE của Backend để xóa vĩnh viễn trong DB
    if (token && token !== "mock-jwt-token-xyz") {
      const data = await request(`/api/comments/${commentId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (data && data.success) {
        return { success: true, message: "Đã xóa bình luận thành công!" };
      }
    }
  } catch (error) {
    console.warn(`⚠️ Không xóa được bình luận ID ${commentId} trên DB, đang chạy chế độ Mock...`, error.message);
  }

  // Fallback Mock Data: Giả lập xóa thành công ở Frontend
  return { 
    success: true, 
    message: "Đã xóa bình luận (Chế độ Mock Data)!" 
  };
};
// =====================================
// HÀM LẤY DANH SÁCH BÌNH LUẬN (Dùng cho CommentsSection.jsx)
// =====================================
export const getComments = async (mangaId, chapterId = null) => {
  try {
    // Xây dựng URL tùy thuộc vào việc lấy comment của cả truyện hay chỉ của một chapter riêng lẻ
    let url = `/api/comments?mangaId=${mangaId}`;
    if (chapterId) {
      url += `&chapterId=${chapterId}`;
    }

    // Ưu tiên gọi API Backend để lấy dữ liệu thực tế từ DB
    const data = await request(url, { method: "GET" });
    if (data && data.comments) return data.comments;
    if (Array.isArray(data)) return data;
  } catch (error) {
    console.warn(`⚠️ Không lấy được bình luận từ DB, đang tải danh sách Mock bình luận...`, error.message);
  }

  // Fallback Mock Data: Trả về một danh sách bình luận mẫu cực kỳ đầy đủ để test UI
  return [
    {
      id: "comment-1",
      user: {
        id: "u-1",
        name: "WibuChua99",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=WibuChua99"
      },
      content: "Má ơi! Chap này quay xe gắt quá, main chất lừ thực sự bro ạ!! 🔥🔥🔥",
      likes: 42,
      dislikes: 1,
      createdAt: "10 phút trước",
      replies: []
    },
    {
      id: "comment-2",
      user: {
        id: "u-2",
        name: "MangaLover",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=MangaLover"
      },
      content: "Nét vẽ bộ này càng ngày càng lên tay, hóng chap sau quá, admin dịch nhanh lên nha.",
      likes: 18,
      dislikes: 0,
      createdAt: "1 giờ trước",
      replies: []
    },
    {
      id: "comment-3",
      user: {
        id: "u-3",
        name: "SaitamaGamer",
        avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=SaitamaGamer"
      },
      content: "Hình như cốt truyện đoạn này có hơi khác so với light novel một tí thì phải? Nhưng mà lên tranh nhìn hoành tráng hơn hẳn.",
      likes: 25,
      dislikes: 4,
      createdAt: "Hôm qua",
      replies: []
    }
  ];
};
// =====================================
// HÀM GỬI BÌNH LUẬN MỚI (Dùng cho CommentsSection.jsx)
// =====================================
export const submitComment = async (mangaId, content, chapterId = null) => {
  const token = localStorage.getItem("token");

  try {
    // Ưu tiên gọi API POST của Backend để lưu bình luận vào Database
    if (token && token !== "mock-jwt-token-xyz") {
      const data = await request(`/api/comments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          mangaId,
          content,
          chapterId
        })
      });

      if (data && data.success) {
        return { success: true, comment: data.comment, message: "Đăng bình luận thành công!" };
      }
    }
  } catch (error) {
    console.warn("⚠️ Không gửi được bình luận lên DB, đang chạy chế độ Giả lập (Mock)...", error.message);
  }

  // Fallback Mock Data: Giả lập lưu thành công để UI lập tức hiển thị bình luận mới
  const newMockComment = {
    id: `comment-mock-${Date.now()}`,
    user: {
      id: "u-current",
      name: localStorage.getItem("username") || "Ẩn Danh Wibu",
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${localStorage.getItem("username") || "AnDanh"}`
    },
    content: content,
    likes: 0,
    dislikes: 0,
    createdAt: "Vừa xong",
    replies: []
  };

  return {
    success: true,
    comment: newMockComment,
    message: "Đăng bình luận thành công (Chế độ Mock Data)!"
  };
};
// =====================================
// HÀM GHI NHẬN LỊCH SỬ ĐỌC TRUYỆN MỚI (Dùng cho ChapterReader.jsx)
// =====================================
export const addReadingHistory = async (mangaId, chapterNumber, chapterId = null) => {
  const token = localStorage.getItem("token");

  try {
    // Ưu tiên gọi API Backend để lưu lịch sử vào DB
    if (token && token !== "mock-jwt-token-xyz") {
      await request(`/api/history`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          mangaId: Number(mangaId),
          chapterNumber: String(chapterNumber),
          chapterId: chapterId ? Number(chapterId) : null
        })
      });
      return { success: true, message: "Đã ghi nhận lịch sử đọc vào DB!" };
    }
  } catch (error) {
    console.warn("⚠️ Không lưu được lịch sử đọc lên DB, đang backup qua Mock LocalStorage...", error.message);
  }

  // Fallback Mock Data: Tự cập nhật lịch sử đọc vào LocalStorage để đồng bộ với trang MyHistory.jsx
  try {
    const localHistory = localStorage.getItem("mock_reading_history");
    let historyArray = localHistory ? JSON.parse(localHistory) : [];

    // Kiểm tra xem truyện này đã từng có trong lịch sử chưa
    const existingIndex = historyArray.findIndex(item => Number(item.manga_id) === Number(mangaId));

    // Lấy thông tin truyện từ mockData để làm dữ liệu hiển thị (nếu có)
    let mangaTitle = "Truyện đang đọc";
    let mangaCover = "https://picsum.photos/400/600";
    
    if (typeof mockData !== 'undefined' && Array.isArray(mockData.allMangas)) {
      const manga = mockData.allMangas.find(m => Number(m.id) === Number(mangaId) || Number(m.manga_id) === Number(mangaId));
      if (manga) {
        mangaTitle = manga.title;
        mangaCover = manga.cover;
      }
    }

    const historyItem = {
      id: `history-${mangaId}`,
      manga_id: Number(mangaId),
      title: mangaTitle,
      cover: mangaCover,
      last_read_chapter: `Chapter ${chapterNumber}`,
      read_at: "Vừa xong"
    };

    if (existingIndex !== -1) {
      // Nếu đã có, xóa cái cũ đi để đưa cái mới nhất lên đầu danh sách
      historyArray.splice(existingIndex, 1);
    }
    
    historyArray.unshift(historyItem);
    localStorage.setItem("mock_reading_history", JSON.stringify(historyArray));

  } catch (e) {
    console.error("❌ Lỗi xử lý LocalStorage cho lịch sử đọc:", e);
  }

  return { success: true, message: "Đã ghi nhận lịch sử đọc (Chế độ Mock Data)!" };
};
// =====================================
// HÀM ĐĂNG KÝ/NÂNG CẤP LÊN QUYỀN UPLOADER (Dùng cho CreatorDashboard.jsx)
// =====================================
export const becomeUploader = async (requestData = {}) => {
  const token = localStorage.getItem("token");

  try {
    // Ưu tiên gọi API Backend để cập nhật Role hoặc gửi đơn duyệt lên DB
    if (token && token !== "mock-jwt-token-xyz") {
      const data = await request(`/api/users/become-uploader`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(requestData) // Có thể chứa thông tin tên nhóm dịch, lý do...
      });

      if (data && data.success) {
        // Nếu Backend trả về token mới chứa role uploader thì cập nhật luôn
        if (data.token) localStorage.setItem("token", data.token);
        if (data.role) localStorage.setItem("role", data.role);
        
        return { success: true, message: "Chúc mừng bro đã trở thành Uploader thực thụ!", role: data.role || "uploader" };
      }
    }
  } catch (error) {
    console.warn("⚠️ Không gọi được API phân quyền Backend, đang kích hoạt chế độ Giả lập...", error.message);
  }

  // Fallback Mock Data: Giả lập nâng cấp thành công trực tiếp ở Frontend để test UI Dashboard
  localStorage.setItem("role", "uploader");
  
  // Giả lập cập nhật lại thông tin user trong local nếu có
  const mockUser = localStorage.getItem("user");
  if (mockUser) {
    const userObj = JSON.parse(mockUser);
    userObj.role = "uploader";
    localStorage.setItem("user", JSON.stringify(userObj));
  }

  return {
    success: true,
    message: "Đăng ký làm Uploader thành công (Chế độ Mock Data)! Giao diện Creator đã được mở khóa.",
    role: "uploader"
  };
};
// =====================================
// HÀM LẤY DANH SÁCH TRUYỆN ĐÃ ĐĂNG CỦA UPLOADER (Dùng cho CreatorDashboard.jsx)
// =====================================
export const fetchMyComics = async (uploaderId = null) => {
  const token = localStorage.getItem("token");

  try {
    // Ưu tiên gọi API Backend để lấy truyện riêng của Uploader này
    if (token && token !== "mock-jwt-token-xyz") {
      const data = await request(`/api/creator/mangas`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}` }
      });
      if (data && data.mangas) return data.mangas;
      if (Array.isArray(data)) return data;
    }
  } catch (error) {
    console.warn("⚠️ Không lấy được danh sách truyện của Creator từ DB, đang chuyển sang Mock Data...", error.message);
  }

  // Fallback Mock Data: Lọc hoặc lấy tạm vài truyện từ mockData để làm danh sách truyện đã đăng
  if (typeof mockData !== 'undefined' && Array.isArray(mockData.allMangas)) {
    // Nếu mảng truyện có dữ liệu, lấy tạm 2 bộ truyện đầu tiên giả lập làm truyện do chính Uploader này đăng
    return mockData.allMangas.slice(0, 2).map(manga => ({
      ...manga,
      total_chapters: manga.latest_chapter || 12,
      views: Math.floor(Math.random() * 5000) + 1000, // Thêm thông số views cho uploader sướng mắt
      status: manga.status || "ongoing"
    }));
  }

  return []; // Trả về mảng rỗng để không bị lỗi crash map giao diện
};