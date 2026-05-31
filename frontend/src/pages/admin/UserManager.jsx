import { useEffect, useState } from "react";
import { adminGetUsers, adminUpdateUserAccess, getCurrentUser } from "../../data/api";

const roleLabels = { admin: "Admin", poster: "Uploader", user: "User" };

const UserManager = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const currentUser = getCurrentUser();

  const loadUsers = async () => {
    setLoading(true);
    const res = await adminGetUsers();
    if (res.ok) setUsers(res.users);
    else setMessage(res.message || "Không tải được danh sách");
    setLoading(false);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleRoleChange = async (userId, userRole) => {
    setMessage("");
    const res = await adminUpdateUserAccess({ userId, userRole });
    if (res.ok) {
      setMessage("Đã cập nhật vai trò.");
      loadUsers();
    } else {
      setMessage(res.message);
    }
  };

  const handleToggleBan = async (user) => {
    if (Number(user.user_id) === Number(currentUser?.user_id)) {
      setMessage("Không thể khóa tài khoản admin đang đăng nhập.");
      return;
    }
    setMessage("");
    const res = await adminUpdateUserAccess({
      userId: user.user_id,
      isBanned: !user.is_banned,
    });
    if (res.ok) {
      setMessage(user.is_banned ? "Đã mở khóa tài khoản." : "Đã khóa tài khoản.");
      loadUsers();
    } else {
      setMessage(res.message);
    }
  };

  return (
    <div className="bg-white min-h-full p-6 rounded-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Quản lý người dùng</h1>
        <span className="text-sm text-gray-500">{users.length} tài khoản</span>
      </div>

      {message && (
        <p className={`mb-4 text-sm ${message.includes("Không") ? "text-red-600" : "text-green-600"}`}>
          {message}
        </p>
      )}

      {loading ? (
        <p className="text-gray-500">Đang tải...</p>
      ) : (
        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Người dùng</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vai trò</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Trạng thái</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.user_id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">{user.user_name}</div>
                    <div className="text-sm text-gray-500">{user.user_email}</div>
                  </td>
                  <td className="px-6 py-4">
                    <select
                      value={user.user_role}
                      disabled={Number(user.user_id) === Number(currentUser?.user_id)}
                      onChange={(e) => handleRoleChange(user.user_id, e.target.value)}
                      className="text-sm border border-gray-300 rounded px-2 py-1"
                    >
                      <option value="user">{roleLabels.user}</option>
                      <option value="poster">{roleLabels.poster}</option>
                      <option value="admin">{roleLabels.admin}</option>
                    </select>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 text-xs font-semibold rounded-full ${
                        user.is_banned ? "bg-red-100 text-red-800" : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.is_banned ? "Bị khóa" : "Hoạt động"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button
                      type="button"
                      disabled={Number(user.user_id) === Number(currentUser?.user_id)}
                      onClick={() => handleToggleBan(user)}
                      className={`text-sm font-medium disabled:opacity-40 ${
                        user.is_banned ? "text-green-600" : "text-red-600"
                      }`}
                    >
                      {user.is_banned ? "Mở khóa" : "Khóa nick"}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default UserManager;
