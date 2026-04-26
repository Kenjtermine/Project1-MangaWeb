import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getUserLogin } from "../../data/api"; // Import hàm lấy thông tin người dùng hiện tại

const Header = () => {
    const [placeholder, setPlaceholder] = useState("Tìm kiếm");
    const [searchValue, setSearchValue] = useState("");
    const navigate = useNavigate();

    const user = getUserLogin(); // Lấy thông tin người dùng hiện tại

    const defaultPlaceholder = "Tìm kiếm";
    const activePlaceholder = "Hôm nay bạn muốn tìm gì nhỉ?";

    const handleSearchClick = () => {
        setPlaceholder(activePlaceholder);
    };

    const handleSearchBlur = (event) => {
        if (!event.target.value.trim()) {
            setPlaceholder(defaultPlaceholder);
        }
    };

    const handleSearchChange = (e) => {
        setSearchValue(e.target.value);
    };

    const handleSearchSubmit = (e) => {
        if (e.key === "Enter" || e.type === "click") {
            if (searchValue.trim()) {
                navigate(`/search?keyword=${encodeURIComponent(searchValue)}`);
                setSearchValue("");
                setPlaceholder(defaultPlaceholder);
            }
        }
    };

    const handleLogOut = () => {
        localStorage.removeItem("currentUserId"); // Xóa thông tin đăng nhập khỏi localStorage
        window.location.href = "/"; // Chuyển về trang chủ sau khi đăng xuất
    };

	return (
		<header className="bg-white-600 h-24 py-4 shadow">
			<div className="container mx-auto px-4 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-2">
                <div className="flex items-center gap-2">
                    <div className="text-4xl font-bold text-sky-600">MangaWeb</div>
                    <img src="https://i.imgur.com/1n7f1bF.jpg" alt="MangaWeb Logo" className="h-16 w-16 rounded-full" />
                </div>
                </Link>
                {/* Search bar */}
                <div className="flex items-center w-1/2" >
                    <input
                        type="text"
                        placeholder={placeholder}
                        value={searchValue}
                        onChange={handleSearchChange}
                        onClick={handleSearchClick}
                        onBlur={handleSearchBlur}
                        onKeyPress={handleSearchSubmit}
                        className="w-2/3 px-8 py-2 rounded-full text-lg border border-gray-300"
                    />
                    <button 
                        onClick={handleSearchSubmit}
                        className="ml-2 bg-sky-600 hover:bg-sky-700 text-white px-4 py-2 rounded-full transition"
                    >
                        🔍
                    </button>
                    {/* Login and Sign up buttons */}
                    <div className="ml-20 flex items-center">
                        {user ? (
                            <>
                                <Link to="/profile">
                                    <div className="flex flex-row items-center gap-2 pr-8">
                                        <img 
                                            src={user?.avatar || "https://i.imgur.com/1n7f1bF.jpg"} 
                                            alt="Profile" 
                                            className="h-10 w-10 rounded-full"
                                        />
                                        <span className="font-semibold whitespace-nowrap">{user?.username || "User"}</span>
                                    </div>
                                </Link>
                                <button onClick={handleLogOut} className="bg-red-600 hover:bg-red-700 text-white font-semibold w-28 h-10 transition text-base ml-2">
                                    Đăng xuất
                                </button>
                            </>
                        ) : (
                            <>
                                <Link to="/login">
                                    <button className="bg-sky-600 hover:bg-sky-700 text-white font-semibold w-28 h-10 transition text-base">Đăng nhập</button>
                                </Link>
                                <Link to="/register">
                                    <button className="bg-transparent text-black-600 hover:bg-blue-50 font-semibold w-28 h-10 transition text-base ml-2">Đăng kí</button>
                                </Link>
                            </>
                        )}
                    </div>
                </div>
			</div>
		</header>
	);
}

export default Header;
