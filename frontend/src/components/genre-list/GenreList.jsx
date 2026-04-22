import React from "react";
import {Link} from "react-router-dom";
import mockData from "../../data/mockData.json";

const genres = mockData.genres;

const GenreList = () => {
    return (
        <div className="absolute top-0 left-full ml-2 w-[500px] bg-gray-900 bg-opacity-95 text-gray-300 rounded-md shadow-2xl z-50 p-6">
            
            {/* LƯỚI 3 CỘT (GRID) */}
            <ul className="grid grid-cols-3 gap-y-5 gap-x-4">
                {genres.map((genre) => (
                    <Link to={`/genre/${genre.id}`} key={genre.id}>
                        <li 
                            // Hiệu ứng hover: Chữ sáng lên (text-white)
                            className="text-sm hover:text-white transition-colors duration-200 cursor-pointer"
                        >
                            {genre.name}
                        </li>
                    </Link>
                ))}
            </ul>
            
        </div>
    );
};

export default GenreList;