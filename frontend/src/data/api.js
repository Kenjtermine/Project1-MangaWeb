import mockData from "./mockData.json";
const STORAGE_KEYS = {
  users: "mockUsers",
  favorites: "mockFavorites",
  history: "mockReadingHistory",
  notifications: "mockNotifications",
};

const readStorage = (key, fallback) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const writeStorage = (key, value) => {
  localStorage.setItem(key, JSON.stringify(value));
};

const normalizeText = (value = "") => value.toString().trim().toLowerCase();

const getUsers = () => readStorage(STORAGE_KEYS.users, mockData.users);
const getFavorites = () => readStorage(STORAGE_KEYS.favorites, mockData.user_favorites);
const getHistory = () => readStorage(STORAGE_KEYS.history, mockData.reading_history);
const getNotifications = () => readStorage(STORAGE_KEYS.notifications, mockData.notifications);

export const getCurrentUserId = () => {
  const userId = localStorage.getItem("currentUserId");
  return userId ? Number(userId) : null;
};

export const getUserLogin = () => {
  const userId = getCurrentUserId();
  if (!userId) return null;
  return getUsers().find((user) => user.id === userId) || null;
};

export const loginUser = ({ username, password }) => {
  const loginName = normalizeText(username);
  const foundUser = getUsers().find(
    (user) =>
      (normalizeText(user.username) === loginName || normalizeText(user.email) === loginName) &&
      user.password === password
  );

  if (!foundUser) {
    return { ok: false, message: "Sai tên đăng nhập/email hoặc mật khẩu." };
  }

  if (foundUser.is_banned) {
    return { ok: false, message: "Tài khoản này đang bị khóa." };
  }

  localStorage.setItem("currentUserId", foundUser.id);
  return { ok: true, user: foundUser, message: "Đăng nhập thành công." };
};

export const registerUser = ({ username, email, password, confirmPassword }) => {
  const name = username.trim();
  const mail = email.trim();

  if (name.length < 3) return { ok: false, message: "Tên người dùng cần ít nhất 3 ký tự." };
  if (!mail.includes("@")) return { ok: false, message: "Email không hợp lệ." };
  if (password.length < 6) return { ok: false, message: "Mật khẩu cần ít nhất 6 ký tự." };
  if (password !== confirmPassword) return { ok: false, message: "Mật khẩu nhập lại không khớp." };

  const users = getUsers();
  const existed = users.some(
    (user) => normalizeText(user.username) === normalizeText(name) || normalizeText(user.email) === normalizeText(mail)
  );

  if (existed) return { ok: false, message: "Tên người dùng hoặc email đã tồn tại." };

  const nextUser = {
    id: Math.max(...users.map((user) => user.id), 0) + 1,
    username: name,
    email: mail,
    password,
    avatar: "https://i.imgur.com/1n7f1bF.jpg",
    role: "User",
    gender: "Khác",
    is_banned: false,
    created_at: new Date().toISOString(),
  };

  writeStorage(STORAGE_KEYS.users, [...users, nextUser]);
  localStorage.setItem("currentUserId", nextUser.id);
  return { ok: true, user: nextUser, message: "Đăng ký thành công." };
};

export const getAllMangas = () => mockData.allMangas;

export const getMangaById = (mangaId) =>
  mockData.allMangas.find((manga) => manga.id === Number(mangaId) || manga.manga_id === Number(mangaId));

const createMockChapters = (manga) => {
  if (!manga) return [];

  const latestChapter = Number(manga.latest_chapter) || 1;
  const chapterCount = Math.min(latestChapter, 12);

  return Array.from({ length: chapterCount }, (_, index) => {
    const chapterNumber = latestChapter - index;
    return {
      chapter_id: Number(`${manga.id}${String(chapterNumber).replace(".", "")}`),
      manga_id: manga.id,
      chapter_number: chapterNumber,
      chapter_title: index === 0 ? "Chương mới nhất" : `Diễn biến ${chapterNumber}`,
      chapter_slug: `chapter-${chapterNumber}`,
      view_count: Math.max(800, (manga.total_views || 10000) / (index + 35)),
      published_at: new Date(new Date(manga.updated_at).getTime() - index * 86400000).toISOString(),
      is_mock: true,
    };
  });
};

