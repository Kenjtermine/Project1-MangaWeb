import React, { useState, useEffect } from 'react';

const UserManager = () => {
    // Tạm thời dùng Mock Data để dựng UI trước khi nối API
    const [users, setUsers] = useState([
        { id: 1, user_name: 'Anh Kiet', user_email: 'kiet@example.com', user_role: 'admin', is_banned: false },
        { id: 2, user_name: 'Khang Le', user_email: 'khang@example.com', user_role: 'user', is_banned: true },
    ]);

    return (
        <div className="bg-white min-h-screen p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Quản lý người dùng</h1>
                <div className="text-sm text-gray-500">Tổng cộng: {users.length} tài khoản</div>
            </div>

            {/* Bảng dữ liệu */}
            <div className="overflow-x-auto bg-white rounded-lg shadow border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Người dùng</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vai trò</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Trạng thái</th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Hành động</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                        <div className="ml-4">
                                            <div className="text-sm font-medium text-gray-900">{user.user_name}</div>
                                            <div className="text-sm text-gray-500">{user.user_email}</div>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.user_role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-green-100 text-green-800'}`}>
                                        {user.user_role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${user.is_banned ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                                        {user.is_banned ? 'Bị khóa' : 'Hoạt động'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <button className="text-indigo-600 hover:text-indigo-900 mr-4">Đổi Quyền</button>
                                    <button className={`${user.is_banned ? 'text-green-600' : 'text-red-600'} hover:underline`}>
                                        {user.is_banned ? 'Mở khóa' : 'Khóa nick'}
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default UserManager;