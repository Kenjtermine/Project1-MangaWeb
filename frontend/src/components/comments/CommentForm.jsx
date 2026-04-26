import React, { useState } from "react";

// Nhận prop placeholder để đổi chữ: "Viết bình luận..." hoặc "Viết phản hồi..."
const CommentForm = ({ placeholder = "Viết bình luận...", onSubmitComment }) => {
    const [comment, setComment] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        
        // Ngăn người dùng gửi bình luận trống (toàn dấu cách)
        if (!comment.trim()) return; 

        // Gửi dữ liệu ra component cha (nếu có)
        if (onSubmitComment) {
            onSubmitComment(comment);
        }
        
        // Xóa ô nhập sau khi gửi thành công
        setComment(""); 
    };

    return (
        <div className="flex gap-3 items-start w-full max-w-3xl mt-4">
            {/* Ảnh Avatar của người đang đăng nhập */}
            <img 
                src="https://i.imgur.com/1n7f1bF.jpg" // Avatar mặc định
                alt="My Avatar" 
                className="w-10 h-10 rounded-full object-cover shadow-sm"
            />
            
            {/* Form nhập liệu */}
            {/* focus-within: giúp đổi màu viền của cả khối khi click vào ô input */}
            <form 
                onSubmit={handleSubmit} 
                className="flex-1 flex items-center gap-2 bg-gray-100 p-2 rounded-lg border border-gray-200 focus-within:border-sky-500 focus-within:ring-1 focus-within:ring-sky-500 transition"
            >
                <input
                    type="text"
                    placeholder={placeholder}
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    className="w-full bg-transparent p-2 focus:outline-none text-gray-800 placeholder:text-gray-500"
                    autoComplete="off"
                />
                
                {/* Nút Gửi (Chỉ sáng lên khi có chữ) */}
                <button 
                    type="submit" 
                    disabled={!comment.trim()} 
                    className={`p-2 rounded-full transition duration-200 ${
                        comment.trim() 
                        ? 'text-sky-600 hover:bg-sky-100 cursor-pointer' 
                        : 'text-gray-400 cursor-not-allowed'
                    }`}
                >
                    {/* Icon Máy bay giấy (Heroicons SVG) */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 -rotate-45 mb-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                    </svg>
                </button>
            </form>
        </div>
    );
};

export default CommentForm;