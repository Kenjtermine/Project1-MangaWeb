import Comment from "../components/comments/Comment";
import CommentForm from "../components/comments/CommentForm";
import CommentsSection from "../components/comments/CommentsSection";
const Sandbox = () => {
    // Đây là trang sandbox test, đừng ngại thể hiện component mới ở đây, xong rồi nhớ xóa route này đi nhé
    return (
        <div className="bg-neutral-300 h-screen flex-col items-center justify-center">
            {/*Nhét component mới vào đây*/}
            {/* <div className="p-10"><Comment /></div> */}
            {/* <CommentForm /> */}
            <CommentsSection />
        </div>
    );
};

export default Sandbox;