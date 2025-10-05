import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';
import ChatbotWidget from './Chatbot/ChatbotWidget'; // Add this import

const Layout = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Outlet />
      </main>
      <Footer />
      <ChatbotWidget /> {/* Add chatbot widget */}
    </div>
  );
};

export default Layout;