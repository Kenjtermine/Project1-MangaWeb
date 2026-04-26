import { useState } from "react";
import CommentForm from "./CommentForm";
import useTimeAgo from "../../hooks/useTimeAgo";

const Comment = ({ commentData }) => {
    // Tách thành 2 state độc lập để dễ quản lý việc Hủy
    const [isLiked, setIsLiked] = useState(false);
    const [isDisliked, setIsDisliked] = useState(false);
    const isPoster = false; // Giả lập đây là comment của người đăng, để hiển thị nút Edit/Delete
    const [isReplying, setIsReplying] = useState(false);
    
    // Giả lập số lượt like/dislike ban đầu từ Database
    const baseLikes = 0;
    const baseDislikes = 0;

    // Hàm xử lý khi bấm Like
    const handleLike = () => {
        if (isLiked) {
            setIsLiked(false); // Nếu đã like rồi thì hủy
        } else {
            setIsLiked(true);  // Nếu chưa like thì bật like
            setIsDisliked(false); // Và chắc chắn phải hủy dislike (nếu đang có)
        }
    };

    // Hàm xử lý khi bấm Dislike
    const handleDislike = () => {
        if (isDisliked) {
            setIsDisliked(false); // Nếu đã dislike rồi thì hủy
        } else {
            setIsDisliked(true);  // Nếu chưa dislike thì bật dislike
            setIsLiked(false);    // Và chắc chắn phải hủy like (nếu đang có)
        }
    };
    
    return (
        <div className="flex flex-col gap-4 items-start w-full max-w-3xl mb-6">
            <div className="flex flex-row gap-3 items-start w-full">
                <img src={commentData.avatar} alt="User Avatar" className="h-12 w-12 rounded-full object-cover shadow-sm mt-1" />
                
                <div className="flex flex-col gap-2 w-full">
                    
                    {/* UI UPDATE: Nền xám đậm hơn (bg-gray-200), viền rõ hơn (border-gray-300) */}
                    <div className="bg-gray-200 p-4 rounded-lg w-full shadow-sm border border-gray-300">
                        
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-sky-900">{commentData.user}</span>
                            <span className="text-xs text-gray-500">{useTimeAgo(commentData.timestamp)}</span>
                        </div>
                        
                        {/* UI UPDATE: Chữ tối hơn (text-gray-900) và dày hơn một chút (font-medium) */}
                        <p className="max-w-prose text-gray-900 font-medium text-sm mb-3">
                            {commentData.content}
                        </p>

                        <div className="flex items-center justify-between pt-3 border-t border-gray-300/80">
                            <div className="flex items-center gap-1 text-sm font-bold text-gray-600">
                                
                                {/* Nút LIKE */}
                                <button 
                                    onClick={handleLike} 
                                    className={`px-2 py-1 rounded transition ${isLiked ? "text-sky-600 bg-sky-100" : "hover:text-sky-600 hover:bg-gray-300"}`}
                                >
                                    <i className="fa-solid fa-thumbs-up"></i>
                                </button>
                                {/* Cộng thêm 1 nếu isLiked là true */}
                                <span className="pr-3">{baseLikes + (isLiked ? 1 : 0)}</span>
                                
                                {/* Nút DISLIKE */}
                                <button 
                                    onClick={handleDislike} 
                                    className={`px-2 py-1 rounded transition ${isDisliked ? "text-red-600 bg-red-100" : "hover:text-red-500 hover:bg-gray-300"}`}
                                >
                                    <i className="fa-solid fa-thumbs-down"></i>
                                </button>
                                {/* Cộng thêm 1 nếu isDisliked là true */}
                                <span className="pr-4">{baseDislikes + (isDisliked ? 1 : 0)}</span>
                                
                                {/* Nút REPLY */}
                                <button 
                                    onClick={() => setIsReplying(!isReplying)} 
                                    className="hover:text-sky-700 hover:bg-gray-300 px-3 py-1 rounded transition ml-2"
                                >
                                    Reply
                                </button>
                            </div>

                            {isPoster? (
                            <div className="flex items-center gap-2">
                                <button className="text-gray-400 hover:text-sky-600 transition px-2">
                                    <i className="fa-solid fa-pen-to-square"></i>
                                </button>
                                <button className="text-gray-400 hover:text-red-600 transition px-2">
                                    <i className="fa-solid fa-trash"></i>
                                </button>
                            </div>
                            ):
                            (
                                <button className="text-gray-400 hover:text-red-600 transition px-2">
                                    <i className="fa-solid fa-flag"></i>
                                </button>
                            )}
                        </div>
                    </div>

                    {/* --- KHỐI FORM TRẢ LỜI --- */}
                    {isReplying && (
                        <div className="mt-1 w-full pl-2">
                            <CommentForm 
                                placeholder={`Phản hồi ${commentData.user}...`} 
                                onSubmitComment={(replyText) => {
                                    const newReply = {
                                        comment_id: Date.now(), // ID tạm thời, nên dùng UUID hoặc ID từ DB thật khi có backend
                                        user: "Khách (vous)", // Tên giả lập
                                        avatar: "https://i.imgur.com/1n7f1bF.jpg", // Avatar giả lập
                                        content: replyText,
                                        parent_comment_id: commentData.comment_id, // Liên kết với comment hiện tại
                                        root_comment_id: commentData.root_comment_id || commentData.comment_id, // Nếu comment hiện tại đã là phản hồi, thì root_comment_id vẫn giữ nguyên
                                        timestamp: new Date().toISOString() // Thời gian hiện tại
                                    };
                                    commentData.replies.push(newReply); // Thêm phản hồi mới vào mảng replies của comment hiện tại
                                    setIsReplying(false); // Đóng form sau khi gửi phản hồi
                                }} 
                            />
                        </div>
                    )}

                    {commentData.replies && commentData.replies.length > 0 && (
                        // relies là mảng tạo từ buildtree của section comment, chứa tất cả phản hồi của comment đó
                        <div className="mt-2 pl-6 border-l-2 border-gray-300 flex flex-col gap-4 w-full">
                            {commentData.replies.map((replyData) => (
                                // GỌI LẠI CHÍNH COMPONENT COMMENT NÀY! (Đệ quy)
                                <Comment key={replyData.id} commentData={replyData} />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Comment;