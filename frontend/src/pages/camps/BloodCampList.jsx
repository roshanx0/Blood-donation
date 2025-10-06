import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Calendar,
  MapPin,
  Users,
  Building2,
  Search,
  Filter,
  Clock,
  ArrowRight,
} from "lucide-react";
import Card from "../../components/Card";
import Loader from "../../components/Loader";
import axios from "../../utils/axios";

const BloodCampList = () => {
  const [camps, setCamps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    city: "",
    status: "upcoming",
    search: "",
  });

  useEffect(() => {
    fetchCamps();
  }, [filters]);

  const fetchCamps = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (filters.city) params.append("city", filters.city);
      if (filters.status) params.append("status", filters.status);
      if (filters.search) params.append("search", filters.search);

      const response = await axios.get(`/camps?${params.toString()}`);
      if (response.data.success) {
        setCamps(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching camps:", error);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      weekday: "long",
      year: "numeric",
      month: "long",
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

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Blood Donation Camps
          </h1>
          <p className="text-lg text-gray-700 font-medium">
            Find and register for upcoming blood donation camps in your area
          </p>
        </div>

        {/* Filters */}
        <Card className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              <input
                type="text"
                placeholder="Search camps..."
                value={filters.search}
                onChange={(e) =>
                  setFilters({ ...filters, search: e.target.value })
                }
                className="input-field pl-11"
              />
            </div>

            {/* City Filter */}
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              <input
                type="text"
                placeholder="Filter by city..."
                value={filters.city}
                onChange={(e) =>
                  setFilters({ ...filters, city: e.target.value })
                }
                className="input-field pl-11"
              />
            </div>

            {/* Status Filter */}
            <div className="relative">
              <Filter className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
              <select
                value={filters.status}
                onChange={(e) =>
                  setFilters({ ...filters, status: e.target.value })
                }
                className="input-field pl-11"
              >
                <option value="">All Status</option>
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          </div>
        </Card>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-700 font-medium">
            Found <span className="font-bold text-red-600">{camps.length}</span>{" "}
            blood donation camps
          </p>
        </div>

        {/* Camps List */}
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader />
          </div>
        ) : camps.length === 0 ? (
          <Card className="text-center py-12">
            <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No Camps Found
            </h3>
            <p className="text-gray-700 mb-6">
              Try adjusting your filters or check back later for new camps.
            </p>
            <Link
              to="/"
              className="inline-flex items-center px-6 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-all"
            >
              Back to Home
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {camps.map((camp) => (
              <Card
                key={camp._id}
                className="hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col h-full">
                  {/* Status Badge */}
                  <div className="flex justify-between items-start mb-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${getStatusColor(
                        camp.status
                      )}`}
                    >
                      {camp.status}
                    </span>
                    {camp.status === "upcoming" && (
                      <div className="flex items-center text-green-700 bg-green-50 px-3 py-1 rounded-full border border-green-200">
                        <Users className="h-3 w-3 mr-1" />
                        <span className="text-xs font-bold">
                          {camp.registeredDonors?.length || 0}/
                          {camp.expectedDonors}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Camp Title */}
                  <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
                    {camp.title}
                  </h3>

                  {/* Camp Details */}
                  <div className="space-y-3 mb-4 flex-grow">
                    {/* Date & Time */}
                    <div className="flex items-start space-x-3">
                      <Calendar className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          {formatDate(camp.date)}
                        </p>
                        <p className="text-xs text-gray-600 flex items-center mt-1">
                          <Clock className="h-3 w-3 mr-1" />
                          {camp.startTime} - {camp.endTime}
                        </p>
                      </div>
                    </div>

                    {/* Location */}
                    <div className="flex items-start space-x-3">
                      <MapPin className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          {camp.venue}
                        </p>
                        <p className="text-xs text-gray-600">{camp.city}</p>
                      </div>
                    </div>

                    {/* Organizer */}
                    <div className="flex items-start space-x-3">
                      <Building2 className="h-5 w-5 text-red-600 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-gray-900">
                          {camp.organizerDetails?.name || "Organization"}
                        </p>
                        <p className="text-xs text-gray-600 capitalize">
                          {camp.organizerDetails?.type || "Organization"}
                        </p>
                      </div>
                    </div>

                    {/* Description */}
                    {camp.description && (
                      <p className="text-sm text-gray-700 line-clamp-2 mt-3">
                        {camp.description}
                      </p>
                    )}
                  </div>

                  {/* Action Button */}
                  <Link
                    to={`/camps/${camp._id}`}
                    className="flex items-center justify-center space-x-2 w-full py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-all mt-auto"
                  >
                    <span>View Details & Register</span>
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </Card>
            ))}
          </div>
        )}

        {/* CTA for Organizations */}
        <Card className="mt-12 bg-gradient-to-br from-purple-50 to-white border-purple-200">
          <div className="text-center py-8">
            <Building2 className="h-12 w-12 text-purple-600 mx-auto mb-4" />
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Want to Organize a Blood Camp?
            </h3>
            <p className="text-gray-700 mb-6 font-medium">
              Register your hospital, NGO, or college to host blood donation
              camps
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/register/organization"
                className="inline-flex items-center px-6 py-3 bg-purple-600 text-white rounded-lg font-bold hover:bg-purple-700 transition-all shadow-md hover:shadow-lg"
              >
                Register Organization
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link
                to="/camps/create"
                className="inline-flex items-center px-6 py-3 bg-white text-purple-600 border-2 border-purple-600 rounded-lg font-bold hover:bg-purple-50 transition-all"
              >
                Create Blood Camp
                <Calendar className="ml-2 h-4 w-4" />
              </Link>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default BloodCampList;
