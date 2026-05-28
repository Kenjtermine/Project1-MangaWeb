-- PostgreSQL schema for MangaWeb
-- Run with:
--   psql -U postgres -f backend/database/schema.sql
--
-- Note:
-- - This script drops and recreates DB for local development.
-- - For production, use migration files instead of DROP DATABASE.

\set ON_ERROR_STOP on

DROP DATABASE IF EXISTS mangaweb;
CREATE DATABASE mangaweb;
\connect mangaweb;

-- =========================================================
-- MODULE 0: ENUM TYPES
-- =========================================================

CREATE TYPE user_gender AS ENUM ('male', 'female', 'other');
CREATE TYPE user_role AS ENUM ('admin', 'user', 'uploader');
CREATE TYPE manga_status AS ENUM ('ongoing', 'completed', 'hiatus', 'cancelled');
CREATE TYPE library_status AS ENUM ('following', 'completed', 'dropped', 'plan_to_read');
CREATE TYPE reaction_type AS ENUM ('like', 'dislike');

-- =========================================================
-- MODULE 1: USERS & AUTH
-- =========================================================
-- Purpose:
-- - Store account/auth profile data
-- - Support role, banned status, avatar, timestamps

CREATE TABLE users (
  user_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_name VARCHAR(50) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  user_password VARCHAR(255) NOT NULL,
  user_avatar TEXT,
  user_gender user_gender DEFAULT 'other',
  user_role user_role NOT NULL DEFAULT 'user',
  is_banned BOOLEAN NOT NULL DEFAULT FALSE,
  refresh_token TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT chk_users_name_len CHECK (char_length(trim(user_name)) >= 3),
  CONSTRAINT chk_users_email_at CHECK (position('@' IN user_email) > 1)
);

-- Case-insensitive uniqueness for username/email
CREATE UNIQUE INDEX uq_users_name_lower ON users (lower(user_name));
CREATE UNIQUE INDEX uq_users_email_lower ON users (lower(user_email));

-- =========================================================
-- MODULE 2: CONTENT CORE (MANGA / CHAPTER / PAGE / GENRE)
-- =========================================================
-- Purpose:
-- - Main manga content structure
-- - Chapters and pages for reading
-- - Genre relation as many-to-many

