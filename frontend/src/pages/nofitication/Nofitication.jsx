import { useState, useEffect } from "react";
import { clearUserNotifications, getUserNotification, markAllNotificationsRead } from "../../data/api";

const Nofitication = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            setLoading(true);
            const data = await getUserNotification();
            setNotifications(data || []);
            setError(null);
        } catch (err) {
            setError("Không thể tải thông báo");
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            const data = await markAllNotificationsRead();
            setNotifications(data || []);
        } catch (err) {
            setError("Không thể đánh dấu đã đọc");
            console.error(err);
        }
    };

    const handleClearNotifications = async () => {
        try {
            await clearUserNotifications();
            setNotifications([]);
        } catch (err) {
            setError("Không thể xóa thông báo");
            console.error(err);
        }
    };

    return (
        <div className="bg-sky-900 text-white flex flex-col px-8 py-8 min-h-screen">
            <h1 className="text-2xl font-bold mb-4">Thông báo mới</h1>
            <div className="h-px border-sky-300 w-full my-4 border-b-2"></div>
            <div className="flex flex-col gap-4 min-h-[65vh]">
                {loading && <p className="text-center">Đang tải...</p>}
                {error && <p className="text-center text-red-300">{error}</p>}
                {!loading && notifications.length === 0 && <p className="text-center">Không có thông báo</p>}
                {notifications.map((notification) => (
                    <div key={notification.notification_id} className={`p-4 rounded ${notification.is_read ? 'bg-sky-700' : 'bg-sky-600'} transition`}>
                        <h2 className="font-semibold">{notification.title}</h2>
                        <p className="text-sm">{notification.content}</p>
                    </div>
                ))}
            </div>
            <div className="h-px border-sky-800 w-full my-4 border-b-2"></div>
            <div className="flex flex-row items-end justify-end">
                <button onClick={handleMarkAllAsRead} disabled={loading} className="bg-sky-500 hover:bg-sky-400 disabled:bg-sky-700 text-white font-semibold py-2 px-4 rounded transition">
                    Đánh dấu đã đọc tất cả
                </button>
                <button onClick={handleClearNotifications} disabled={loading} className="ml-4 bg-red-600 hover:bg-red-400 disabled:bg-red-800 text-white font-semibold py-2 px-4 rounded transition">
                    Xóa thông báo
                </button>
            </div>
        </div>
    );
};

export default Nofitication;
