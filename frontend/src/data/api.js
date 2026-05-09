import mockData from "./mockData.json";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const STORAGE_KEYS = {
  authToken: "authToken",
  currentUser: "currentUser",
  favorites: "mockFavorites",
  history: "mockReadingHistory",
  notifications: "mockNotifications",
  comments: "mockComments",
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

const removeStorage = (key) => {
  localStorage.removeItem(key);
};

const normalizeText = (value = "") => value.toString().trim().toLowerCase();

const request = async (path, options = {}) => {
  const token = getAuthToken();
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
};

const getFavorites = () => readStorage(STORAGE_KEYS.favorites, mockData.user_favorites);
const getHistory = () => readStorage(STORAGE_KEYS.history, mockData.reading_history);
const getNotifications = () => readStorage(STORAGE_KEYS.notifications, mockData.notifications);

export const getAuthToken = () => localStorage.getItem(STORAGE_KEYS.authToken);

export const getCurrentUser = () => readStorage(STORAGE_KEYS.currentUser, null);

export const getCurrentUserId = () => {
  const user = getCurrentUser();
  return user?.user_id ? Number(user.user_id) : null;
};

export const logoutUser = () => {
  removeStorage(STORAGE_KEYS.authToken);
  removeStorage(STORAGE_KEYS.currentUser);
};

const saveAuth = ({ user, token }) => {
  if (token) localStorage.setItem(STORAGE_KEYS.authToken, token);
  if (user) writeStorage(STORAGE_KEYS.currentUser, user);
  return user || null;
};

export const loginUser = async ({ username, email, password }) => {
  const loginName = username || email;

  try {
    const data = await request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username: loginName, email: loginName, password }),
    });

    const user = saveAuth({ user: data.user, token: data.token });
    return { ok: true, user, message: "Đăng nhập thành công." };
  } catch (error) {
    return { ok: false, message: error.message || "Đăng nhập thất bại." };
  }
};

