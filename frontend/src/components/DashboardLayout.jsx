import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../redux/slices/authSlice";
import {
  Droplet,
  Home,
  User,
  Calendar,
  Building2,
  FileText,
  LogOut,
  Menu,
  X,
  Settings,
  Bell,
  ChevronLeft,
  CheckCircle,
  QrCode,
} from "lucide-react";

const DashboardLayout = ({ children, activeTab, userType }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/");
  };

  // Navigation items based on user type
  const getNavigationItems = () => {
    switch (userType) {
      case "user":
        return [
          {
            id: "overview",
            label: "Overview",
            icon: Home,
            path: "/user/dashboard",
          },
          {
            id: "profile",
            label: "My Profile",
            icon: User,
            path: "/user/profile",
          },
          {
            id: "requests",
            label: "My Requests",
            icon: FileText,
            path: "/requests/my-requests",
          },
          {
            id: "donation-history",
            label: "Donation History",
            icon: Droplet,
            path: "/user/donation-history",
          },
          {
            id: "my-camps",
            label: "My Camps",
            icon: CheckCircle,
            path: "/user/my-camps",
          },
          {
            id: "blood-camps",
            label: "All Blood Camps",
            icon: Calendar,
            path: "/camps",
          },
          {
            id: "blood-banks",
            label: "Blood Banks",
            icon: Building2,
            path: "/blood-banks",
          },
          {
            id: "all-requests",
            label: "All Requests",
            icon: Bell,
            path: "/requests",
          },
        ];
      case "bloodbank":
        return [
          {
            id: "overview",
            label: "Overview",
            icon: Home,
            path: "/bloodbank/dashboard",
          },
          {
            id: "scanner",
            label: "Scan Donation",
            icon: QrCode,
            path: "/bloodbank/scan-donation",
          },
          {
            id: "profile",
            label: "Bank Profile",
            icon: Building2,
            path: "/bloodbank/profile",
          },
          {
            id: "my-requests",
            label: "My Requests",
            icon: FileText,
            path: "/requests/my-requests",
          },
          {
            id: "all-requests",
            label: "All Requests",
            icon: Bell,
            path: "/requests",
          },
        ];
      case "organization":
        return [
          {
            id: "overview",
            label: "Overview",
            icon: Home,
            path: "/organization/dashboard",
          },
          {
            id: "profile",
            label: "Organization Profile",
            icon: Building2,
            path: "/organization/profile",
          },
          {
            id: "my-camps",
            label: "My Camps",
            icon: Calendar,
            path: "/organization/my-camps",
          },
          {
            id: "create-camp",
            label: "Create Camp",
            icon: Calendar,
            path: "/camps/create",
          },
          {
            id: "all-camps",
            label: "All Camps",
            icon: Bell,
            path: "/camps",
          },
        ];
      default:
        return [];
    }
  };

  const navigationItems = getNavigationItems();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Mobile Header */}
      <div className="lg:hidden bg-white shadow-md fixed top-0 left-0 right-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="text-gray-700 hover:text-red-600 transition-colors"
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-br from-red-600 to-red-700 p-2 rounded-lg">
              <Droplet className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold gradient-text">BloodLife</span>
          </Link>
          <button
            onClick={handleLogout}
            className="text-gray-700 hover:text-red-600 transition-colors"
          >
            <LogOut className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Mobile Sidebar Overlay */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40 mt-14"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <div
            className="bg-white w-64 h-full shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-6">
              <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-gray-200">
                <div className="bg-gradient-to-br from-red-600 to-red-700 p-2 rounded-lg">
                  <User className="h-6 w-6 text-white" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-gray-900 truncate">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-600 truncate">
                    {user?.email}
                  </p>
                </div>
              </div>

              <nav className="space-y-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    activeTab === item.id || location.pathname === item.path;
                  return (
                    <Link
                      key={item.id}
                      to={item.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all ${
                        isActive
                          ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md"
                          : "text-gray-700 hover:bg-red-50 hover:text-red-600"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      <span className="font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside
        className={`hidden lg:block fixed left-0 top-0 h-full bg-white shadow-xl transition-all duration-300 z-40 ${
          isSidebarOpen ? "w-64" : "w-20"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-200">
          {isSidebarOpen && (
            <Link to="/" className="flex items-center space-x-2">
              <div className="bg-gradient-to-br from-red-600 to-red-700 p-2 rounded-lg shadow-sm">
                <Droplet className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-bold gradient-text">BloodLife</span>
            </Link>
          )}
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-gray-600 hover:text-red-600 transition-colors ml-auto"
          >
            <ChevronLeft
              className={`h-5 w-5 transition-transform ${
                !isSidebarOpen ? "rotate-180" : ""
              }`}
            />
          </button>
        </div>

        {/* User Info */}
        <div className="px-6 py-5 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="bg-gradient-to-br from-red-600 to-red-700 p-2.5 rounded-lg shadow-sm flex-shrink-0">
              <User className="h-6 w-6 text-white" />
            </div>
            {isSidebarOpen && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 truncate">
                  {user?.name}
                </p>
                <p className="text-xs text-gray-600 truncate">{user?.email}</p>
              </div>
            )}
          </div>
        </div>

        {/* Navigation */}
        <nav className="px-3 py-4 space-y-1 flex-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive =
              activeTab === item.id || location.pathname === item.path;
            return (
              <Link
                key={item.id}
                to={item.path}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all group ${
                  isActive
                    ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-md"
                    : "text-gray-700 hover:bg-red-50 hover:text-red-600"
                }`}
                title={!isSidebarOpen ? item.label : ""}
              >
                <Icon className="h-5 w-5 flex-shrink-0" />
                {isSidebarOpen && (
                  <span className="font-medium">{item.label}</span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="px-3 py-4 border-t border-gray-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-red-50 hover:text-red-600 transition-all"
            title={!isSidebarOpen ? "Logout" : ""}
          >
            <LogOut className="h-5 w-5 flex-shrink-0" />
            {isSidebarOpen && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main
        className={`transition-all duration-300 pt-16 lg:pt-0 ${
          isSidebarOpen ? "lg:ml-64" : "lg:ml-20"
        }`}
      >
        <div className="p-6 lg:p-8">{children}</div>
      </main>
    </div>
  );
};

export default DashboardLayout;
