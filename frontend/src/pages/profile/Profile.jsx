import { getUserLogin } from "../../data/api";
import toast from "react-hot-toast"; // Hiển thị thông báo hiện đại, đẹp mắt. Đừng dùng alert nữa :))

const Profile = () => {
    const user = getUserLogin();
    
    if (!user) {
        toast.error("Bạn cần đăng nhập để xem thông tin cá nhân!");
        return (
            <div className="w-full max-w-4xl mx-auto p-4 mt-10">
                <h2 className="text-2xl font-bold mb-4 text-gray-800">Bạn chưa đăng nhập</h2>
                <p className="text-gray-600">Vui lòng đăng nhập để xem thông tin cá nhân của bạn.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen w-full bg-gradient-to-br from-neutral-900 via-sky-900 to-neutral-900 p-6 md:p-12 font-sans">
            <h1 className="text-3xl font-bold mb-16 text-white tracking-wide">Hồ sơ cá nhân</h1>
            
            <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 relative max-w-3xl mx-auto mt-12 border border-white/20">
                <div className="absolute -top-16 left-8">
                    <div className="relative">
                        <img 
                            src={user.avatar || "https://i.imgur.com/1n7f1bF.jpg"} 
                            alt="User Avatar" 
                            className="h-32 w-32 rounded-full border-4 border-white shadow-lg object-cover bg-gray-100"
                        />
                    </div>
                </div>

                <div className="mt-14 pt-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                    <div>
                        <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">{user.username}</h2>
                        <p className="text-sky-600 font-medium mt-1">{user.email}</p>
                    </div>

                    <div className="flex flex-col gap-3 bg-gray-50 px-6 py-4 rounded-xl border border-gray-100 min-w-[200px]">
                        <div className="flex justify-between items-center w-full">
                            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Vai trò</span>
                            <span className="px-3 py-1 bg-sky-100 text-sky-700 text-sm font-bold rounded-full">
                                {user.role}
                            </span>
                        </div>
                        

                        <div className="flex justify-between items-center w-full">
                            <span className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Giới tính</span>
                            {user.gender === "Nam" ? (
                                <span className="flex items-center gap-2 text-blue-600 font-semibold text-sm">
                                    {user.gender} <i className="fa-solid fa-mars text-lg"></i>
                                </span>
                            ) : (
                                <span className="flex items-center gap-2 text-pink-600 font-semibold text-sm">
                                    {user.gender} <i className="fa-solid fa-venus text-lg"></i>
                                </span>
                            )}
                        </div>
                    </div>

                </div>
                <div className="mt-14 pt-6 flex flex-col items-center md:items-start gap-6 h-full md:h-[300px]">
                    <div className="w-full">
                        <h2 className="text-lg font-bold text-gray-500 uppercase"> Thành tựu <i className="fa-solid fa-star text-yellow-400"></i></h2>
                        <div className="h-px w-full bg-gray-400"></div>
                    </div>
                    <div><p className="text-center">Chưa có thành tựu nào</p></div>
                </div>
                <div className="h-px w-full bg-gray-400"></div>

                <div className="mt-6 text-gray-700 flex flex-row gap-2 items-end justify-end">
                    <button className="bg-sky-600 hover:bg-sky-700 text-white font-semibold px-6 py-2 rounded shadow-md transition duration-300 ease-in-out"><i className="fa-solid fa-user-pen mr-2"></i>Sửa thông tin</button>
                </div>

            </div>
        </div>
    );
};

export default Profile;