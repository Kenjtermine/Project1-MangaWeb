import { useState } from "react";
import { clearUserNotifications, getUserNotification, markAllNotificationsRead } from "../../data/api";

const Nofitication = () => {
    const [notifications, setNotifications] = useState(getUserNotification()); // Giả lập dữ liệu thông báo

    return (
        <div className="bg-sky-900 text-white flex flex-col px-8 py-8 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Thông báo mới</h1>
            <div className="h-px border-sky-300 w-full my-4 border-b-2"></div>
            <div className="flex flex-col gap-4 min-h-[65vh]">
                {notifications.length === 0 && <p className="text-center">Không có thông báo</p>}
                {notifications.map((notification) => (
                    <div key={notification.notification_id} className={`p-4 rounded ${notification.is_read ? 'bg-sky-700' : 'bg-sky-600'} transition`}>
                        <h2 className="font-semibold">{notification.title}</h2>
                        <p className="text-sm">{notification.content}</p>
                    </div>
                ))}
            </div>
            <div className="h-px border-sky-800 w-full my-4 border-b-2"></div>
            <div className="flex flex-row items-end justify-end">
                <button onClick={() => setNotifications(markAllNotificationsRead())} className="bg-sky-500 hover:bg-sky-400 text-white font-semibold py-2 px-4 rounded transition">
                    Đánh dấu đã đọc tất cả
                </button>
                <button onClick={() => setNotifications(clearUserNotifications())} className="ml-4 bg-red-600 hover:bg-red-400 text-white font-semibold py-2 px-4 rounded transition">
                    Xóa thông báo
                </button>
            </div>

        </div>
    );
};

export default Nofitication;
