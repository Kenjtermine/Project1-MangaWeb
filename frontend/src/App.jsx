import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Login from "./pages/authentication/Login";
import Register from "./pages/authentication/Register";
import MainLayout from "./layouts/MainLayOut";
import SearchPage from "./pages/searchtable/SearchPage";
import AddComic from './pages/admin/AddComic';
import AddChapter from "./pages/admin/AddChapter";
import Nofitication from "./pages/nofitication/Nofitication";
import Profile from "./pages/profile/Profile";
import Browse from "./pages/browse/Browse";
import AboutUs from "./pages/aboutus/AboutUs";
import MyFavorites from "./pages/library/MyFavorite";
import MyHistory from "./pages/library/MyHistory";
import Ranking from "./pages/ranking/Ranking";
import MangaDetail from "./pages/manga/MangaDetail";
import ChapterReader from "./pages/manga/ChapterReader";

import CreatorDashboard from "./pages/admin/CreatorDashboard"; 
import AdminLayout from "./layouts/AdminLayout";
import CommentManager from "./pages/admin/CommentManager";

import Sandbox from "./pages/Sandbox"; // Import trang sandbox để test component mới

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Homepage />} />
          <Route path="/search" element={<SearchPage mode="search" />} />
          <Route path="/genre/:genreId" element={<SearchPage mode="genre" />} />
          <Route path="/manga/:mangaId" element={<MangaDetail />} />
          <Route path="/manga/:mangaId/chapter/:chapterId" element={<ChapterReader />} />
          <Route path="/browse" element={<Browse />} />
          <Route path="/about" element={<AboutUs />} />
          <Route path="/ranking" element={<Ranking />} />
          <Route path="/notifications" element={<Nofitication />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/my-list" element={<MyFavorites />} />
          <Route path="/my-fav" element={<MyFavorites />} />
          <Route path="/history" element={<MyHistory />} />
          <Route path="/studio" element={<CreatorDashboard />} />
          <Route path="/studio/add-comic" element={<AddComic />} />
          <Route path="/studio/add-chapter" element={<AddChapter />} /> 
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        

        {/* Route sandbox để test component mới, xem hiển thị hay gì đó cứ bỏ vào đây, ta sẽ xóa route này khi xong project */}
        <Route path="/sandbox" element={<Sandbox />} />

        <Route path ="/admin" element={<AdminLayout/>}>
          <Route path="comments" element={<CommentManager />} />
          {/* Các route quản trị khác sẽ được thêm vào đây */}
        
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
