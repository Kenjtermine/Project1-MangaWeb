import React, { useMemo, useState } from "react";
import Comment from "./Comment";
import CommentForm from "./CommentForm";
import { getComments, getCurrentUser, submitComment, deleteComment } from "../../data/api";

const CommentsSection = ({ chapterId = 1 }) => {
    const [flatComments, setFlatComments] = useState(() => getComments(chapterId));
    const [message, setMessage] = useState("");
    const user = getCurrentUser();

    const buildTree = (comments) => {
        const map = new Map();
        comments.forEach((comment) => map.set(comment.comment_id, { ...comment, replies: [] }));

        const roots = [];
        comments.forEach((comment) => {
            const item = map.get(comment.comment_id);
            if (!comment.parent_comment_id) {
                roots.push(item);
                return;
            }

            const parentComment = map.get(comment.parent_comment_id);
            if (parentComment) {
                parentComment.replies.push(item);
            } else {
                roots.push(item);
            }
        });

        return roots;
    };

    const commentTree = useMemo(() => buildTree(flatComments), [flatComments]);

    const refreshComments = () => {
        setFlatComments(getComments(chapterId));
    };

    const handleSubmitComment = ({ content, parentCommentId = null, rootCommentId = null }) => {
        const result = submitComment({
            chapterId,
            content,
            parentCommentId,
            rootCommentId,
        });

        setMessage(result.message);

        if (result.ok) {
            refreshComments();
        }

        return result;
    };

    const handleDeleteComment = (commentId) => {
        const result = deleteComment(commentId);

        if (result.ok) {
            refreshComments();
        }
    };

    return (
        <div className="w-full max-w-4xl mx-5 p-4 items-start">
            <h2 className="text-2xl font-bold mb-6 text-gray-800 pb-5">
                Bình luận ({flatComments.length})
            </h2>

            <div className="mb-8">
                {!user && (
                    <p className="mb-3 rounded bg-yellow-50 px-4 py-3 text-sm text-yellow-800 border border-yellow-200">
                        Bạn cần đăng nhập để gửi bình luận hoặc phản hồi.
                    </p>
                )}

                {/* {message && (
                    <p className={`mb-3 rounded px-4 py-3 text-sm border ${
                        message.includes("Đã gửi")
                            ? "bg-green-50 text-green-700 border-green-200"
                            : "bg-red-50 text-red-700 border-red-200"
                    }`}>
                        {message}
                    </p>
                )} */}

                <CommentForm
                    placeholder="Viết bình luận của bạn..."
                    disabled={!user}
                    onSubmitComment={(text) => handleSubmitComment({ content: text })}
                />
            </div>

            <div className="flex flex-col gap-6">
                {commentTree.map((rootComment) => (
                    <Comment
                        key={rootComment.comment_id}
                        commentData={rootComment}
                        currentUser={user}
                        onSubmitReply={({ content, parentCommentId, rootCommentId }) =>
                            handleSubmitComment({ content, parentCommentId, rootCommentId })
                        }
                        onDelete={handleDeleteComment}
                    />
                ))}
            </div>
        </div>
    );
};

export default CommentsSection;
