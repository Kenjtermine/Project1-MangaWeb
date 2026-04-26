import React, { useState } from "react";
import Comment from "./Comment";
import CommentForm from "./CommentForm";
import mockData from "../../data/mockData.json";

// Lấy dữ liệu mốc ban đầu
const initialMockComments = mockData.comments; 

const CommentsSection = () => {
    // lưu trữ danh sách comment phẳng (bao gồm cả comment gốc và phản hồi)
    const [flatComments, setFlatComments] = useState(initialMockComments);

    // Hàm biến phẳng thành cây
    const buildTree = (comments) => {
        const map = new Map();
        comments.forEach(c => map.set(c.comment_id, { ...c, replies: [] }));
        
        const roots = [];
        comments.forEach(c => {
            if (c.parent_comment_id === null) {
                roots.push(map.get(c.comment_id));
            } else {
                const parentComment = map.get(c.parent_comment_id);
                if (parentComment) {
                    parentComment.replies.push(map.get(c.comment_id));
                }
            }
        });
        return roots;
    };

    // 2. DERIVED STATE: Không cần useEffect. Mỗi khi flatComments đổi, biến này tự cập nhật!
    const commentTree = buildTree(flatComments);

    // 3. Hàm xử lý khi người dùng bấm Gửi ở Form bình luận Gốc
    const handleAddNewRootComment = (text) => {
        // Tạo một object comment mới (Giả lập Backend)
        const newComment = {
            comment_id: Date.now(), // Dùng thời gian hiện tại làm ID tạm thời
            user: "Khách (Bạn)", // Tên giả lập
            avatar: "https://i.imgur.com/1n7f1bF.jpg",
            content: text,
            parent_comment_id: null, // Bắt buộc là null vì đây là comment gốc
            root_comment_id: Date.now(),
            timestamp: new Date().toISOString() // Giờ chuẩn quốc tế
        };

        // Thêm comment mới vào ĐẦU danh sách phẳng
        setFlatComments([newComment, ...flatComments]);
    };

    return (
        <div className="w-full max-w-4xl mx-auto p-4">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Bình luận ({flatComments.length})</h2>
            
            <div className="mb-8">
                {/* 4. MỞ KHÓA FORM: Gọi hàm thêm comment */}
                <CommentForm 
                    placeholder="Viết bình luận của bạn..." 
                    onSubmitComment={handleAddNewRootComment} 
                />
            </div>

            <div className="flex flex-col gap-6">
                {/* 5. SỬA LỖI KEY VÀ PROPS Ở ĐÂY */}
                {commentTree.map(rootComment => (
                    <Comment 
                        key={rootComment.comment_id} 
                        commentData={rootComment} 
                    />
                ))}
            </div>
        </div>
    );
};

export default CommentsSection;