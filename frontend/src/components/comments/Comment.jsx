import { useState } from "react";
import CommentForm from "./CommentForm";
import useTimeAgo from "../../hooks/useTimeAgo";
import { toggleReaction } from "../../data/api";
const Comment = ({ commentData, currentUser, onSubmitReply, onDelete }) => {
    //reaction
    const [reaction, setReaction] = useState(null); // null | "like" | "dislike"
    const [likeCount, setLikeCount] = useState(commentData.like_count || 0);
    const [dislikeCount, setDislikeCount] = useState(commentData.dislike_count || 0);

    const [isReplying, setIsReplying] = useState(false);
    const [replyMessage, setReplyMessage] = useState("");
    const [isRemove, setIsRemove] = useState(false);

    const isPoster = currentUser && Number(currentUser.user_id) === Number(commentData.user_id);

    const handleReaction = async (type) => {
        const action = type === reaction ? "remove" : "add";
        try {
        const result = await toggleReaction({ commentId: commentData.comment_id, reaction: type });
    
        if (result.ok) {
            // 1. Cập nhật trạng thái nút bấm (xanh/đỏ)
            setReaction(reaction === type ? null : type);
            
            // 2. CẬP NHẬT CẢ 2 CON SỐ TỪ BACKEND TRẢ VỀ
            setLikeCount(result.comment.like_count);
            setDislikeCount(result.comment.dislike_count);
        } else {
            console.warn("API báo lỗi nhưng không sập:", result.message);
        }
    } catch (error) {
        console.error(" Lỗi sập hàm khi gọi API:", error);
    }
    }

    const handleSubmitReply = async (replyText) => { 
        // Thêm await để chờ Backend xử lý xong
        const result = await onSubmitReply?.({
            content: replyText,
            parentCommentId: commentData.comment_id,
            rootCommentId: commentData.root_comment_id || commentData.comment_id,
        });

        if (result?.ok) {
            setIsReplying(false); // Sẽ chạy đúng và đóng form lại
        } else if (result?.message) {
            setReplyMessage(result.message);
        }

        return result;
    };

    const handleRemoveComment = () => {
        setIsRemove(true);
    };

    return (
        <div className="flex flex-col gap-4 items-start w-full max-w-3xl mb-6">
            <div className="flex flex-row gap-3 items-start w-full">
                <img src={commentData.avatar} alt="User Avatar" className="h-12 w-12 rounded-full object-cover shadow-sm mt-1" />

                <div className="flex flex-col gap-2 w-full">
                    <div className="bg-gray-200 p-4 rounded-lg w-full shadow-sm border border-gray-300">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold text-sky-900">{commentData.user}</span>
                            <span className="text-xs text-gray-500">{useTimeAgo(commentData.timestamp)}</span>
                        </div>

                        <p className="max-w-prose text-gray-900 font-medium text-sm mb-3 whitespace-pre-line">
                            {commentData.content}
                        </p>

                        <div className="flex items-center justify-between pt-3 border-t border-gray-300/80">
                            <div className="flex items-center gap-1 text-sm font-bold text-gray-600">
                                <button
                                    onClick={() => handleReaction("like")}
                                    className={`px-2 py-1 rounded transition ${reaction === "like" ? "text-sky-600 bg-sky-100" : "hover:text-sky-600 hover:bg-gray-300"}`}
                                >
                                    <i className="fa-solid fa-thumbs-up"></i>
                                </button>
                                <span className="pr-3">{likeCount}</span>

                                <button
                                    onClick={() => handleReaction("dislike")}
                                    className={`px-2 py-1 rounded transition ${reaction === "dislike" ? "text-red-600 bg-red-100" : "hover:text-red-500 hover:bg-gray-300"}`}
                                >
                                    <i className="fa-solid fa-thumbs-down"></i>
                                </button>
                                <span className="pr-4">{dislikeCount}</span>

                                <button
                                    onClick={() => {
                                        setIsReplying(!isReplying);
                                        setReplyMessage("");
                                    }}
                                    className="hover:text-sky-700 hover:bg-gray-300 px-3 py-1 rounded transition ml-2"
                                >
                                    Reply
                                </button>
                            </div>

                            {isPoster ? (
                                <div className="flex items-center gap-2">
                                    <button className="text-gray-400 hover:text-sky-600 transition px-2">
                                        <i className="fa-solid fa-pen-to-square"></i>
                                    </button>
                                    <button onClick={() => onDelete(commentData.comment_id)} className="text-gray-400 hover:text-red-600 transition px-2">
                                        <i className="fa-solid fa-trash"></i>
                                    </button>
                                </div>
                            ) : (
                                <button className="text-gray-400 hover:text-red-600 transition px-2">
                                    <i className="fa-solid fa-flag"></i>
                                </button>
                            )}
                        </div>
                    </div>

                    {isReplying && (
                        <div className="mt-1 w-full pl-2">
                            {replyMessage && (
                                <p className="mb-2 text-sm text-red-600">{replyMessage}</p>
                            )}
                            <CommentForm
                                placeholder={`Phản hồi ${commentData.user}...`}
                                disabled={!currentUser}
                                onSubmitComment={handleSubmitReply}
                            />
                        </div>
                    )}

                    {commentData.replies && commentData.replies.length > 0 && (
                        <div className="mt-2 pl-6 border-l-2 border-gray-300 flex flex-col gap-4 w-full">
                            {commentData.replies.map((replyData) => (
                                <Comment
                                    key={replyData.comment_id}
                                    commentData={replyData}
                                    currentUser={currentUser}
                                    onSubmitReply={onSubmitReply}
                                    onDelete={onDelete}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Comment;
