import { Outlet } from "react-router-dom";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import Sidebar from "../components/sidebar/Sidebar";

const MainLayout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Header cố định */}
      <Header />

      {/* Phần nội dung thay đổi (Outlet) */}
      <div className="flex flex-1 w-full py-0 px-0 gap-4">
        {/* Sidebar */}
        <aside className="w-1/4 min-w-[180px] max-w-xs h-30">
          <Sidebar />
        </aside>
        {/* Nội dung chính */}
        <main className="flex-1">
          <Outlet />
        </main>
      </div>

      {/* Footer cố định */}
      <Footer />
    </div>
  );
};

export default MainLayout;