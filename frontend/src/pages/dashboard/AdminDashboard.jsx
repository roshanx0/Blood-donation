import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import {
  getDashboardStats,
  getPendingBloodBanks,
  approveBloodBank,
  rejectBloodBank,
} from "../../redux/slices/adminSlice";
import { logout } from "../../redux/slices/authSlice";
import {
  Users,
  Building2,
  Clock,
  CheckCircle,
  XCircle,
  BarChart3,
  Building,
  Calendar,
  Home,
  LogOut,
  Droplet,
} from "lucide-react";
import Card from "../../components/Card";
import Loader from "../../components/Loader";
import AnalyticsDashboard from "../../components/AnalyticsDashboard";
import toast from "react-hot-toast";

const AdminDashboard = () => {
  const { stats, pendingBloodBanks, isLoading } = useSelector(
    (state) => state.admin
  );
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getDashboardStats());
    dispatch(getPendingBloodBanks());
  }, [dispatch]);

  const handleLogout = async () => {
    await dispatch(logout());
    navigate("/");
  };

  const handleApprove = async (id) => {
    if (window.confirm("Are you sure you want to approve this blood bank?")) {
      await dispatch(approveBloodBank(id));
      dispatch(getPendingBloodBanks());
    }
  };

  const handleReject = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to reject this blood bank registration? This action cannot be undone."
      )
    ) {
      await dispatch(rejectBloodBank(id));
      dispatch(getPendingBloodBanks());
    }
  };

  if (isLoading) {
    return <Loader fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50">
      {/* Top Navigation Bar */}
      <nav className="bg-white shadow-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Left - Logo & Brand */}
            <Link
              to="/"
              className="flex items-center space-x-3 hover:opacity-80 transition-opacity"
            >
              <div className="bg-gradient-to-br from-red-600 to-red-700 p-2 rounded-lg shadow-sm">
                <Droplet className="h-6 w-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold gradient-text">
                  BloodLife
                </span>
                <span className="ml-2 text-sm text-gray-600 font-semibold">
                  Admin
                </span>
              </div>
            </Link>

            {/* Right - User Info & Actions */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* User Info - Hidden on mobile */}
              <div className="hidden sm:flex items-center space-x-3 px-3 sm:px-4 py-2 bg-gray-50 rounded-lg">
                <div className="bg-gradient-to-br from-red-600 to-red-700 p-2 rounded-lg">
                  <Users className="h-4 w-4 text-white" />
                </div>
                <div className="hidden md:block">
                  <p className="text-sm font-bold text-gray-900">
                    {user?.name}
                  </p>
                  <p className="text-xs text-gray-600">{user?.email}</p>
                </div>
              </div>

              {/* Home Button */}
              <Link
                to="/"
                className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-sm"
                title="Go to Home"
              >
                <Home className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline font-medium">Home</span>
              </Link>

              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-2 px-3 sm:px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-sm"
                title="Logout"
              >
                <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline font-medium">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* ===== SECTION 1: WELCOME HEADER ===== */}
        <div className="bg-gradient-to-r from-red-600 to-red-700 rounded-2xl p-6 sm:p-8 text-white shadow-xl">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold mb-2">
                Admin Dashboard
              </h1>
              <p className="text-red-100 text-base sm:text-lg">
                Welcome back, {user?.name}! Manage your blood donation system
              </p>
            </div>
            <div className="hidden md:block">
              <div className="bg-white/20 backdrop-blur-sm rounded-full p-4">
                <BarChart3 className="h-12 w-12 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* ===== SECTION 2: QUICK STATS OVERVIEW ===== */}
        <section>
          <div className="flex items-center mb-6">
            <div className="w-1 h-8 bg-red-600 rounded-full mr-3"></div>
            <h2 className="text-2xl font-bold text-gray-900">
              Quick Statistics
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card
              gradient
              className="hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 rounded-xl shadow-lg">
                  <Users className="h-8 w-8 text-white" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">
                    {stats?.totalUsers || 0}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    Total Users
                  </div>
                </div>
              </div>
            </Card>

            <Card
              gradient
              className="hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 rounded-xl shadow-lg">
                  <Building2 className="h-8 w-8 text-white" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">
                    {stats?.totalBloodBanks || 0}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    Blood Banks
                  </div>
                </div>
              </div>
            </Card>

            <Card
              gradient
              className="hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-4 rounded-xl shadow-lg">
                  <Building className="h-8 w-8 text-white" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">
                    {stats?.totalOrganizations || 0}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    Organizations
                  </div>
                </div>
              </div>
            </Card>

            <Card
              gradient
              className="hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center space-x-4">
                <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-4 rounded-xl shadow-lg">
                  <Clock className="h-8 w-8 text-white" />
                </div>
                <div>
                  <div className="text-3xl font-bold text-gray-900">
                    {stats?.pendingBloodBanks || 0}
                  </div>
                  <div className="text-sm text-gray-600 font-medium">
                    Pending Approvals
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </section>

        {/* ===== SECTION 3: PENDING APPROVALS (Priority Section) ===== */}
        {pendingBloodBanks.length > 0 && (
          <section>
            <div className="flex items-center mb-6">
              <div className="w-1 h-8 bg-yellow-500 rounded-full mr-3"></div>
              <h2 className="text-2xl font-bold text-gray-900">
                Pending Approvals
              </h2>
              <span className="ml-4 bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-semibold">
                {pendingBloodBanks.length} Waiting
              </span>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-6 rounded-lg">
              <div className="flex items-center">
                <Clock className="h-6 w-6 text-yellow-600 mr-3" />
                <div>
                  <p className="text-sm font-semibold text-yellow-800">
                    Action Required: {pendingBloodBanks.length} Blood Bank
                    {pendingBloodBanks.length > 1 ? "s" : ""} Awaiting Review
                  </p>
                  <p className="text-xs text-yellow-700 mt-1">
                    Please review and approve or reject the following
                    applications
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {pendingBloodBanks.map((bloodBank) => (
                <Card
                  key={bloodBank._id}
                  className="hover:shadow-xl transition-all duration-300 border-l-4 border-yellow-400"
                >
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center mb-3">
                        <Building2 className="h-6 w-6 text-yellow-600 mr-2" />
                        <h3 className="text-xl font-bold text-gray-900">
                          {bloodBank.name}
                        </h3>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600 bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center">
                          <span className="font-semibold text-gray-700 min-w-[80px]">
                            Email:
                          </span>
                          <span className="text-gray-900">
                            {bloodBank.email}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-semibold text-gray-700 min-w-[80px]">
                            Phone:
                          </span>
                          <span className="text-gray-900">
                            {bloodBank.phone}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-semibold text-gray-700 min-w-[80px]">
                            City:
                          </span>
                          <span className="text-gray-900">
                            {bloodBank.city}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-semibold text-gray-700 min-w-[80px]">
                            License:
                          </span>
                          <span className="text-gray-900">
                            {bloodBank.licenseNumber}
                          </span>
                        </div>
                        <div className="md:col-span-2 flex items-start">
                          <span className="font-semibold text-gray-700 min-w-[80px]">
                            Address:
                          </span>
                          <span className="text-gray-900">
                            {bloodBank.address}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <span className="font-semibold text-gray-700 min-w-[80px]">
                            Registered:
                          </span>
                          <span className="text-gray-900">
                            {new Date(bloodBank.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex md:flex-col gap-3 md:min-w-[180px]">
                      <button
                        onClick={() => handleApprove(bloodBank._id)}
                        className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-5 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition-all duration-300 shadow-md hover:shadow-lg font-semibold"
                      >
                        <CheckCircle className="h-5 w-5" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleReject(bloodBank._id)}
                        className="flex-1 md:flex-none flex items-center justify-center space-x-2 px-5 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white rounded-lg hover:from-red-700 hover:to-red-800 transition-all duration-300 shadow-md hover:shadow-lg font-semibold"
                      >
                        <XCircle className="h-5 w-5" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </section>
        )}

        {/* ===== SECTION 4: MANAGEMENT QUICK LINKS ===== */}
        <section>
          <div className="flex items-center mb-6">
            <div className="w-1 h-8 bg-indigo-600 rounded-full mr-3"></div>
            <h2 className="text-2xl font-bold text-gray-900">
              Management Center
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <Link to="/admin/users">
              <Card className="text-center cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 group h-full">
                <div className="flex flex-col items-center justify-center p-2">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow mb-3">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-1">
                    Users
                  </h3>
                  <p className="text-xs text-gray-600">Manage all users</p>
                </div>
              </Card>
            </Link>

            <Link to="/admin/blood-banks">
              <Card className="text-center cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 group h-full">
                <div className="flex flex-col items-center justify-center p-2">
                  <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow mb-3">
                    <Building2 className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-1">
                    Blood Banks
                  </h3>
                  <p className="text-xs text-gray-600">Manage banks</p>
                </div>
              </Card>
            </Link>

            <Link to="/admin/organizations">
              <Card className="text-center cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 group h-full">
                <div className="flex flex-col items-center justify-center p-2">
                  <div className="bg-gradient-to-r from-purple-600 to-purple-700 p-4 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow mb-3">
                    <Building className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-1">
                    Organizations
                  </h3>
                  <p className="text-xs text-gray-600">Hospitals & NGOs</p>
                </div>
              </Card>
            </Link>

            <Link to="/admin/camps">
              <Card className="text-center cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 group h-full">
                <div className="flex flex-col items-center justify-center p-2">
                  <div className="bg-gradient-to-r from-orange-600 to-orange-700 p-4 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow mb-3">
                    <Calendar className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-1">
                    Blood Camps
                  </h3>
                  <p className="text-xs text-gray-600">Manage camps</p>
                </div>
              </Card>
            </Link>

            <Link to="/requests">
              <Card className="text-center cursor-pointer hover:shadow-xl transition-all duration-300 hover:scale-105 group h-full">
                <div className="flex flex-col items-center justify-center p-2">
                  <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 rounded-xl shadow-lg group-hover:shadow-xl transition-shadow mb-3">
                    <BarChart3 className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-base font-bold text-gray-900 mb-1">
                    Requests
                  </h3>
                  <p className="text-xs text-gray-600">Monitor requests</p>
                </div>
              </Card>
            </Link>
          </div>
        </section>

        {/* ===== SECTION 5: ANALYTICS DASHBOARD ===== */}
        <section>
          <div className="flex items-center mb-6">
            <div className="w-1 h-8 bg-blue-600 rounded-full mr-3"></div>
            <h2 className="text-2xl font-bold text-gray-900">
              Analytics & Insights
            </h2>
          </div>
          <AnalyticsDashboard />
        </section>

        {/* ===== SECTION 6: BLOOD TYPE DISTRIBUTION ===== */}
        {stats?.bloodTypeDistribution &&
          stats.bloodTypeDistribution.length > 0 && (
            <section>
              <div className="flex items-center mb-6">
                <div className="w-1 h-8 bg-red-600 rounded-full mr-3"></div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Blood Type Distribution
                </h2>
              </div>
              <Card className="bg-gradient-to-br from-white to-red-50">
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                  {stats.bloodTypeDistribution.map((item) => (
                    <div
                      key={item._id}
                      className="text-center p-5 bg-white rounded-xl border-2 border-red-100 hover:border-red-300 transition-all duration-300 hover:shadow-lg hover:scale-105"
                    >
                      <div className="text-3xl font-bold text-red-600 mb-2">
                        {item._id}
                      </div>
                      <div className="text-gray-700 text-sm font-semibold">
                        {item.count} users
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </section>
          )}
      </div>
    </div>
  );
};

export default AdminDashboard;
