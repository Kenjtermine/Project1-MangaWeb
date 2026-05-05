import mockData from "./mockData.json";

const STORAGE_KEYS = {
  users: "mockUsers",
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

export const removeFavoriteManga = (mangaId) => {
  const userId = getCurrentUserId();
  if (!userId) return { ok: false, message: "Bạn cần đăng nhập." };

  const targetId = Number(mangaId);
  const favorites = getFavorites();
  
  // Chỉ lọc bỏ những record trùng với userId và mangaId hiện tại
  const nextFavorites = favorites.filter(
    (favorite) => !(favorite.user_id === userId && favorite.manga_id === targetId)
  );

  writeStorage(STORAGE_KEYS.favorites, nextFavorites);
  
  return {
    ok: true,
    isFavorite: false, // Chắc chắn đã bị xóa
    message: "Đã xóa khỏi danh sách yêu thích.",
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

//* COMMENT SECTION *//

const normalizeComment = (comment) => {
  const user = getUsers().find((item) => item.id === Number(comment.user_id));

  return {
    ...comment,
    user: user?.username || comment.user || "Người dùng ẩn danh",
    avatar: user?.avatar || comment.avatar || "https://i.imgur.com/1n7f1bF.jpg",
    timestamp: comment.created_at || comment.timestamp,
    like_count: comment.like_count || 0,
    dislike_count: comment.dislike_count || 0,
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
  const user = getUserLogin();
  const text = content?.trim();

  if (!user) {
    return { ok: false, message: "Bạn cần đăng nhập để bình luận." };
  }

  if (!text) {
    return { ok: false, message: "Nội dung bình luận không được để trống." };
  }

  if (text.length > 1000) {
    return { ok: false, message: "Bình luận tối đa 1000 ký tự." };
  }

  const comments = readStorage(STORAGE_KEYS.comments, mockData.comments);
  const nextId = Math.max(...comments.map((comment) => Number(comment.comment_id) || 0), 0) + 1;
  const createdAt = new Date().toISOString();
  const newComment = {
    comment_id: nextId,
    user_id: Number(user.id),
    chapter_id: Number(chapterId),
    parent_comment_id: parentCommentId ? Number(parentCommentId) : null,
    root_comment_id: rootCommentId ? Number(rootCommentId) : parentCommentId ? Number(parentCommentId) : nextId,
    content: text,
    like_count: 0,
    dislike_count: 0,
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
  const comment = comments.find((item) => item.comment_id === Number(commentId));

  if (!comment) return { ok: false, message: "Bình luận không tồn tại." };

  // Initialize userReactions nếu chưa có
  if (!comment.userReactions) {
    comment.userReactions = {};
  }

  const userCurrentReaction = comment.userReactions[currentUserId]; // lấy reaction hiện tại

  if (userCurrentReaction === reaction) {
    // 1. HỦY REACTION HIỆN TẠI (Bấm Like thêm 1 lần nữa để hủy Like)
    const countKey = reaction === "like" ? "like_count" : "dislike_count";
    comment[countKey] = Math.max(0, comment[countKey] - 1);
    delete comment.userReactions[currentUserId];
  } else {
        // 2. CHUYỂN REACTION hoặc THÊM REACTION MỚI
        
        // Trừ đi reaction cũ (Nếu trước đó đã có reaction)
        if (userCurrentReaction) {
            const oldKey = userCurrentReaction === "like" ? "like_count" : "dislike_count";
            comment[oldKey] = Math.max(0, comment[oldKey] - 1);
        }

        // Cộng reaction mới vào
        const newKey = reaction === "like" ? "like_count" : "dislike_count";
        comment[newKey] += 1;
        
        // Cập nhật lại lịch sử reaction của user
        comment.userReactions[currentUserId] = reaction;
  }

  writeStorage(STORAGE_KEYS.comments, comments);
  return { ok: true, message: `Binh luan ${reaction} thanh cong`, comment };
};

export const deleteComment = (commentId) => {
  const comments = readStorage(STORAGE_KEYS.comments, mockData.comments);
  const nextComments = comments.filter((comment) => comment.comment_id !== Number(commentId));
  writeStorage(STORAGE_KEYS.comments, nextComments);
  return { ok: true, message: "Xóa bình luận thành công", comments: nextComments };
};