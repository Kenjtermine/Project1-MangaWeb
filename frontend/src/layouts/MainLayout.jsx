import { Outlet } from "react-router-dom";
import Header from "../components/header/Header";
import Footer from "../components/footer/Footer";
import Sidebar from "../components/sidebar/Sidebar";

const HEADER_HEIGHT_CLASS = "top-24";

const MainLayout = () => {
  return (
    <div className="min-h-screen bg-white">
      <div className="sticky top-0 z-50 bg-white">
        <Header />
      </div>

      <div className="flex w-full items-start gap-4">
        <aside className={`hidden md:block w-1/4 min-w-[180px] max-w-xs shrink-0 sticky ${HEADER_HEIGHT_CLASS} h-[calc(100vh-24px)] overflow-visible z-40`}>
          <Sidebar />
        </aside>

        <main className="min-w-0 flex-1 z-10">
          <div className="flex min-h-[calc(100vh-6rem)] flex-col">
            <div className="flex-1">
              <Outlet />
            </div>
            <Footer />
          </div>
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
