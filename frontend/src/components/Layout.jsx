import { Outlet, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
import Navbar from "./Navbar";
import Footer from "./Footer";
import ChatbotWidget from "./Chatbot/ChatbotWidget";

const Layout = () => {
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  // Pages that should NOT show navbar/footer when user is logged in
  const dashboardAccessiblePages = ["/blood-banks", "/camps", "/requests"];

  // Check if current page is a dashboard-accessible page and user is logged in
  const isDashboardView =
    user &&
    dashboardAccessiblePages.some((page) => location.pathname.startsWith(page));

  // Show navbar/footer only on home or auth pages, or when not logged in
  const showNavbarFooter = !isDashboardView;

  return (
    <div className="flex flex-col min-h-screen">
      {showNavbarFooter && <Navbar />}
      <main className="flex-grow">
        <Outlet />
      </main>
      {showNavbarFooter && <Footer />}
      <ChatbotWidget />
    </div>
  );
};

export default Layout;
