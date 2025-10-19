import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import axios from "../../utils/axios";
import DashboardLayout from "../../components/DashboardLayout";
import Card from "../../components/Card";
import Loader from "../../components/Loader";
import {
  Calendar,
  MapPin,
  Users,
  Clock,
  Edit2,
  Trash2,
  Eye,
  Plus,
  ChevronDown,
  ChevronUp,
  UserCheck,
  Phone,
  Mail,
  QrCode,
} from "lucide-react";
import toast from "react-hot-toast";

const MyCamps = () => {
  const { user } = useSelector((state) => state.auth);
  const [camps, setCamps] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, upcoming, ongoing, completed
  const [expandedCamp, setExpandedCamp] = useState(null); // Track which camp's donors are shown

  useEffect(() => {
    fetchMyCamps();
  }, []);

  const fetchMyCamps = async () => {
    try {
      setIsLoading(true);
      const { data } = await axios.get("/camps/organization/my-camps");
      setCamps(data.data || []);
    } catch (error) {
      console.error("Error fetching camps:", error);
      toast.error("Failed to load camps");
      setCamps([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (campId) => {
    if (window.confirm("Are you sure you want to delete this camp?")) {
      try {
        await axios.delete(`/camps/${campId}`);
        toast.success("Camp deleted successfully");
        fetchMyCamps();
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete camp");
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800";
      case "ongoing":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-gray-100 text-gray-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredCamps = camps.filter((camp) => {
    if (filter === "all") return true;
    return camp.status === filter;
  });

  if (isLoading) {
    return (
      <DashboardLayout activeTab="my-camps" userType="organization">
        <Loader fullScreen />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeTab="my-camps" userType="organization">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Blood Camps</h1>
            <p className="text-gray-600 mt-1">
              Manage your organization's blood donation camps
            </p>
          </div>
          <Link
            to="/camps/create"
            className="flex items-center space-x-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Create New Camp</span>
          </Link>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card gradient className="text-center">
            <div className="text-3xl font-bold text-gray-900">
              {camps.length}
            </div>
            <div className="text-sm text-gray-600">Total Camps</div>
          </Card>

          <Card gradient className="text-center">
            <div className="text-3xl font-bold text-blue-900">
              {camps.filter((c) => c.status === "upcoming").length}
            </div>
            <div className="text-sm text-gray-600">Upcoming</div>
          </Card>

          <Card gradient className="text-center">
            <div className="text-3xl font-bold text-green-900">
              {camps.filter((c) => c.status === "ongoing").length}
            </div>
            <div className="text-sm text-gray-600">Ongoing</div>
          </Card>

          <Card gradient className="text-center">
            <div className="text-3xl font-bold text-gray-900">
              {camps.filter((c) => c.status === "completed").length}
            </div>
            <div className="text-sm text-gray-600">Completed</div>
          </Card>
        </div>

        {/* Filter Tabs */}
        <div className="flex space-x-2 border-b border-gray-200">
          {["all", "upcoming", "ongoing", "completed"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-4 py-2 font-medium capitalize transition-colors ${
                filter === status
                  ? "text-red-600 border-b-2 border-red-600"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              {status}
            </button>
          ))}
        </div>

        {/* Camps List */}
        {filteredCamps.length === 0 ? (
          <Card className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              {filter === "all" ? "No Camps Created Yet" : `No ${filter} camps`}
            </h3>
            <p className="text-gray-500 mb-6">
              {filter === "all"
                ? "Start organizing blood donation camps to save lives"
                : `You don't have any ${filter} camps at the moment`}
            </p>
            {filter === "all" && (
              <Link
                to="/camps/create"
                className="inline-flex items-center space-x-2 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                <Plus className="h-5 w-5" />
                <span>Create Your First Camp</span>
              </Link>
            )}
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {filteredCamps.map((camp) => (
              <Card
                key={camp._id}
                className="hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                          {camp.title}
                        </h3>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            camp.status
                          )}`}
                        >
                          {camp.status}
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      <div className="flex items-center text-gray-600">
                        <Calendar className="h-5 w-5 mr-2 text-red-600" />
                        <div>
                          <div className="font-medium">
                            {new Date(camp.date).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                            })}
                          </div>
                          <div className="text-sm text-gray-500">
                            {camp.startTime} - {camp.endTime}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-5 w-5 mr-2 text-red-600" />
                        <div>
                          <div className="font-medium">{camp.venue}</div>
                          <div className="text-sm text-gray-500">
                            {camp.city}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <Users className="h-5 w-5 mr-2 text-red-600" />
                        <div>
                          <div className="font-medium">
                            {camp.registeredDonors?.length || 0} /{" "}
                            {camp.expectedDonors} Registered
                          </div>
                          <div className="text-sm text-gray-500">Donors</div>
                        </div>
                      </div>

                      <div className="flex items-center text-gray-600">
                        <Clock className="h-5 w-5 mr-2 text-red-600" />
                        <div>
                          <div className="font-medium">
                            {camp.isApproved ? "Approved" : "Pending Approval"}
                          </div>
                          <div className="text-sm text-gray-500">Status</div>
                        </div>
                      </div>
                    </div>

                    {camp.description && (
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                        {camp.description}
                      </p>
                    )}

                    {/* Registered Donors Section */}
                    {camp.registeredDonors &&
                      camp.registeredDonors.length > 0 && (
                        <div className="mt-4 border-t pt-4">
                          <button
                            onClick={() =>
                              setExpandedCamp(
                                expandedCamp === camp._id ? null : camp._id
                              )
                            }
                            className="flex items-center justify-between w-full text-left font-semibold text-gray-900 hover:text-red-600 transition-colors"
                          >
                            <span className="flex items-center">
                              <UserCheck className="h-5 w-5 mr-2" />
                              Registered Donors ({camp.registeredDonors.length})
                            </span>
                            {expandedCamp === camp._id ? (
                              <ChevronUp className="h-5 w-5" />
                            ) : (
                              <ChevronDown className="h-5 w-5" />
                            )}
                          </button>

                          {expandedCamp === camp._id && (
                            <div className="mt-4 space-y-3 max-h-60 overflow-y-auto">
                              {camp.registeredDonors.map(
                                (registration, idx) => (
                                  <div
                                    key={idx}
                                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200"
                                  >
                                    <div className="flex-1">
                                      <div className="font-semibold text-gray-900">
                                        {registration.donor?.name || "Donor"}
                                      </div>
                                      <div className="text-sm text-gray-600 flex items-center space-x-4 mt-1">
                                        {registration.donor?.phone && (
                                          <span className="flex items-center">
                                            <Phone className="h-3 w-3 mr-1" />
                                            {registration.donor.phone}
                                          </span>
                                        )}
                                        {registration.donor?.bloodType && (
                                          <span className="font-medium text-red-600">
                                            {registration.donor.bloodType}
                                          </span>
                                        )}
                                      </div>
                                      <div className="text-xs text-gray-500 mt-1">
                                        Registered:{" "}
                                        {new Date(
                                          registration.registeredAt
                                        ).toLocaleDateString()}
                                      </div>
                                    </div>
                                    <div>
                                      {registration.attended ? (
                                        <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">
                                          Attended
                                        </span>
                                      ) : (
                                        <span className="px-3 py-1 bg-yellow-100 text-yellow-800 text-xs font-medium rounded-full">
                                          Registered
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      )}
                  </div>

                  <div className="flex flex-col space-y-2 ml-4">
                    <Link
                      to={`/camps/${camp._id}`}
                      className="flex items-center justify-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View</span>
                    </Link>
                    {(camp.status === "upcoming" ||
                      camp.status === "ongoing") && (
                      <Link
                        to={`/organization/camps/${camp._id}/scan`}
                        className="flex items-center justify-center space-x-1 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                      >
                        <QrCode className="h-4 w-4" />
                        <span>Scan QR</span>
                      </Link>
                    )}
                    {camp.status === "upcoming" && (
                      <button
                        onClick={() => handleDelete(camp._id)}
                        className="flex items-center justify-center space-x-1 px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors text-sm"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete</span>
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyCamps;
