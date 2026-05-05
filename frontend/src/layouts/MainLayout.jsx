import { Outlet } from "react-router-dom";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import Sidebar from "../components/sidebar/Sidebar";

const MainLayout = () => {
  return (
    // 1. KHOÁ CHẶT MÀN HÌNH: h-screen (cao đúng 1 màn hình) và overflow-hidden (cấm cuộn trang tổng thể)
    <div className="flex flex-col h-screen overflow-hidden">
      
      {/* 2. HEADER: Chiều cao cố định. 
          shrink-0: Đảm bảo Header không bao giờ bị bóp méo khi màn hình chật */}
      <div className="h-16 shrink-0 z-50">
        <Header />
      </div>

      {/* 3. VÙNG THÂN: Chứa Sidebar và Outlet. Vùng này cũng cấm cuộn tràn */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* 4. SIDEBAR: Nằm im bên trái. 
            Thêm overflow-y-auto để nếu menu của bạn có quá nhiều nút, 
            người dùng vẫn cuộn riêng cái sidebar được (không ảnh hưởng nội dung) */}
        <aside className="w-1/4 min-w-[180px] max-w-xs shrink-0 overflow-y-auto hidden md:block z-40">
          <Sidebar />
        </aside>

        {/* 5. NỘI DUNG CHÍNH (OUTLET): ĐÂY LÀ NHÂN VẬT CHÍNH!
            - flex-1: Chiếm toàn bộ không gian còn lại
            - overflow-y-auto: CẤP QUYỀN CUỘN DỌC CHO DUY NHẤT VÙNG NÀY */}
        <main className="flex-1 overflow-y-auto relative z-0">
          {/* Một div bọc lót bên trong để đẩy Footer xuống tận cùng */}
          <div className="flex flex-col min-h-full">
            
            {/* Nội dung các trang sẽ đổ vào đây */}
            <div className="flex-1 pb-10">
              <Outlet />
            </div>

            {/* 6. FOOTER: Đưa Footer vào trong vùng cuộn này.
                Người dùng cuộn hết truyện thì mới thấy Footer */}
            <Footer />
            
          </div>
        </main>

      </div>
    </div>
  );
};

export default MainLayout;