export const getChaptersByMangaId = (mangaId) => {
  const manga = getMangaById(mangaId);
  if (!manga) return [];

  const existingChapters = mockData.chapters.filter((chapter) => chapter.manga_id === Number(mangaId));
  const existingNumbers = new Set(existingChapters.map((chapter) => Number(chapter.chapter_number)));
  const mockChapters = createMockChapters(manga).filter((chapter) => !existingNumbers.has(Number(chapter.chapter_number)));

  return [...existingChapters, ...mockChapters].sort((a, b) => Number(b.chapter_number) - Number(a.chapter_number));
};

export const getChapterById = (chapterId) => {
  const realChapter = mockData.chapters.find((chapter) => chapter.chapter_id === Number(chapterId));
  if (realChapter) return realChapter;

  return mockData.allMangas
    .flatMap((manga) => createMockChapters(manga))
    .find((chapter) => chapter.chapter_id === Number(chapterId));
};

export const getReaderPages = (mangaId, chapterId) => {
  const manga = getMangaById(mangaId);
  const chapter = getChapterById(chapterId);
  if (!manga || !chapter) return [];

  return Array.from({ length: 6 }, (_, index) => ({
    page_number: index + 1,
    image_url: `https://picsum.photos/seed/${manga.slug}-${chapter.chapter_number}-${index + 1}/900/1300`,
  }));
};

export const getGenres = () => mockData.genres;

export const getAuthors = () => mockData.authors;

export const getMangasByGenre = (genreId) => {
  const ids = mockData.mangaByGenre[String(genreId)] || [];
  return mockData.allMangas.filter((manga) => ids.includes(manga.id) || manga.genreIds?.includes(Number(genreId)));
};

export const searchMangas = ({ keyword = "", genreIds = [], authorId = null, status = "", sort = "latest" } = {}) => {
  const selectedGenres = genreIds.map(Number).filter(Boolean);
  const selectedAuthor = authorId ? mockData.authors.find((author) => author.id === Number(authorId)) : null;
  const query = normalizeText(keyword);

  let results = mockData.allMangas.filter((manga) => {
    const matchKeyword =
      !query ||
      normalizeText(manga.title).includes(query) ||
      normalizeText(manga.author).includes(query) ||
      normalizeText(manga.summary).includes(query);
    const matchGenres =
      selectedGenres.length === 0 || selectedGenres.every((genreId) => manga.genreIds?.includes(genreId));
    const matchAuthor = !selectedAuthor || normalizeText(manga.author) === normalizeText(selectedAuthor.name);
    const matchStatus = !status || manga.status === status;

    return matchKeyword && matchGenres && matchAuthor && matchStatus;
  });

  if (sort === "views") results = [...results].sort((a, b) => b.total_views - a.total_views);
  if (sort === "rating") results = [...results].sort((a, b) => b.avg_rating - a.avg_rating);
  if (sort === "latest") results = [...results].sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at));

  return results;
};

export const getRankingMangas = (limit = 10) => {
  const dailyViewByManga = mockData.manga_daily_views.reduce((acc, item) => {
    acc[item.manga_id] = (acc[item.manga_id] || 0) + item.view_count;
    return acc;
  }, {});

  return mockData.allMangas
    .map((manga) => ({
      ...manga,
      daily_views: dailyViewByManga[manga.id] || 0,
    }))
    .sort((a, b) => b.daily_views - a.daily_views || b.total_views - a.total_views)
    .slice(0, limit);
};

export const getUserNotification = () => {
  const userId = getCurrentUserId();
  if (!userId) return [];
  return getNotifications()
    .filter((noti) => noti.user_id === userId)
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
};

export const markAllNotificationsRead = () => {
  const userId = getCurrentUserId();
  if (!userId) return [];

  const nextNotifications = getNotifications().map((noti) =>
    noti.user_id === userId ? { ...noti, is_read: true } : noti
  );
  writeStorage(STORAGE_KEYS.notifications, nextNotifications);
  return getUserNotification();
};

export const clearUserNotifications = () => {
  const userId = getCurrentUserId();
  if (!userId) return [];

  const nextNotifications = getNotifications().filter((noti) => noti.user_id !== userId);
  writeStorage(STORAGE_KEYS.notifications, nextNotifications);
  return [];
};

