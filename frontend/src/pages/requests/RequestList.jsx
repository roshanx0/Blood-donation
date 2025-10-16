import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { getAllRequests } from "../../redux/slices/requestSlice";
import { Search, Filter, MapPin, Calendar, Phone } from "lucide-react";
import Card from "../../components/Card";
import BloodTypeBadge from "../../components/BloodTypeBadge";
import UrgencyBadge from "../../components/UrgencyBadge";
import StatusBadge from "../../components/StatusBadge";
import Loader from "../../components/Loader";
import DashboardLayout from "../../components/DashboardLayout";

const RequestList = () => {
  const { requests, isLoading } = useSelector((state) => state.requests);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  const [filters, setFilters] = useState({
    bloodType: "",
    city: "",
    urgency: "",
    status: "pending",
  });

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(getAllRequests(filters));
  }, [dispatch, filters]);

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const clearFilters = () => {
    setFilters({
      bloodType: "",
      city: "",
      urgency: "",
      status: "pending",
    });
    setSearchTerm("");
  };

  const filteredRequests = requests.filter((request) => {
    const matchesSearch =
      request.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      request.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (request.hospital &&
        request.hospital.toLowerCase().includes(searchTerm.toLowerCase()));

    return matchesSearch;
  });

  const bloodTypes = ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"];

  const isAuthenticated = !!user;
  const userType =
    user?.role === "admin"
      ? "admin"
      : user?.role === "bloodbank"
      ? "bloodbank"
      : user?.role === "organization"
      ? "organization"
      : "user";

  if (isLoading) {
    const loadingContent = (
      <div className="flex justify-center items-center h-screen">
        <Loader />
      </div>
    );

    return isAuthenticated ? (
      <DashboardLayout activeTab="all-requests" userType={userType}>{loadingContent}</DashboardLayout>
    ) : (
      loadingContent
    );
  }

  const pageContent = (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Blood Requests
          </h1>
          <p className="text-gray-600">
            Browse and respond to blood donation requests
          </p>
        </div>

        {/* Search and Filters */}
        <Card className="mb-8">
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Search by patient name, city, or hospital..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="input-field pl-11"
              />
            </div>

            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label htmlFor="bloodType" className="label">
                  Blood Type
                </label>
                <select
                  id="bloodType"
                  name="bloodType"
                  value={filters.bloodType}
                  onChange={handleFilterChange}
                  className="input-field pl-4"
                >
                  <option value="">All Blood Types</option>
                  {bloodTypes.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="city" className="label">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={filters.city}
                  onChange={handleFilterChange}
                  className="input-field pl-4"
                  placeholder="Enter city"
                />
              </div>

              <div>
                <label htmlFor="urgency" className="label">
                  Urgency
                </label>
                <select
                  id="urgency"
                  name="urgency"
                  value={filters.urgency}
                  onChange={handleFilterChange}
                  className="input-field pl-4"
                >
                  <option value="">All Urgencies</option>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>

              <div>
                <label htmlFor="status" className="label">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={filters.status}
                  onChange={handleFilterChange}
                  className="input-field pl-4"
                >
                  <option value="">All Statuses</option>
                  <option value="pending">Pending</option>
                  <option value="fulfilled">Fulfilled</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
            </div>

            {/* Clear Filters Button */}
            <div className="flex justify-end">
              <button
                onClick={clearFilters}
                className="text-sm text-red-600 hover:text-red-700 font-semibold"
              >
                Clear All Filters
              </button>
            </div>
          </div>
        </Card>

        {/* Results Count */}
        <div className="mb-4">
          <p className="text-gray-600">
            Showing <strong>{filteredRequests.length}</strong> request(s)
          </p>
        </div>

        {/* Request List */}
        {filteredRequests.length === 0 ? (
          <Card className="text-center py-12">
            <div className="flex justify-center mb-4">
              <Filter className="h-16 w-16 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No Requests Found
            </h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your filters or search criteria
            </p>
            <button onClick={clearFilters} className="btn-primary">
              Clear Filters
            </button>
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

                      {request.reason && (
                        <p className="text-sm text-gray-600 line-clamp-2">
                          {request.reason}
                        </p>
                      )}

                      <div className="mt-3 text-xs text-gray-500">
                        Posted on{" "}
                        {new Date(request.createdAt).toLocaleDateString()}
                        {request.responses?.length > 0 && (
                          <span className="ml-3 text-green-600 font-semibold">
                            • {request.responses.length} Response(s)
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 lg:mt-0 lg:ml-6">
                    <Link
                      to={`/requests/${request._id}`}
                      className="btn-primary inline-block text-center w-full lg:w-auto"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );

  return isAuthenticated ? (
    <DashboardLayout activeTab="all-requests" userType={userType}>{pageContent}</DashboardLayout>
  ) : (
    pageContent
  );
};

export default RequestList;