export const registerUser = async ({ username, email, password, confirmPassword }) => {
  if (password !== confirmPassword) {
    return { ok: false, message: "Mật khẩu nhập lại không khớp." };
  }

  try {
    const data = await request("/api/auth/register", {
      method: "POST",
      body: JSON.stringify({ username, email, password, confirmPassword }),
    });

    const user = saveAuth({ user: data.user, token: data.token });
    return { ok: true, user, message: "Đăng ký thành công." };
  } catch (error) {
    return { ok: false, message: error.message || "Đăng ký thất bại." };
  }
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
    .map((manga) => ({ ...manga, daily_views: dailyViewByManga[manga.id] || 0 }))
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
    .map((favorite) => ({ ...favorite, manga: getMangaById(favorite.manga_id) }))
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

export const removeFavoriteManga = (mangaId) => {
  const userId = getCurrentUserId();
  if (!userId) return { ok: false, message: "Bạn cần đăng nhập." };

  const targetId = Number(mangaId);
  const nextFavorites = getFavorites().filter(
    (favorite) => !(favorite.user_id === userId && favorite.manga_id === targetId)
  );
  writeStorage(STORAGE_KEYS.favorites, nextFavorites);

  return { ok: true, isFavorite: false, message: "Đã xóa khỏi danh sách yêu thích." };
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

const normalizeComment = (comment) => {
  return {
    ...comment,
    user: comment.user || comment.user_name || "Người dùng ẩn danh",
    avatar: comment.avatar || comment.user_avatar || "https://i.imgur.com/1n7f1bF.jpg",
    timestamp: comment.created_at || comment.timestamp,
    like_count: comment.like_count || 0,
    dislike_count: comment.dislike_count || 0,
    userReactions: comment.userReactions || {},
  };
};

export const getComments = (chapterId = 1) => {
  const comments = readStorage(STORAGE_KEYS.comments, mockData.comments);

  return comments
    .filter((comment) => Number(comment.chapter_id || 1) === Number(chapterId))
    .map(normalizeComment)
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

export const submitComment = ({ chapterId = 1, content, parentCommentId = null, rootCommentId = null }) => {
  const user = getCurrentUser();
  const text = content?.trim();

  if (!user) return { ok: false, message: "Bạn cần đăng nhập để bình luận." };
  if (!text) return { ok: false, message: "Nội dung bình luận không được để trống." };
  if (text.length > 1000) return { ok: false, message: "Bình luận tối đa 1000 ký tự." };

  const comments = readStorage(STORAGE_KEYS.comments, mockData.comments);
  const nextId = Math.max(...comments.map((comment) => Number(comment.comment_id) || 0), 0) + 1;
  const createdAt = new Date().toISOString();
  const newComment = {
    comment_id: nextId,
    user_id: Number(user.user_id),
    user_name: user.user_name,
    user_avatar: user.user_avatar,
    chapter_id: Number(chapterId),
    parent_comment_id: parentCommentId ? Number(parentCommentId) : null,
    root_comment_id: rootCommentId ? Number(rootCommentId) : parentCommentId ? Number(parentCommentId) : nextId,
    content: text,
    like_count: 0,
    dislike_count: 0,
    userReactions: {},
    is_deleted: false,
    created_at: createdAt,
    updated_at: createdAt,
  };

  writeStorage(STORAGE_KEYS.comments, [newComment, ...comments]);

  return {
    ok: true,
    message: "Đã gửi bình luận.",
    comment: normalizeComment(newComment),
    comments: getComments(chapterId),
  };
};

export const toggleReaction = ({ commentId, reaction }) => {
  const currentUserId = getCurrentUserId();
  if (!currentUserId) return { ok: false, message: "Cần đăng nhập để reaction." };

  const comments = readStorage(STORAGE_KEYS.comments, mockData.comments);
  const nextComments = comments.map((item) => ({ ...item, userReactions: { ...(item.userReactions || {}) } }));
  const comment = nextComments.find((item) => item.comment_id === Number(commentId));

  if (!comment) return { ok: false, message: "Bình luận không tồn tại." };

  const userCurrentReaction = comment.userReactions[currentUserId];

  if (userCurrentReaction === reaction) {
    const countKey = reaction === "like" ? "like_count" : "dislike_count";
    comment[countKey] = Math.max(0, (comment[countKey] || 0) - 1);
    delete comment.userReactions[currentUserId];
  } else {
    if (userCurrentReaction) {
      const oldKey = userCurrentReaction === "like" ? "like_count" : "dislike_count";
      comment[oldKey] = Math.max(0, (comment[oldKey] || 0) - 1);
    }

    const newKey = reaction === "like" ? "like_count" : "dislike_count";
    comment[newKey] = (comment[newKey] || 0) + 1;
    comment.userReactions[currentUserId] = reaction;
  }

  writeStorage(STORAGE_KEYS.comments, nextComments);
  return { ok: true, message: "Reaction thành công.", comment: normalizeComment(comment) };
};

export const deleteComment = (commentId) => {
  const currentUserId = getCurrentUserId();
  if (!currentUserId) return { ok: false, message: "Bạn cần đăng nhập." };

  const comments = readStorage(STORAGE_KEYS.comments, mockData.comments);
  const targetId = Number(commentId);
  const idsToDelete = new Set([targetId]);

  let changed = true;
  while (changed) {
    changed = false;
    comments.forEach((comment) => {
      if (idsToDelete.has(Number(comment.parent_comment_id)) && !idsToDelete.has(comment.comment_id)) {
        idsToDelete.add(comment.comment_id);
        changed = true;
      }
    });
  }

  const nextComments = comments.filter((comment) => !idsToDelete.has(comment.comment_id));
  writeStorage(STORAGE_KEYS.comments, nextComments);
  return { ok: true, message: "Xóa bình luận thành công.", comments: nextComments };
}

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
