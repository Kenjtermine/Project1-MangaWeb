import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import loginSideImage from "../../assets/Login_side_img.jpg";

const TRANSITION_MS = 260;

const Register = () => {
  const navigate = useNavigate();
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    const frame = requestAnimationFrame(() => setIsFormVisible(true));
    return () => cancelAnimationFrame(frame);
  }, []);

  const goHome = () => {
    navigate("/");
  };

  const goLogin = (event) => {
    event.preventDefault();
    setIsFormVisible(false);
    window.setTimeout(() => navigate("/login"), TRANSITION_MS);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
  };

  return (
    <div className="flex h-screen">
      <div className="bg-white w-full lg:w-1/2 h-full flex justify-center items-center p-6 lg:p-8 relative shadow-md lg:shadow-none z-10">
        <button
          type="button"
          onClick={goHome}
          className="absolute top-4 left-4 lg:top-6 lg:left-6 flex items-center gap-2 text-gray-500 hover:text-sky-600 transition duration-300 font-medium text-sm lg:text-base"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 lg:h-5 lg:w-5" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z"
              clipRule="evenodd"
            />
          </svg>
          Trang chủ
        </button>

        <div
          className={`flex flex-col items-center gap-5 w-full max-w-md justify-center transition-all duration-300 ease-out ${
            isFormVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <div className="flex items-center gap-2">
            <div className="text-3xl lg:text-4xl font-bold text-sky-600">MangaWeb</div>
            <img src="https://i.imgur.com/1n7f1bF.jpg" alt="MangaWeb Logo" className="h-14 w-14 lg:h-16 lg:w-16 rounded-full shadow-sm" />
          </div>

          <h1 className="text-3xl lg:text-4xl font-bold mb-2 text-center">
            <span className="text-black">Tạo</span>
            <span className="text-sky-600"> tài khoản mới</span>
          </h1>
          <p className="text-base lg:text-lg text-center text-gray-600 mb-4">
            Tham gia MangaWeb để theo dõi bộ truyện yêu thích và nhận cập nhật mới nhất.
          </p>

          <form className="flex flex-col gap-4 w-full" onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Tên người dùng"
              className="placeholder:text-gray-500 border border-gray-300 rounded px-4 py-3 lg:py-2 focus:outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600 transition"
            />
            <input
              type="email"
              placeholder="Email"
              className="placeholder:text-gray-500 border border-gray-300 rounded px-4 py-3 lg:py-2 focus:outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600 transition"
            />
            <input
              type="password"
              placeholder="Mật khẩu"
              className="placeholder:text-gray-500 border border-gray-300 rounded px-4 py-3 lg:py-2 focus:outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600 transition"
            />
            <input
              type="password"
              placeholder="Nhập lại mật khẩu"
              className="placeholder:text-gray-500 border border-gray-300 rounded px-4 py-3 lg:py-2 focus:outline-none focus:border-sky-600 focus:ring-1 focus:ring-sky-600 transition"
            />

            <button type="submit" className="bg-sky-600 text-white font-semibold py-3 lg:py-2 rounded shadow-md hover:bg-sky-700 hover:shadow-lg transition duration-300 ease-in-out">
              Đăng ký
            </button>
          </form>

          <p className="text-sm text-gray-600 mt-2">
            Đã có tài khoản?{" "}
            <button type="button" onClick={goLogin} className="text-sky-600 hover:underline font-bold">
              Đăng nhập
            </button>
          </p>
        </div>
      </div>

      <div className="hidden lg:block lg:w-1/2 h-full">
        <img src={loginSideImage} alt="MangaWeb side visual" className="h-full w-full object-cover" />
      </div>
    </div>
  );
};

export default Register;
