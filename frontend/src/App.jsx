import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Login from "./pages/authentication/Login";
import Register from "./pages/authentication/Register";
import MainLayout from "./layouts/MainLayOut";
import SearchPage from "./pages/searchtable/SearchPage";
import Nofitication from "./pages/nofitication/Nofitication";
import Profile from "./pages/profile/Profile";

import Sandbox from "./pages/Sandbox"; // Import trang sandbox để test component mới

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Homepage />} />
          <Route path="/search" element={<SearchPage mode="search" />} />
          <Route path="/genre/:genreId" element={<SearchPage mode="genre" />} />
          <Route path="/notifications" element={<Nofitication />} />
          <Route path="/profile" element={<Profile />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Route sandbox để test component mới, xem hiển thị hay gì đó cứ bỏ vào đây, ta sẽ xóa route này khi xong project */}
        <Route path="/sandbox" element={<Sandbox />} />
      </Routes>
    </Router>
  );
}

export default App;
