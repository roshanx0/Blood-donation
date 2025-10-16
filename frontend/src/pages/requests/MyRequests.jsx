import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { getMyRequests, deleteRequest } from "../../redux/slices/requestSlice";
import {
  Calendar,
  MapPin,
  Phone,
  Trash2,
  Eye,
  MessageCircle,
} from "lucide-react";
import Card from "../../components/Card";
import BloodTypeBadge from "../../components/BloodTypeBadge";
import UrgencyBadge from "../../components/UrgencyBadge";
import StatusBadge from "../../components/StatusBadge";
import Loader from "../../components/Loader";
import DashboardLayout from "../../components/DashboardLayout";

const MyRequests = () => {
  const { myRequests, isLoading } = useSelector((state) => state.requests);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [filter, setFilter] = useState("all");

  useEffect(() => {
    dispatch(getMyRequests());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Are you sure you want to delete this request? This action cannot be undone."
      )
    ) {
      await dispatch(deleteRequest(id));
    }
  };

  const filteredRequests =
    filter === "all"
      ? myRequests
      : myRequests.filter((req) => req.status === filter);

  // Determine user type for DashboardLayout
  const userType =
    user?.role === "admin"
      ? "admin"
      : user?.role === "bloodbank"
      ? "bloodbank"
      : user?.role === "organization"
      ? "organization"
      : "user";

  if (isLoading) {
    return (
      <DashboardLayout activeTab="my-requests" userType={userType}>
        <Loader fullScreen />
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout activeTab="my-requests" userType={userType}>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">My Requests</h1>
          <p className="text-gray-600">
            View and manage your blood donation requests
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="mb-6">
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => setFilter("all")}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                filter === "all"
                  ? "bg-red-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              All ({myRequests.length})
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                filter === "pending"
                  ? "bg-yellow-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Pending (
              {myRequests.filter((req) => req.status === "pending").length})
            </button>
            <button
              onClick={() => setFilter("fulfilled")}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                filter === "fulfilled"
                  ? "bg-green-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Fulfilled (
              {myRequests.filter((req) => req.status === "fulfilled").length})
            </button>
            <button
              onClick={() => setFilter("cancelled")}
              className={`px-6 py-3 rounded-lg font-semibold transition-all ${
                filter === "cancelled"
                  ? "bg-gray-600 text-white shadow-lg"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              Cancelled (
              {myRequests.filter((req) => req.status === "cancelled").length})
            </button>
          </div>
        </div>

        {/* Request List */}
        {filteredRequests.length === 0 ? (
          <Card className="text-center py-12">
            <div className="flex justify-center mb-4">
              <MessageCircle className="h-16 w-16 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No Requests Found
            </h3>
            <p className="text-gray-600 mb-6">
              {filter === "all"
                ? "You haven't created any blood requests yet"
                : `You don't have any ${filter} requests`}
            </p>
            <Link to="/requests/create" className="btn-primary inline-block">
              Create Your First Request
            </Link>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredRequests.map((request) => (
              <Card
                key={request._id}
                className="hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
                  <div className="flex items-start space-x-4 flex-1">
                    <BloodTypeBadge bloodType={request.bloodType} size="lg" />

                    <div className="flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-2">
                        <h3 className="text-xl font-bold text-gray-900">
                          {request.patientName}
                        </h3>
                        <UrgencyBadge urgency={request.urgency} />
                        <StatusBadge status={request.status} />
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm text-gray-600 mb-3">
                        <div className="flex items-center space-x-2">
                          <MapPin className="h-4 w-4 flex-shrink-0" />
                          <span>{request.city}</span>
                        </div>
                        {request.hospital && (
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4 flex-shrink-0" />
                            <span>{request.hospital}</span>
                          </div>
                        )}
                        <div className="flex items-center space-x-2">
                          <Phone className="h-4 w-4 flex-shrink-0" />
                          <span>{request.contactNumber}</span>
                        </div>
                        <div>
                          <span className="font-semibold">Quantity:</span>{" "}
                          {request.quantity} unit(s)
                        </div>
                      </div>

                      <div className="flex items-center space-x-4 text-xs text-gray-500">
                        <span>
                          Posted on{" "}
                          {new Date(request.createdAt).toLocaleDateString()}
                        </span>
                        {request.responses?.length > 0 && (
                          <span className="flex items-center space-x-1 text-green-600 font-semibold">
                            <MessageCircle className="h-3 w-3" />
                            <span>{request.responses.length} Response(s)</span>
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-2 mt-4 lg:mt-0 lg:ml-6">
                    <Link
                      to={`/requests/${request._id}`}
                      className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View</span>
                    </Link>
                    {request.status === "pending" && (
                      <button
                        onClick={() => handleDelete(request._id)}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
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

export default MyRequests;
