import mockData from "./mockData.json";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

const STORAGE_KEYS = {
  authToken: "authToken",
  refreshToken: "refreshToken",
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
  const { skipAuthRefresh = false, headers: optionHeaders = {}, ...fetchOptions } = options;
  const token = getAuthToken();
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout
  
  try {
    const response = await fetch(`${API_BASE_URL}${path}`, {
      ...fetchOptions,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...optionHeaders,
      },
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const canRefresh = !skipAuthRefresh && [401, 403].includes(response.status) && getRefreshToken();
      if (canRefresh) {
        const newAccessToken = await refreshStoredAccessToken().catch(() => null);
        if (newAccessToken) {
          const retryResponse = await fetch(`${API_BASE_URL}${path}`, {
            ...fetchOptions,
            signal: controller.signal,
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${newAccessToken}`,
              ...optionHeaders,
            },
          });

          const retryData = await retryResponse.json().catch(() => ({}));
          if (!retryResponse.ok) {
            throw new Error(retryData.message || "Request failed");
          }

          return retryData;
        }
      }

      throw new Error(data.message || "Request failed");
    }

    return data;
  } finally {
    clearTimeout(timeoutId);
  }
};

const getFavorites = () => readStorage(STORAGE_KEYS.favorites, mockData.user_favorites);
const getHistory = () => readStorage(STORAGE_KEYS.history, mockData.reading_history);
const getNotifications = () => readStorage(STORAGE_KEYS.notifications, mockData.notifications);

export const getAuthToken = () => localStorage.getItem(STORAGE_KEYS.authToken);
export const getRefreshToken = () => localStorage.getItem(STORAGE_KEYS.refreshToken);

export const getCurrentUser = () => readStorage(STORAGE_KEYS.currentUser, null);

export const getCurrentUserId = () => {
  const user = getCurrentUser();
  return user?.user_id ? Number(user.user_id) : null;
};

export const logoutUser = () => {
  removeStorage(STORAGE_KEYS.authToken);
  removeStorage(STORAGE_KEYS.refreshToken);
  removeStorage(STORAGE_KEYS.currentUser);
};

const saveAuth = ({ user, token, accessToken, refreshToken }) => {
  const nextAccessToken = accessToken || token;
  if (nextAccessToken) localStorage.setItem(STORAGE_KEYS.authToken, nextAccessToken);
  if (refreshToken) localStorage.setItem(STORAGE_KEYS.refreshToken, refreshToken);
  if (user) writeStorage(STORAGE_KEYS.currentUser, user);
  return user || null;
};

const refreshStoredAccessToken = async () => {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;

  const data = await request("/api/auth/refresh-token", {
    method: "POST",
    body: JSON.stringify({ refreshToken }),
    skipAuthRefresh: true,
  });

  if (!data.accessToken) return null;
  localStorage.setItem(STORAGE_KEYS.authToken, data.accessToken);
  return data.accessToken;
};

export const loginUser = async ({ username, email, password }) => {
  const loginName = username || email;

  try {
    const data = await request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify({ username: loginName, email: loginName, password }),
    });

    const user = saveAuth({ user: data.user, accessToken: data.accessToken, refreshToken: data.refreshToken });
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

    const user = saveAuth({ user: data.user, accessToken: data.accessToken, refreshToken: data.refreshToken });
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

// Real API functions for notifications
export const getUserNotification = async () => {
  try {
    const data = await request("/api/nofitication/notifications", {
      method: "GET",
    });
    return data.data || [];
  } catch (error) {
    console.error("Failed to fetch notifications:", error);
    // Fallback to mock data
    const userId = getCurrentUserId();
    if (!userId) return [];
    return getNotifications()
      .filter((noti) => noti.user_id === userId)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
  }
};

export const markAllNotificationsRead = async () => {
  try {
    const data = await request("/api/nofitication/notifications/all-read", {
      method: "POST",
    });
    return data.data || [];
  } catch (error) {
    console.error("Failed to mark all as read:", error);
    // Fallback to mock
    const userId = getCurrentUserId();
    if (!userId) return [];
    const nextNotifications = getNotifications().map((noti) =>
      noti.user_id === userId ? { ...noti, is_read: true } : noti
    );
    writeStorage(STORAGE_KEYS.notifications, nextNotifications);
    return getUserNotification();
  }
};

export const markNotificationAsRead = async (notificationId) => {
  try {
    const data = await request("/api/nofitication/notifications/read", {
      method: "POST",
      body: JSON.stringify({ notificationId }),
    });
    return data.data || null;
  } catch (error) {
    console.error("Failed to mark notification as read:", error);
    throw error;
  }
};

export const getUnreadNotificationCount = async () => {
  try {
    const data = await request("/api/nofitication/notifications/unread-count", {
      method: "GET",
    });
    return data.data?.count || 0;
  } catch (error) {
    console.error("Failed to fetch unread count:", error);
    return 0;
  }
};

export const clearUserNotifications = async () => {
  try {
    const data = await request("/api/nofitication/notifications/delete-readed", {
      method: "DELETE",
    });
    return data.data || null;
  } catch (error) {
    console.error("Failed to clear notifications:", error);
    throw error;
  }
};

// Favorite APIs
export const getUserFavorites = async () => {
  const userId = getCurrentUserId();
  if (!userId) return [];

  try {
    const data = await request('/api/favorite/get-user-favorites', {
      method: 'GET'
    });
    return data.favorites || [];
  } catch (error) {
    console.error('Lỗi lấy danh sách yêu thích:', error);
    return [];
  }
};

export const isFavoriteManga = async (mangaId) => {
  const userId = getCurrentUserId();
  if (!userId) return false;

  try {
    const data = await request(`/api/favorite/check-is-favorited?mangaId=${Number(mangaId)}`, {
      method: 'GET'
    });
    return data.isFavorited;
  } catch (error) {
    console.error('Lỗi kiểm tra favorite:', error);
    return false;
  }
};

export const toggleFavoriteManga = async (mangaId) => {
  const userId = getCurrentUserId();
  if (!userId) return { ok: false, isFavorite: false, message: "Bạn cần đăng nhập để thêm yêu thích." };

  try {
    const data = await request('/api/favorite/toggle-favorite', {
      method: 'POST',
      body: JSON.stringify({ mangaId: Number(mangaId) })
    });

    return {
      ok: true,
      isFavorite: data.isFavorited,
      message: data.message
    };
  } catch (error) {
    return { ok: false, isFavorite: false, message: error.message || "Lỗi khi toggle yêu thích." };
  }
};

export const removeFavoriteManga = async (mangaId) => {
  const userId = getCurrentUserId();
  if (!userId) return { ok: false, message: "Bạn cần đăng nhập." };

  try {
    const data = await request('/api/favorite/toggle-favorite', {
      method: 'POST',
      body: JSON.stringify({ mangaId: Number(mangaId) })
    });

    return { ok: true, isFavorite: false, message: data.message };
  } catch (error) {
    return { ok: false, message: error.message || "Lỗi khi xóa yêu thích." };
  }
};

export const getTotalFavorites = async (mangaId) => {
  try {
    const data = await request(`/api/favorite/get-total-favorites/${mangaId}`, {
      method: 'GET'
    });
    return data.totalFavorites;
  } catch (error) {
    console.error('Lỗi lấy tổng favorite:', error);
    return 0;
  }
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

const getStoredComments = () => readStorage(STORAGE_KEYS.comments, []);

const getMockCommentIds = () => new Set(mockData.comments.map((comment) => Number(comment.comment_id)));

const mergeStoredComment = (mockComment, storedComment) => {
  if (!storedComment) return mockComment;

  return {
    ...mockComment,
    like_count: storedComment.like_count ?? mockComment.like_count,
    dislike_count: storedComment.dislike_count ?? mockComment.dislike_count,
    userReactions: storedComment.userReactions || mockComment.userReactions || {},
    is_deleted: storedComment.is_deleted ?? mockComment.is_deleted,
    updated_at: storedComment.updated_at || mockComment.updated_at,
  };
};

const getMergedComments = () => {
  const mockCommentIds = getMockCommentIds();
  const storedComments = getStoredComments().filter(Boolean);
  const storedById = new Map(storedComments.map((comment) => [Number(comment.comment_id), comment]));

  const mergedMockComments = mockData.comments.map((comment) =>
    mergeStoredComment(comment, storedById.get(Number(comment.comment_id)))
  );
  const userComments = storedComments.filter((comment) => comment.is_local || !mockCommentIds.has(Number(comment.comment_id)));

  return [...mergedMockComments, ...userComments].filter((comment) => !comment.is_deleted);
};

const saveStoredComments = (comments) => {
  const mockCommentIds = getMockCommentIds();
  const mockCommentById = new Map(mockData.comments.map((comment) => [Number(comment.comment_id), comment]));
  const storedComments = comments.filter((comment) => {
    const isMockComment = mockCommentIds.has(Number(comment.comment_id));
    if (comment.is_local || !isMockComment) return true;

    const mockComment = mockCommentById.get(Number(comment.comment_id));
    const hasMockOverride =
      comment.is_deleted ||
      Object.keys(comment.userReactions || {}).length > 0 ||
      Number(comment.like_count || 0) !== Number(mockComment?.like_count || 0) ||
      Number(comment.dislike_count || 0) !== Number(mockComment?.dislike_count || 0);

    return hasMockOverride;
  });

  writeStorage(STORAGE_KEYS.comments, storedComments);
};

export const getComments = async (chapterId = 1) => {
  // use api real and db data
  const comments = await request(`/api/comments/get-comments?chapterId=${chapterId}`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });

  return comments.comments.map(normalizeComment).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
};

export const submitComment = async ({ chapterId, content, parentCommentId = null, rootCommentId = null }) => {
  try {
    const token = getAuthToken();
    
    if (!token) return { ok: false, message: "Bạn cần đăng nhập để bình luận." };
    if (!content?.trim()) return { ok: false, message: "Nội dung bình luận không được để trống." };

    // Bắn request xuống Backend Node.js
    const data = await request("/api/comments/create-comment", {
      method: "POST",
      body: JSON.stringify({
        chapterId,
        content,
        parentCommentId,
        rootCommentId
      }),
    });

    // Trả kết quả về cho CommentsSection.jsx xử lý (hiện thông báo, load lại bình luận)
    return {
      ok: true,
      message: "Đã gửi bình luận thành công!",
      comment: data.comment, // Trả về object comment vừa được tạo từ DB
    };

  } catch (error) {
    return { ok: false, message: error.message || "Có lỗi xảy ra khi gửi bình luận." };
  }
};

export const toggleReaction = async ({ commentId, reaction }) => {
  try {
    const token = getAuthToken();
    if (!token) return { ok: false, message: "Bạn cần đăng nhập để thả biểu cảm." };

    // Bắn thẳng hành động (reaction) xuống Backend
    const data = await request("/api/comments/reaction", {
      method: "POST",
      body: JSON.stringify({ 
        commentId: commentId,
        reactionType: reaction // 'like' hoặc 'dislike'
      }),
    });

    return { 
        ok: true, 
        message: "Thao tác thành công!", 
        comment: data.comment // Data mới nhất từ DB
    };

  } catch (error) {
    return { ok: false, message: error.message || "Lỗi khi reaction." };
  }
};

// Rating APIs
export const getRatingStats = async (mangaId) => {
  try {
    const data = await request(`/api/rating/get-rating-stats/${mangaId}`, {
      method: 'GET'
    });
    return {
      avg_rating: data.avg_rating || 0,
      rating_count: data.rating_count || 0
    };
  } catch (error) {
    console.error('Lỗi lấy thống kê rating:', error);
    return {
      avg_rating: 0,
      rating_count: 0
    };
  }
};

export const submitRating = async (mangaId, ratingScore) => {
  const userId = getCurrentUserId();
  if (!userId) return { ok: false, message: "Bạn cần đăng nhập để đánh giá." };

  try {
    const data = await request('/api/rating/submit-rating', {
      method: 'POST',
      body: JSON.stringify({ mangaId: Number(mangaId), rating_score: Number(ratingScore) })
    });

    return {
      ok: true,
      message: data.message || "Đã gửi đánh giá xếp hạng."
    };
  } catch (error) {
    return { ok: false, message: error.message || "Lỗi khi gửi đánh giá." };
  }
};

export const deleteComment = async (commentId) => {
  try {
    const token = getAuthToken();
    if (!token) return { ok: false, message: "Bạn cần đăng nhập." };
    
    // Bắn request xuống Backend Node.js
    await request("/api/comments/delete-comment", {
      method: "POST",
      body: JSON.stringify({ commentId }),
    });

    return { ok: true, message: "Xóa bình luận thành công." };
  }
  catch (error) {
    return { ok: false, message: error.message || "Có lỗi xảy ra khi xóa bình luận." };
  }
}

export const createNewManga = async (payload) => {
  try {
    const response = await fetch(`${API_BASE_URL}/api/mangas`, {
      method: 'POST',
      body: payload, 
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Lỗi server');
    }

    return { 
      ok: true, 
      message: "Thêm truyện thành công!", 
      manga: data.manga 
    };
  } catch (error) {
    console.error("Lỗi khi gọi API createNewManga:", error);
    return { ok: false, message: error.message };
  }
};
// frontend/src/data/api.js

export const becomeUploader = async () => {
  // const userId = getCurrentUserId();
  // if (!userId) return { ok: false, message: "Bạn cần đăng nhập trước." };

  // const users = getUsers();
  // const nextUsers = users.map((user) =>
  //   user.id === userId ? { ...user, is_poster: true } : user
  // );

  try {
    const user = await getCurrentUser();
    if (!user) return { ok: false, message: "Bạn cần đăng nhập trước." };
    if (user.user_role === "admin") return { ok: false, message: "Admin không thể trở thành Uploader." };
    if (user.user_role === "poster") return { ok: false, message: "Bản đã trở thành Uploader." };
    
    const becomesUploader = await request("/api/auth/update-user-access", {
      method: "POST",
      body: JSON.stringify({ userRole: "poster" }),
    });

    const updatedUser = becomesUploader.user || { ...user, user_role: "poster" };
    writeStorage(STORAGE_KEYS.currentUser, updatedUser);
    
    return { ok: true, message: "Chúc mừng! Bạn đã trở thành Uploader." };
  } catch (error) {
    return { ok: false, message: error.message || "Đăng nhập thất bại." };
  }
};
