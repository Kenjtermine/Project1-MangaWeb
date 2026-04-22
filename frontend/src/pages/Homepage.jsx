import React from "react";
import Header from "../components/header/Header";
import Sidebar from "../components/sidebar/Sidebar";
import Footer from "../components/footer/Footer";

import HeroCarousel from "../components/hero-carousel/HeroCarousel";

const featuredManga = [
  {
    id: 1,
    title: "One Piece",
    cover: "https://i.imgur.com/1n7f1bF.jpg",
    description: "Câu chuyện về Luffy và hành trình trở thành Vua Hải Tặc.",
  },
  {
    id: 2,
    title: "Naruto",
    cover: "https://i.imgur.com/2n7f1bF.jpg",
    description: "Hành trình trở thành Hokage của cậu bé Naruto.",
  },
  {
    id: 3,
    title: "Attack on Titan",
    cover: "https://i.imgur.com/3n7f1bF.jpg",
    description: "Cuộc chiến sinh tồn giữa loài người và Titan.",
  },
  {
    id: 4,
    title: "Demon Slayer",
    cover: "https://i.imgur.com/4n7f1bF.jpg",
    description: "Cuộc hành trình tiêu diệt quỷ của Tanjiro.",
  },
];

const Homepage = () => {
  return (
        <div className="flex-col">
            {/* Hero Carousel */}
            <div className="flex-1 flex flex-col bg-neutral-900 text-white p-8">
            <h2 className="text-2xl font-semibold mb-6 text-white-700">Truyện hot hôm nay</h2>
            <HeroCarousel />
            </div>
            {/* Main Content */}
            <main className="flex-1">
            <section>
                <h2 className="text-2xl font-semibold mb-6 text-indigo-700">Truyện mới cập nhật</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {featuredManga.map((manga) => (
                    <div
                    key={manga.id}
                    className="bg-white rounded-lg shadow hover:shadow-lg transition overflow-hidden flex flex-col"
                    >
                    <img
                        src={manga.cover}
                        alt={manga.title}
                        className="h-48 w-full object-cover"
                    />
                    <div className="p-4 flex-1 flex flex-col">
                        <h3 className="text-lg font-bold mb-2 text-gray-800">{manga.title}</h3>
                        <p className="text-gray-600 flex-1">{manga.description}</p>
                        <button className="mt-4 bg-indigo-500 hover:bg-indigo-600 text-white py-2 px-4 rounded transition">Đọc ngay</button>
                    </div>
                    </div>
                ))}
                </div>
            </section>
            </main>
        </div>
  );
};

export default Homepage;
