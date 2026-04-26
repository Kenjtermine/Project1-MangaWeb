import mockData from "./mockData.json"; // Giả lập dữ liệu từ file JSON

/* NOFITICATION API*/
// note đây chỉ là logic api giả lập, phải sửa đổi lại khi có backend thật, nhưng tạm thời cứ để đây cho dễ test nhé
export const getUserNotification = () => {
    // Hàm lấy dữ liệu thông báo của người dùng hiện tại (giả lập)
    //Lấy ID người dùng đang đăng nhập từ bộ nhớ tạm
    const userId = localStorage.getItem("currentUserId");
    if (!userId) return []; 

    // Lọc ra THÔNG BÁO CỦA USER NÀY
    const userNotifications = mockData.notifications.filter(
        (noti) => noti.user_id === parseInt(userId)
    );

    return userNotifications;
};

export const getUserLogin = () => {
    const userId = localStorage.getItem("currentUserId");
    if (!userId) return null;

    const user = mockData.users.find((user) => user.id === parseInt(userId));
    return user;
};