export const getUserFavorites = () => {
  const userId = getCurrentUserId();
  if (!userId) return [];

  return getFavorites()
    .filter((favorite) => favorite.user_id === userId)
    .map((favorite) => ({
      ...favorite,
      manga: getMangaById(favorite.manga_id),
    }))
    .filter((favorite) => favorite.manga);
};

export const isFavoriteManga = (mangaId) => {
  const userId = getCurrentUserId();
  if (!userId) return false;
  return getFavorites().some((favorite) => favorite.user_id === userId && favorite.manga_id === Number(mangaId));
};

export const toggleFavoriteManga = (mangaId) => {
  const userId = getCurrentUserId();
  if (!userId) return { ok: false, isFavorite: false, message: "Bạn cần đăng nhập để thêm yêu thích." };

  const targetId = Number(mangaId);
  const favorites = getFavorites();
  const existed = favorites.some((favorite) => favorite.user_id === userId && favorite.manga_id === targetId);
  const nextFavorites = existed
    ? favorites.filter((favorite) => !(favorite.user_id === userId && favorite.manga_id === targetId))
    : [...favorites, { user_id: userId, manga_id: targetId, created_at: new Date().toISOString() }];

  writeStorage(STORAGE_KEYS.favorites, nextFavorites);
  return {
    ok: true,
    isFavorite: !existed,
    message: existed ? "Đã bỏ khỏi danh sách yêu thích." : "Đã thêm vào danh sách yêu thích.",
  };
};

export const getUserReadingHistory = () => {
  const userId = getCurrentUserId();
  if (!userId) return [];

  return getHistory()
    .filter((item) => item.user_id === userId)
    .map((item) => ({
      ...item,
      manga: getMangaById(item.manga_id),
      chapter: mockData.chapters.find((chapter) => chapter.chapter_id === item.chapter_id),
    }))
    .filter((item) => item.manga)
    .sort((a, b) => new Date(b.last_read_at) - new Date(a.last_read_at));
};

export const addReadingHistory = ({ mangaId, chapterId, pageNumber = 1, progressPercent = 0 }) => {
  const userId = getCurrentUserId();
  if (!userId) return { ok: false, message: "Bạn cần đăng nhập để lưu lịch sử đọc." };

  const history = getHistory();
  const nextItem = {
    history_id: Math.max(...history.map((item) => item.history_id), 0) + 1,
    user_id: userId,
    manga_id: Number(mangaId),
    chapter_id: Number(chapterId),
    page_number: Number(pageNumber),
    progress_percent: Number(progressPercent),
    last_read_at: new Date().toISOString(),
    created_at: new Date().toISOString(),
  };

  const nextHistory = [
    nextItem,
    ...history.filter((item) => !(item.user_id === userId && item.chapter_id === Number(chapterId))),
  ];
  writeStorage(STORAGE_KEYS.history, nextHistory);
  return { ok: true, item: nextItem };
};

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000';

export const createNewManga = async (mangaData) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const currentUser = JSON.parse(localStorage.getItem('currentUserId')); 
      const uploaderName = currentUser ? currentUser.username : "nyancat";
      const existingMangas = JSON.parse(localStorage.getItem('mangas')) || [];

      const newComic = {
        id: Date.now(), 
        ...mangaData,
        uploader_username: uploaderName, 
        coverImage: mangaData.coverImage || "https://i.imgur.com/3n7f1bF.jpg", 
        status: "Đang tiến hành"
      };
      existingMangas.push(newComic);
      localStorage.setItem('mangas', JSON.stringify(existingMangas));

      console.log(" Đã lưu truyện vào LocalStorage:", newComic);
      resolve({ 
        ok: true, 
        message: "Thêm truyện thành công!", 
        manga: newComic 
      });
    }, 1500);
  });
};
// frontend/src/data/api.js

export const becomeUploader = () => {
  const userId = getCurrentUserId();
  if (!userId) return { ok: false, message: "Bạn cần đăng nhập trước." };

  const users = getUsers();
  const nextUsers = users.map((user) =>
    user.id === userId ? { ...user, is_uploader: true } : user
  );

  writeStorage(STORAGE_KEYS.users, nextUsers);
  return { ok: true, message: "Chúc mừng! Bạn đã trở thành Uploader." };
};
