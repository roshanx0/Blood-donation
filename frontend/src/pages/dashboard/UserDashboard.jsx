import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { getMyRequests, getMatchingRequests } from '../../redux/slices/requestSlice';
import {
  Droplet,
  Heart,
  Bell,
  Plus,
  Calendar,
  MapPin,
  Phone,
  AlertCircle,
} from 'lucide-react';
import Card from '../../components/Card';
import BloodTypeBadge from '../../components/BloodTypeBadge';
import UrgencyBadge from '../../components/UrgencyBadge';
import StatusBadge from '../../components/StatusBadge';
import Loader from '../../components/Loader';

const UserDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { myRequests, matchingRequests, isLoading } = useSelector(
    (state) => state.requests
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMyRequests());
    dispatch(getMatchingRequests());
  }, [dispatch]);

  if (isLoading) {
    return <Loader fullScreen />;
  }

  const pendingRequests = myRequests.filter((req) => req.status === 'pending');
  const fulfilledRequests = myRequests.filter((req) => req.status === 'fulfilled');

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Welcome back, {user?.name}! 👋
          </h1>
          <p className="text-gray-600">
            Here's your blood donation dashboard overview
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card gradient className="text-center">
            <div className="flex justify-center mb-3">
              <div className="bg-gradient-to-r from-red-600 to-red-700 p-3 rounded-full">
                <Droplet className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {user?.bloodType}
            </div>
            <div className="text-sm text-gray-600">Your Blood Type</div>
          </Card>

          <Card gradient className="text-center">
            <div className="flex justify-center mb-3">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-3 rounded-full">
                <Heart className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {myRequests.length}
            </div>
            <div className="text-sm text-gray-600">Total Requests</div>
          </Card>

          <Card gradient className="text-center">
            <div className="flex justify-center mb-3">
              <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 p-3 rounded-full">
                <Calendar className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {pendingRequests.length}
            </div>
            <div className="text-sm text-gray-600">Pending</div>
          </Card>

          <Card gradient className="text-center">
            <div className="flex justify-center mb-3">
              <div className="bg-gradient-to-r from-green-600 to-green-700 p-3 rounded-full">
                <Bell className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {matchingRequests.length}
            </div>
            <div className="text-sm text-gray-600">Matching Requests</div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/requests/create">
              <Card className="text-center cursor-pointer hover:shadow-xl transition-shadow">
                <div className="flex justify-center mb-3">
                  <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 rounded-full">
                    <Plus className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Create Request
                </h3>
                <p className="text-sm text-gray-600">
                  Need blood? Create a new request
                </p>
              </Card>
            </Link>

            <Link to="/requests">
              <Card className="text-center cursor-pointer hover:shadow-xl transition-shadow">
                <div className="flex justify-center mb-3">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 rounded-full">
                    <Droplet className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Browse Requests
                </h3>
                <p className="text-sm text-gray-600">
                  View all blood requests
                </p>
              </Card>
            </Link>

            <Link to="/blood-banks">
              <Card className="text-center cursor-pointer hover:shadow-xl transition-shadow">
                <div className="flex justify-center mb-3">
                  <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 rounded-full">
                    <MapPin className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Find Blood Banks
                </h3>
                <p className="text-sm text-gray-600">
                  Locate nearby blood banks
                </p>
              </Card>
            </Link>
          </div>
        </div>

        {/* Matching Requests (Notifications) */}
        {matchingRequests.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <Bell className="h-6 w-6 text-red-600 mr-2 animate-pulse" />
                Requests in Your Area
              </h2>
              <Link
                to="/requests"
                className="text-red-600 hover:text-red-700 font-semibold"
              >
                View All →
              </Link>
            </div>

            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-2" />
                <p className="text-sm text-yellow-800">
                  There are <strong>{matchingRequests.length}</strong> blood
                  requests matching your blood type ({user?.bloodType}) in{' '}
                  {user?.city}. You can help save lives!
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {matchingRequests.slice(0, 3).map((request) => (
                <Card key={request._id} className="hover:shadow-xl transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start space-x-4">
                      <BloodTypeBadge bloodType={request.bloodType} size="md" />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-bold text-gray-900">
                            {request.patientName}
                          </h3>
                          <UrgencyBadge urgency={request.urgency} />
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4" />
                            <span>{request.city}</span>
                          </div>
                          {request.hospital && (
                            <div className="flex items-center space-x-2">
                              <Calendar className="h-4 w-4" />
                              <span>{request.hospital}</span>
                            </div>
                          )}
                          <div className="flex items-center space-x-2">
                            <Phone className="h-4 w-4" />
                            <span>{request.contactNumber}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0">
                      <Link
                        to={`/requests/${request._id}`}
                        className="btn-primary inline-block text-center"
                      >
                        View Details
                      </Link>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* My Requests */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900">My Requests</h2>
            <Link
              to="/requests/my-requests"
              className="text-red-600 hover:text-red-700 font-semibold"
            >
              View All →
            </Link>
          </div>

          {myRequests.length === 0 ? (
            <Card className="text-center py-12">
              <div className="flex justify-center mb-4">
                <Droplet className="h-16 w-16 text-gray-400" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">
                No Requests Yet
              </h3>
              <p className="text-gray-600 mb-6">
                You haven't created any blood requests yet
              </p>
              <Link to="/requests/create" className="btn-primary inline-block">
                Create Your First Request
              </Link>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {myRequests.slice(0, 3).map((request) => (
                <Card key={request._id} className="hover:shadow-xl transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start space-x-4">
                      <BloodTypeBadge bloodType={request.bloodType} size="md" />
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <h3 className="text-lg font-bold text-gray-900">
                            {request.patientName}
                          </h3>
                          <UrgencyBadge urgency={request.urgency} />
                          <StatusBadge status={request.status} />
                        </div>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <MapPin className="h-4 w-4" />
                            <span>{request.city}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Calendar className="h-4 w-4" />
                            <span>
                              {new Date(request.createdAt).toLocaleDateString()}
                            </span>
                          </div>
                          {request.responses?.length > 0 && (
                            <div className="text-green-600 font-semibold">
                              {request.responses.length} Response(s) Received
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 md:mt-0">
                      <Link
                        to={`/requests/${request._id}`}
                        className="btn-primary inline-block text-center"
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
    </div>
  );
};

export default UserDashboard;