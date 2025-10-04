import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../redux/slices/authSlice';
import { Droplet, Menu, X, LogOut, User, LayoutDashboard } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, userType } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await dispatch(logout());
    navigate('/');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-2">
            <div className="bg-gradient-to-r from-red-600 to-red-700 p-2 rounded-lg">
              <Droplet className="h-6 w-6 text-white" />
            </div>
            <span className="text-xl font-bold gradient-text">BloodLife</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {isAuthenticated ? (
              <>
                <Link
                  to={
                    userType === 'admin'
                      ? '/admin/dashboard'
                      : userType === 'bloodbank'
                      ? '/bloodbank/dashboard'
                      : '/user/dashboard'
                  }
                  className="text-gray-700 hover:text-red-600 font-semibold transition-colors flex items-center space-x-1"
                >
                  <LayoutDashboard className="h-4 w-4" />
                  <span>Dashboard</span>
                </Link>

                <Link
                  to="/requests"
                  className="text-gray-700 hover:text-red-600 font-semibold transition-colors"
                >
                  Blood Requests
                </Link>

                {userType === 'user' && (
                  <Link
                    to="/blood-banks"
                    className="text-gray-700 hover:text-red-600 font-semibold transition-colors"
                  >
                    Blood Banks
                  </Link>
                )}

                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2 px-4 py-2 bg-red-50 rounded-lg">
                    <User className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-semibold text-gray-700">
                      {user?.name}
                    </span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                  >
                    <LogOut className="h-4 w-4" />
                    <span>Logout</span>
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link
                  to="/login/user"
                  className="text-gray-700 hover:text-red-600 font-semibold transition-colors"
                >
                  User Login
                </Link>
                <Link
                  to="/login/bloodbank"
                  className="text-gray-700 hover:text-red-600 font-semibold transition-colors"
                >
                  Blood Bank Login
                </Link>
                <Link
                  to="/register/user"
                  className="px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all shadow-md"
                >
                  Register
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-red-600 focus:outline-none"
            >
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 animate-slide-down">
          <div className="px-4 pt-2 pb-4 space-y-2">
            {isAuthenticated ? (
              <>
                <div className="px-4 py-3 bg-red-50 rounded-lg mb-2">
                  <p className="text-sm font-semibold text-gray-700">{user?.name}</p>
                  <p className="text-xs text-gray-500">{user?.email}</p>
                </div>
                <Link
                  to={
                    userType === 'admin'
                      ? '/admin/dashboard'
                      : userType === 'bloodbank'
                      ? '/bloodbank/dashboard'
                      : '/user/dashboard'
                  }
                  onClick={toggleMenu}
                  className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                >
                  Dashboard
                </Link>
                <Link
                  to="/requests"
                  onClick={toggleMenu}
                  className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                >
                  Blood Requests
                </Link>
                {userType === 'user' && (
                  <Link
                    to="/blood-banks"
                    onClick={toggleMenu}
                    className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                  >
                    Blood Banks
                  </Link>
                )}
                <button
                  onClick={() => {
                    handleLogout();
                    toggleMenu();
                  }}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors font-semibold"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link
                  to="/login/user"
                  onClick={toggleMenu}
                  className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                >
                  User Login
                </Link>
                <Link
                  to="/login/bloodbank"
                  onClick={toggleMenu}
                  className="block px-4 py-2 text-gray-700 hover:bg-red-50 hover:text-red-600 rounded-lg transition-colors"
                >
                  Blood Bank Login
                </Link>
                <Link
                  to="/register/user"
                  onClick={toggleMenu}
                  className="block px-4 py-2 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all text-center"
                >
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;