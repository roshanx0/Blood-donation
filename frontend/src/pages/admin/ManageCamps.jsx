import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Users,
  Building2,
  Check,
  X,
  Trash2,
  Clock,
  AlertCircle,
  Eye,
} from "lucide-react";
import Card from "../../components/Card";
import Loader from "../../components/Loader";
import axios from "../../utils/axios";
import toast from "react-hot-toast";

const ManageCamps = () => {
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, approved, pending, upcoming, ongoing, completed

  useEffect(() => {
    fetchCamps();
  }, []);

  const fetchCamps = async () => {
    try {
      setLoading(true);
      const response = await axios.get("/admin/camps");
      if (response.data.success) {
        setCamps(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching camps:", error);
      toast.error("Failed to load camps");
    } finally {
      setLoading(false);
    }
  };

  const handleToggleApproval = async (id, currentStatus, title) => {
    if (
      !window.confirm(
        `Are you sure you want to ${
          currentStatus ? "unapprove" : "approve"
        } "${title}"?`
      )
    ) {
      return;
    }

    try {
      const response = await axios.put(`/admin/camps/${id}/approve`);
      if (response.data.success) {
        toast.success(response.data.message);
        fetchCamps();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update camp");
    }
  };

  const handleDelete = async (id, title) => {
    if (
      !window.confirm(
        `Are you sure you want to delete "${title}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const response = await axios.delete(`/admin/camps/${id}`);
      if (response.data.success) {
        toast.success("Blood camp deleted successfully");
        fetchCamps();
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to delete camp");
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "short",
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "ongoing":
        return "bg-green-100 text-green-800 border-green-200";
      case "completed":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const filteredCamps = camps.filter((camp) => {
    if (filter === "approved") return camp.isApproved;
    if (filter === "pending") return !camp.isApproved;
    if (filter === "upcoming") return camp.status === "upcoming";
    if (filter === "ongoing") return camp.status === "ongoing";
    if (filter === "completed") return camp.status === "completed";
    return true;
  });

  const stats = {
    total: camps.length,
    approved: camps.filter((c) => c.isApproved).length,
    pending: camps.filter((c) => !c.isApproved).length,
    upcoming: camps.filter((c) => c.status === "upcoming").length,
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Manage Blood Camps
          </h1>
          <p className="text-lg text-gray-700 font-medium">
            Review and approve blood donation camps created by organizations
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Camps</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  {stats.total}
                </p>
              </div>
              <Calendar className="h-12 w-12 text-gray-400" />
            </div>
          </Card>

          <Card className="bg-green-50 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-700 font-medium">Approved</p>
                <p className="text-3xl font-bold text-green-900 mt-1">
                  {stats.approved}
                </p>
              </div>
              <Check className="h-12 w-12 text-green-600" />
            </div>
          </Card>

          <Card className="bg-yellow-50 border-yellow-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-700 font-medium">
                  Pending Approval
                </p>
                <p className="text-3xl font-bold text-yellow-900 mt-1">
                  {stats.pending}
                </p>
              </div>
              <AlertCircle className="h-12 w-12 text-yellow-600" />
            </div>
          </Card>

          <Card className="bg-blue-50 border-blue-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-700 font-medium">Upcoming</p>
                <p className="text-3xl font-bold text-blue-900 mt-1">
                  {stats.upcoming}
                </p>
              </div>
              <Clock className="h-12 w-12 text-blue-600" />
            </div>
          </Card>
        </div>

        {/* Filters */}
        <Card className="mb-6">
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setFilter("all")}
              className={`px-4 py-2 rounded-lg font-bold transition-all ${
                filter === "all"
                  ? "bg-red-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              All ({stats.total})
            </button>
            <button
              onClick={() => setFilter("pending")}
              className={`px-4 py-2 rounded-lg font-bold transition-all ${
                filter === "pending"
                  ? "bg-yellow-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Pending ({stats.pending})
            </button>
            <button
              onClick={() => setFilter("approved")}
              className={`px-4 py-2 rounded-lg font-bold transition-all ${
                filter === "approved"
                  ? "bg-green-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Approved ({stats.approved})
            </button>
            <button
              onClick={() => setFilter("upcoming")}
              className={`px-4 py-2 rounded-lg font-bold transition-all ${
                filter === "upcoming"
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              Upcoming ({stats.upcoming})
            </button>
          </div>
        </Card>

        {/* Camps List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader />
          </div>
        ) : filteredCamps.length === 0 ? (
          <Card className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No Camps Found
            </h3>
            <p className="text-gray-700">
              {filter === "all"
                ? "No blood camps have been created yet."
                : filter === "approved"
                ? "No approved camps yet."
                : "No pending camps to review."}
            </p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filteredCamps.map((camp) => (
              <Card
                key={camp._id}
                className={`${
                  camp.isApproved ? "border-green-200" : "border-yellow-200"
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  {/* Camp Info */}
                  <div className="flex-1">
                    <div className="flex flex-wrap items-start gap-2 mb-3">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                          camp.isApproved
                            ? "bg-green-100 text-green-800 border border-green-300"
                            : "bg-yellow-100 text-yellow-800 border border-yellow-300"
                        }`}
                      >
                        {camp.isApproved ? "Approved" : "Pending Approval"}
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${getStatusColor(
                          camp.status
                        )}`}
                      >
                        {camp.status}
                      </span>
                      {camp.organizer?.isVerified ? (
                        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-blue-100 text-blue-800 border border-blue-300">
                          Verified Org
                        </span>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-red-100 text-red-800 border border-red-300">
                          Unverified Org
                        </span>
                      )}
                    </div>

                    <h3 className="text-xl font-bold text-gray-900 mb-2">
                      {camp.title}
                    </h3>
                    <p className="text-sm text-gray-700 mb-4 line-clamp-2">
                      {camp.description}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm mb-4">
                      <div className="flex items-center text-gray-700">
                        <Calendar className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="font-medium">
                          {formatDate(camp.date)}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Clock className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="font-medium">
                          {camp.startTime} - {camp.endTime}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <MapPin className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="font-medium">
                          {camp.venue}, {camp.city}
                        </span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Users className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="font-medium">
                          {camp.registeredDonors?.length || 0} /{" "}
                          {camp.expectedDonors} registered
                        </span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <Building2 className="h-4 w-4 mr-2 text-gray-500" />
                        <span className="font-medium">
                          {camp.organizer?.name || "Unknown"} (
                          {camp.organizer?.type || "N/A"})
                        </span>
                      </div>
                    </div>

                    {camp.bloodBankPartner && (
                      <div className="text-xs bg-purple-50 border border-purple-200 rounded-lg px-3 py-2 inline-block">
                        <span className="font-bold">Partner:</span>{" "}
                        {camp.bloodBankPartner.name},{" "}
                        {camp.bloodBankPartner.city}
                      </div>
                    )}

                    <div className="mt-3 text-xs text-gray-500">
                      Created on: {new Date(camp.createdAt).toLocaleString()}
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex lg:flex-col gap-3">
                    <Link
                      to={`/camps/${camp._id}`}
                      target="_blank"
                      className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-100 text-blue-800 border-2 border-blue-300 rounded-lg font-bold hover:bg-blue-200 transition-all"
                    >
                      <Eye className="h-4 w-4" />
                      <span>View</span>
                    </Link>

                    <button
                      onClick={() =>
                        handleToggleApproval(
                          camp._id,
                          camp.isApproved,
                          camp.title
                        )
                      }
                      className={`flex items-center justify-center space-x-2 px-6 py-3 rounded-lg font-bold transition-all ${
                        camp.isApproved
                          ? "bg-yellow-100 text-yellow-800 border-2 border-yellow-300 hover:bg-yellow-200"
                          : "bg-green-600 text-white hover:bg-green-700"
                      }`}
                    >
                      {camp.isApproved ? (
                        <>
                          <X className="h-4 w-4" />
                          <span>Unapprove</span>
                        </>
                      ) : (
                        <>
                          <Check className="h-4 w-4" />
                          <span>Approve</span>
                        </>
                      )}
                    </button>

                    <button
                      onClick={() => handleDelete(camp._id, camp.title)}
                      className="flex items-center justify-center space-x-2 px-6 py-3 bg-red-100 text-red-800 border-2 border-red-300 rounded-lg font-bold hover:bg-red-200 transition-all"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ManageCamps;
