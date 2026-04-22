import { useState } from "react";
import { useNavigate } from "react-router-dom";
import loginSideImage from "../../assets/Login_side_img.jpg";

const Login = () => {
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState("");
    const [isError, setIsError] = useState(false);
    // const [isLoading, setIsLoading] = useState(false);
    
    const accounts = [
        {id: 1, username: "Kenjtermine", password: "123456789"},
        {id: 2, username: "KhangLe", password: "12345678"},
    ]

    // 2. Hàm cập nhật state khi người dùng gõ phím
    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        // Tự động ẩn thông báo lỗi khi người dùng bắt đầu gõ lại
        if (message) {
            setMessage("");
            setIsError(false);
        }
    };

    // 3. Hàm xử lý logic khi bấm nút Đăng nhập
    const handleSubmit = (e) => {
        e.preventDefault(); // Ngăn trình duyệt tự động reload trang

        // Tìm xem có account nào khớp cả username và password không
        const foundUser = accounts.find(
            (acc) => acc.username === form.username && acc.password === form.password
        );

        if (foundUser) {
            // Đăng nhập đúng
            setIsError(false);
            setMessage("Đăng nhập thành công! Đang chuyển hướng...");
            
            // Giả lập độ trễ của mạng, sau 1.5s sẽ chuyển về trang chủ
            setTimeout(() => {
                navigate("/");
            }, 1500);
        } else {
            // Đăng nhập sai
            setIsError(true);
            setMessage("Sai tên đăng nhập hoặc mật khẩu!");
        }
    }
    return (
        <div className="flex h-screen"> 
            
            {/* Form Container */}
            {/* RESPONSIVE: Chiếm full màn hình trên mobile (w-full), và giảm xuống một nửa (lg:w-1/2) trên màn hình lớn */}
            <div className="bg-white w-full lg:w-1/2 h-full flex justify-center items-center p-6 lg:p-8 relative shadow-md lg:shadow-none z-10">
                
                {/* Nút Back: Chỉnh nhỏ lại một chút trên mobile */}
                <button onClick={() => navigate("/")} className="absolute top-4 left-4 lg:top-6 lg:left-6 flex items-center gap-2 text-gray-500 hover:text-sky-600 transition duration-300 font-medium text-sm lg:text-base">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 lg:h-5 lg:w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                    </svg>
                    Trang chủ
                </button>
                
                {/* RESPONSIVE: Thay w-2/3 bằng w-full và max-w-md để form co giãn mượt mà */}
                <div className="flex flex-col items-center gap-5 w-full max-w-md justify-center">
                    <div className="flex items-center gap-2">
                        <div className="text-3xl lg:text-4xl font-bold text-sky-600">MangaWeb</div>
                        <img src="https://i.imgur.com/1n7f1bF.jpg" alt="MangaWeb Logo" className="h-14 w-14 lg:h-16 lg:w-16 rounded-full shadow-sm" />
                    </div>
                    
                    <h1 className="text-3xl lg:text-4xl font-bold mb-2 text-center">
                        <span className="text-black">Chào mừng</span>
                        <span className="text-sky-600"> trở lại</span>!
                    </h1>
                    <p className="text-base lg:text-lg text-center text-gray-600 mb-4">
                        Khám phá kho truyện tranh phong phú, cập nhật liên tục và hoàn toàn miễn phí.
                    </p>
                    
                    <form onSubmit={handleSubmit} className="flex flex-col gap-4 w-full">
                        <input 
                            type="text"
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            placeholder="Tên đăng nhập" 
                            className="placeholder:text-gray-500 border border-gray-300 rounded px-4 py-3 lg:py-2 focus:outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600 transition"
                            required 
                        />

                        <div className="relative w-full">
                            <input 
                                type={showPassword ? "text" : "password"} 
                                name="password"
                                value={form.password}
                                onChange={handleChange}
                                placeholder="Mật khẩu" 
                                // Thêm pr-10 để chữ không bị đè lên icon con mắt
                                className="w-full placeholder:text-gray-500 border border-gray-300 rounded pl-4 pr-10 py-3 lg:py-2 focus:outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600 transition" 
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-sky-600 transition"
                            >
                                {showPassword ? (
                                    // Icon Mắt mở (đang hiện password)
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                    </svg>
                                ) : (
                                    // Icon Mắt nhắm bị gạch chéo (đang ẩn password)
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                                    </svg>
                                )}
                            </button>
                        </div>
                        
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <input 
                                    type="checkbox" 
                                    id="rememberMe" 
                                    className="w-4 h-4 cursor-pointer accent-sky-600 rounded" 
                                />
                                <label htmlFor="rememberMe" className="text-sm text-gray-700 cursor-pointer select-none">
                                    Ghi nhớ tôi
                                </label>
                            </div>
                            {/* Thêm nút Quên mật khẩu cho chuẩn form */}
                            <a href="#" className="text-sm text-sky-600 hover:underline">Quên mật khẩu?</a>
                        </div>
                        
                        <button type="submit" className="bg-sky-600 text-white font-semibold py-3 lg:py-2 rounded shadow-md hover:bg-sky-700 hover:shadow-lg transition duration-300 ease-in-out">
                            Đăng nhập
                        </button>
                    </form>
                    
                    <p className="text-sm text-gray-600 mt-2">
                        Chưa có tài khoản? <a href="/register" className="text-sky-600 hover:underline font-bold">Đăng ký ngay</a>
                    </p>
                </div>
            </div>
            
            {/* Side Image */}
            {/* RESPONSIVE: Ẩn trên mobile (hidden), chỉ hiện tử màn hình large (lg:block) */}
            <div className="hidden lg:block lg:w-1/2 h-full">
                <img src={loginSideImage} alt="Hình nền MangaWeb" className="h-full w-full object-cover" />
            </div>
            
        </div>
    );
};

export default Login;