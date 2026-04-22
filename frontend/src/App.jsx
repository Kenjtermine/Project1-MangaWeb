import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Homepage from "./pages/Homepage";
import Login from "./pages/authentication/Login";
import Register from "./pages/authentication/Register";
import MainLayout from "./layouts/MainLayOut";
import SearchPage from "./pages/searchtable/SearchPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Homepage />} />
          <Route path="/search" element={<SearchPage mode="search" />} />
          <Route path="/genre/:genreId" element={<SearchPage mode="genre" />} />
        </Route>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </Router>
  );
}

export default App;