CREATE TABLE manga (
  manga_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  manga_title VARCHAR(255) NOT NULL,
  manga_slug VARCHAR(255) NOT NULL,
  manga_author VARCHAR(255),
  manga_summary TEXT,
  manga_cover_image TEXT,
  manga_status manga_status NOT NULL DEFAULT 'ongoing',
  publish_year INT CHECK (publish_year BETWEEN 1900 AND 2100),
  avg_rating NUMERIC(3,2) NOT NULL DEFAULT 0 CHECK (avg_rating >= 0 AND avg_rating <= 5),
  rating_count INT NOT NULL DEFAULT 0 CHECK (rating_count >= 0),
  total_views BIGINT NOT NULL DEFAULT 0 CHECK (total_views >= 0),
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE UNIQUE INDEX uq_manga_slug ON manga (manga_slug);
CREATE INDEX idx_manga_status ON manga (manga_status);
CREATE INDEX idx_manga_created_at ON manga (created_at DESC);

CREATE TABLE chapters (
  chapter_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  manga_id BIGINT NOT NULL REFERENCES manga(manga_id) ON DELETE CASCADE,
  chapter_number NUMERIC(8,2) NOT NULL CHECK (chapter_number > 0),
  chapter_title VARCHAR(255),
  chapter_slug VARCHAR(255) NOT NULL,
  view_count BIGINT NOT NULL DEFAULT 0 CHECK (view_count >= 0),
  published_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_chapters_manga_number UNIQUE (manga_id, chapter_number),
  CONSTRAINT uq_chapters_manga_slug UNIQUE (manga_id, chapter_slug)
);

CREATE INDEX idx_chapters_manga_id ON chapters (manga_id);
CREATE INDEX idx_chapters_published_at ON chapters (published_at DESC);

CREATE TABLE pages (
  page_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  chapter_id BIGINT NOT NULL REFERENCES chapters(chapter_id) ON DELETE CASCADE,
  page_number INT NOT NULL CHECK (page_number > 0),
  image_url TEXT NOT NULL,
  image_width INT CHECK (image_width IS NULL OR image_width > 0),
  image_height INT CHECK (image_height IS NULL OR image_height > 0),
  CONSTRAINT uq_pages_chapter_page UNIQUE (chapter_id, page_number)
);

CREATE INDEX idx_pages_chapter_id ON pages (chapter_id);

CREATE TABLE genres (
  genre_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  genre_name VARCHAR(100) NOT NULL UNIQUE,
  genre_description TEXT
);

CREATE TABLE manga_genres (
  manga_id BIGINT NOT NULL REFERENCES manga(manga_id) ON DELETE CASCADE,
  genre_id BIGINT NOT NULL REFERENCES genres(genre_id) ON DELETE CASCADE,
  PRIMARY KEY (manga_id, genre_id)
);

CREATE INDEX idx_manga_genres_genre_id ON manga_genres (genre_id);

-- =========================================================
-- MODULE 3: COMMUNITY (COMMENTS + REACTIONS + RATINGS)
-- =========================================================
-- Purpose:
-- - Chapter comment thread with replies
-- - Per-user comment reaction
-- - Per-user manga rating for ranking

CREATE TABLE comments (
  comment_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  chapter_id BIGINT NOT NULL REFERENCES chapters(chapter_id) ON DELETE CASCADE,
  user_id BIGINT REFERENCES users(user_id) ON DELETE SET NULL,
  parent_comment_id BIGINT REFERENCES comments(comment_id) ON DELETE CASCADE,
  root_comment_id BIGINT REFERENCES comments(comment_id) ON DELETE CASCADE,
  content TEXT NOT NULL CHECK (char_length(trim(content)) > 0),
  like_count INT NOT NULL DEFAULT 0 CHECK (like_count >= 0),
  dislike_count INT NOT NULL DEFAULT 0 CHECK (dislike_count >= 0),
  is_deleted BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_comments_chapter_parent_created
  ON comments (chapter_id, parent_comment_id, created_at DESC);
CREATE INDEX idx_comments_root_created
  ON comments (root_comment_id, created_at DESC);
CREATE INDEX idx_comments_user_id ON comments (user_id);

CREATE TABLE comment_reactions (
  user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  comment_id BIGINT NOT NULL REFERENCES comments(comment_id) ON DELETE CASCADE,
  reaction reaction_type NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, comment_id)
);

CREATE INDEX idx_comment_reactions_comment_id ON comment_reactions (comment_id);

CREATE TABLE ratings (
  user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  manga_id BIGINT NOT NULL REFERENCES manga(manga_id) ON DELETE CASCADE,
  score SMALLINT NOT NULL CHECK (score BETWEEN 1 AND 5),
  review_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, manga_id)
);

CREATE INDEX idx_ratings_manga_score ON ratings (manga_id, score);

CREATE TABLE notifications (
  -- a ex for keep it simple, stupid, no need 3 type just for a simple notification system
  notification_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  
  title VARCHAR(255) NOT NULL,
  content TEXT NOT NULL,
  is_read BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);
-- =========================================================
-- MODULE 4: PERSONALIZATION (FAVORITE / LIBRARY / HISTORY)
-- =========================================================
-- Purpose:
-- - Store private user-personalized data
-- - Favorite list, reading library state, continue reading

CREATE TABLE user_favorites (
  user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  manga_id BIGINT NOT NULL REFERENCES manga(manga_id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, manga_id)
);

CREATE INDEX idx_user_favorites_manga_id ON user_favorites (manga_id);

CREATE TABLE user_library (
  user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  manga_id BIGINT NOT NULL REFERENCES manga(manga_id) ON DELETE CASCADE,
  status library_status NOT NULL DEFAULT 'following',
  last_chapter_id BIGINT REFERENCES chapters(chapter_id) ON DELETE SET NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (user_id, manga_id)
);

