import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  Calendar,
  Users,
  TrendingUp,
  AlertCircle,
  Plus,
  Clock,
  CheckCircle,
  XCircle,
  Building2,
  MapPin,
  Phone,
  Mail,
} from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";
import StatCard from "../../components/StatCard";
import Card from "../../components/Card";
import Loader from "../../components/Loader";
import axios from "../../utils/axios";

const OrganizationDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalCamps: 0,
    upcomingCamps: 0,
    completedCamps: 0,
    totalDonors: 0,
  });
  const [camps, setCamps] = useState([]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      // Fetch organization's blood camps
      const campsResponse = await axios.get("/camps/organization/my-camps");
      const campsData = campsResponse.data.data || [];

      setCamps(campsData.slice(0, 5)); // Show latest 5 camps

      // Calculate stats
      const upcoming = campsData.filter(
        (camp) => camp.status === "upcoming"
      ).length;
      const completed = campsData.filter(
        (camp) => camp.status === "completed"
      ).length;
      const totalDonors = campsData.reduce(
        (sum, camp) => sum + (camp.registeredDonors?.length || 0),
        0
      );

      setStats({
        totalCamps: campsData.length,
        upcomingCamps: upcoming,
        completedCamps: completed,
        totalDonors: totalDonors,
      });
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader fullScreen />;
  }

  const getStatusBadge = (status) => {
    const statusStyles = {
      upcoming: "bg-blue-100 text-blue-800",
      ongoing: "bg-green-100 text-green-800",
      completed: "bg-gray-100 text-gray-800",
      cancelled: "bg-red-100 text-red-800",
    };

    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-medium ${
          statusStyles[status] || "bg-gray-100 text-gray-800"
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <DashboardLayout activeTab="overview" userType="organization">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <div className="flex items-start justify-between mb-2">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
                Welcome, {user?.name || "Organization"}!
              </h1>
              <p className="text-gray-600 text-lg flex items-center gap-2">
                <Building2 className="h-5 w-5" />
                {user?.type?.charAt(0).toUpperCase() +
                  user?.type?.slice(1)}{" "}
                Organization
              </p>
            </div>
            <div>
              {user?.isVerified ? (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Verified
                </span>
              ) : (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                  <Clock className="h-4 w-4 mr-1" />
                  Pending Verification
                </span>
              )}
            </div>
          </div>
        </div>
        {/* Verification Alert */}
        {!user?.isVerified && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-3" />
              <div>
                <h3 className="text-sm font-bold text-yellow-800">
                  Account Pending Verification
                </h3>
                <p className="text-sm text-yellow-700 mt-1">
                  Your organization account is awaiting admin verification. Some
                  features may be limited until verification is complete.
                </p>
              </div>
            </div>
          </div>
        )}
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={Calendar}
            title="Total Camps"
            value={stats.totalCamps}
            color="blue"
            subtitle="Organized camps"
          />
          <StatCard
            icon={Clock}
            title="Upcoming Camps"
            value={stats.upcomingCamps}
            color="green"
            subtitle="Scheduled ahead"
          />
          <StatCard
            icon={CheckCircle}
            title="Completed Camps"
            value={stats.completedCamps}
            color="gray"
            subtitle="Successfully done"
          />
          <StatCard
            icon={Users}
            title="Total Donors"
            value={stats.totalDonors}
            color="red"
            subtitle="Lives saved"
          />
        </div>
        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <h2 className="text-xl font-bold text-gray-900 mb-4">
              Quick Actions
            </h2>
            <div className="space-y-3">
              <Link
                to="/camps/create"
                className="flex items-center justify-between p-4 bg-red-50 hover:bg-red-100 rounded-lg transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-red-600 p-2 rounded-lg group-hover:scale-110 transition-transform">
                    <Plus className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Create Blood Camp</p>
                    <p className="text-sm text-gray-600">
                      Organize a new donation camp
                    </p>
                  </div>
                </div>
                <TrendingUp className="h-5 w-5 text-red-600" />
              </Link>

              <Link
                to="/organization/my-camps"
                className="flex items-center justify-between p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-blue-600 p-2 rounded-lg group-hover:scale-110 transition-transform">
                    <Calendar className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">View My Camps</p>
                    <p className="text-sm text-gray-600">
                      Manage your blood camps
                    </p>
                  </div>
                </div>
                <TrendingUp className="h-5 w-5 text-blue-600" />
              </Link>

              <Link
                to="/blood-banks"
                className="flex items-center justify-between p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors group"
              >
                <div className="flex items-center gap-3">
                  <div className="bg-green-600 p-2 rounded-lg group-hover:scale-110 transition-transform">
                    <Building2 className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">Blood Banks</p>
                    <p className="text-sm text-gray-600">
                      Find nearby blood banks
                    </p>
                  </div>
                </div>
                <TrendingUp className="h-5 w-5 text-green-600" />
              </Link>
            </div>
          </Card>
        </div>{" "}
        {/* Recent Camps */}
        <Card>
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Recent Blood Camps
            </h2>
            <Link
              to="/camps"
              className="text-red-600 hover:text-red-700 font-medium text-sm"
            >
              View All →
            </Link>
          </div>

          {camps.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600 mb-4">No blood camps organized yet</p>
              <Link
                to="/camps/create"
                className="inline-flex items-center gap-2 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                <Plus className="h-5 w-5" />
                Create Your First Camp
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {camps.map((camp) => (
                <div
                  key={camp._id}
                  className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                >
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h3 className="font-bold text-gray-900 mb-1">
                        {camp.name}
                      </h3>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <MapPin className="h-4 w-4" />
                        {camp.venue}, {camp.city}
                      </p>
                    </div>
                    {getStatusBadge(camp.status)}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4 text-sm">
                    <div>
                      <p className="text-gray-600">Date</p>
                      <p className="font-medium text-gray-900">
                        {new Date(camp.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Time</p>
                      <p className="font-medium text-gray-900">
                        {camp.startTime} - {camp.endTime}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Donors</p>
                      <p className="font-medium text-gray-900">
                        {camp.registeredDonors?.length || 0}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-600">Contact</p>
                      <p className="font-medium text-gray-900">
                        {camp.contactPhone}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </DashboardLayout>
  );
};

export default OrganizationDashboard;