CREATE INDEX idx_user_library_status ON user_library (user_id, status);

CREATE TABLE reading_history (
  history_id BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,
  user_id BIGINT NOT NULL REFERENCES users(user_id) ON DELETE CASCADE,
  manga_id BIGINT NOT NULL REFERENCES manga(manga_id) ON DELETE CASCADE,
  chapter_id BIGINT NOT NULL REFERENCES chapters(chapter_id) ON DELETE CASCADE,
  page_number INT NOT NULL DEFAULT 1 CHECK (page_number > 0),
  progress_percent NUMERIC(5,2) NOT NULL DEFAULT 0 CHECK (progress_percent >= 0 AND progress_percent <= 100),
  last_read_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  created_at TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT uq_reading_history_user_chapter UNIQUE (user_id, chapter_id)
);

CREATE INDEX idx_reading_history_user_last_read
  ON reading_history (user_id, last_read_at DESC);
CREATE INDEX idx_reading_history_user_manga
  ON reading_history (user_id, manga_id, last_read_at DESC);

-- =========================================================
-- MODULE 5: RANKING SUPPORT (DAILY VIEWS)
-- =========================================================
-- Purpose:
-- - Aggregate daily views to compute top day/week/month

CREATE TABLE manga_daily_views (
  view_date DATE NOT NULL,
  manga_id BIGINT NOT NULL REFERENCES manga(manga_id) ON DELETE CASCADE,
  view_count BIGINT NOT NULL DEFAULT 0 CHECK (view_count >= 0),
  PRIMARY KEY (view_date, manga_id)
);

CREATE INDEX idx_manga_daily_views_manga_date
  ON manga_daily_views (manga_id, view_date DESC);

-- =========================================================
-- MODULE 6: HELPERS (TRIGGERS FOR updated_at + rating cache)
-- =========================================================

CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_users_set_updated_at
BEFORE UPDATE ON users
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_manga_set_updated_at
BEFORE UPDATE ON manga
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_chapters_set_updated_at
BEFORE UPDATE ON chapters
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_comments_set_updated_at
BEFORE UPDATE ON comments
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_ratings_set_updated_at
BEFORE UPDATE ON ratings
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE TRIGGER trg_user_library_set_updated_at
BEFORE UPDATE ON user_library
FOR EACH ROW EXECUTE FUNCTION set_updated_at();

CREATE OR REPLACE FUNCTION refresh_manga_rating_cache(target_manga_id BIGINT)
RETURNS VOID AS $$
BEGIN
  UPDATE manga m
  SET
    avg_rating = COALESCE(r.avg_score, 0),
    rating_count = COALESCE(r.total_count, 0)
  FROM (
    SELECT
      manga_id,
      ROUND(AVG(score)::numeric, 2) AS avg_score,
      COUNT(*)::int AS total_count
    FROM ratings
    WHERE manga_id = target_manga_id
    GROUP BY manga_id
  ) r
  WHERE m.manga_id = r.manga_id;

  -- If no rows in ratings, force rating cache to zero.
  UPDATE manga
  SET avg_rating = 0, rating_count = 0
  WHERE manga_id = target_manga_id
    AND NOT EXISTS (SELECT 1 FROM ratings WHERE manga_id = target_manga_id);
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION trg_refresh_manga_rating()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'DELETE' THEN
    PERFORM refresh_manga_rating_cache(OLD.manga_id);
    RETURN OLD;
  END IF;

  PERFORM refresh_manga_rating_cache(NEW.manga_id);

  IF TG_OP = 'UPDATE' AND OLD.manga_id <> NEW.manga_id THEN
    PERFORM refresh_manga_rating_cache(OLD.manga_id);
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_ratings_refresh_manga_cache
AFTER INSERT OR UPDATE OR DELETE ON ratings
FOR EACH ROW EXECUTE FUNCTION trg_refresh_manga_rating();
