import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  getDashboardStats,
  getPendingBloodBanks,
  approveBloodBank,
  rejectBloodBank,
} from '../../redux/slices/adminSlice';
import {
  Users,
  Building2,
  Clock,
  CheckCircle,
  XCircle,
  BarChart3,
} from 'lucide-react';
import Card from '../../components/Card';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';

const AdminDashboard = () => {
  const { stats, pendingBloodBanks, isLoading } = useSelector(
    (state) => state.admin
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getDashboardStats());
    dispatch(getPendingBloodBanks());
  }, [dispatch]);

  const handleApprove = async (id) => {
    if (window.confirm('Are you sure you want to approve this blood bank?')) {
      await dispatch(approveBloodBank(id));
      dispatch(getPendingBloodBanks());
    }
  };

  const handleReject = async (id) => {
    if (
      window.confirm(
        'Are you sure you want to reject this blood bank registration? This action cannot be undone.'
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Admin Dashboard
          </h1>
          <p className="text-gray-600">
            Manage blood banks, users, and system overview
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card gradient className="text-center">
            <div className="flex justify-center mb-3">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-3 rounded-full">
                <Users className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats?.totalUsers || 0}
            </div>
            <div className="text-sm text-gray-600">Total Users</div>
          </Card>

          <Card gradient className="text-center">
            <div className="flex justify-center mb-3">
              <div className="bg-gradient-to-r from-green-600 to-green-700 p-3 rounded-full">
                <Building2 className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats?.totalBloodBanks || 0}
            </div>
            <div className="text-sm text-gray-600">Blood Banks</div>
          </Card>

          <Card gradient className="text-center">
            <div className="flex justify-center mb-3">
              <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 p-3 rounded-full">
                <Clock className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats?.pendingBloodBanks || 0}
            </div>
            <div className="text-sm text-gray-600">Pending Approvals</div>
          </Card>

          <Card gradient className="text-center">
            <div className="flex justify-center mb-3">
              <div className="bg-gradient-to-r from-red-600 to-red-700 p-3 rounded-full">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {stats?.bloodTypeDistribution?.length || 0}
            </div>
            <div className="text-sm text-gray-600">Blood Types</div>
          </Card>
        </div>

        {/* Blood Type Distribution */}
        {stats?.bloodTypeDistribution && stats.bloodTypeDistribution.length > 0 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Blood Type Distribution
            </h2>
            <Card>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
                {stats.bloodTypeDistribution.map((item) => (
                  <div
                    key={item._id}
                    className="text-center p-4 bg-gradient-to-br from-red-50 to-white rounded-lg border border-red-100"
                  >
                    <div className="text-2xl font-bold text-red-600 mb-1">
                      {item._id}
                    </div>
                    <div className="text-gray-600 text-sm">{item.count} users</div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Link to="/admin/users">
              <Card className="text-center cursor-pointer hover:shadow-xl transition-shadow">
                <div className="flex justify-center mb-3">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 rounded-full">
                    <Users className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Manage Users
                </h3>
                <p className="text-sm text-gray-600">View and manage all users</p>
              </Card>
            </Link>

            <Link to="/admin/blood-banks">
              <Card className="text-center cursor-pointer hover:shadow-xl transition-shadow">
                <div className="flex justify-center mb-3">
                  <div className="bg-gradient-to-r from-green-600 to-green-700 p-4 rounded-full">
                    <Building2 className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Blood Banks
                </h3>
                <p className="text-sm text-gray-600">Manage blood banks</p>
              </Card>
            </Link>

            <Link to="/requests">
              <Card className="text-center cursor-pointer hover:shadow-xl transition-shadow">
                <div className="flex justify-center mb-3">
                  <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 rounded-full">
                    <BarChart3 className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  View Requests
                </h3>
                <p className="text-sm text-gray-600">Monitor blood requests</p>
              </Card>
            </Link>
          </div>
        </div>

        {/* Pending Blood Bank Approvals */}
        {pendingBloodBanks.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
              <Clock className="h-6 w-6 text-yellow-600 mr-2" />
              Pending Blood Bank Approvals ({pendingBloodBanks.length})
            </h2>

            <div className="space-y-4">
              {pendingBloodBanks.map((bloodBank) => (
                <Card key={bloodBank._id} className="hover:shadow-xl transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-start md:justify-between">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-3">
                        {bloodBank.name}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-gray-600">
                        <div>
                          <span className="font-semibold">Email:</span>{' '}
                          {bloodBank.email}
                        </div>
                        <div>
                          <span className="font-semibold">Phone:</span>{' '}
                          {bloodBank.phone}
                        </div>
                        <div>
                          <span className="font-semibold">City:</span>{' '}
                          {bloodBank.city}
                        </div>
                        <div>
                          <span className="font-semibold">License:</span>{' '}
                          {bloodBank.licenseNumber}
                        </div>
                        <div className="md:col-span-2">
                          <span className="font-semibold">Address:</span>{' '}
                          {bloodBank.address}
                        </div>
                        <div>
                          <span className="font-semibold">Registered:</span>{' '}
                          {new Date(bloodBank.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>

                    <div className="flex space-x-3 mt-4 md:mt-0 md:ml-6">
                      <button
                        onClick={() => handleApprove(bloodBank._id)}
                        className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>Approve</span>
                      </button>
                      <button
                        onClick={() => handleReject(bloodBank._id)}
                        className="flex items-center space-x-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                      >
                        <XCircle className="h-4 w-4" />
                        <span>Reject</span>
                      </button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}

        {pendingBloodBanks.length === 0 && (
          <Card className="text-center py-12">
            <div className="flex justify-center mb-4">
              <CheckCircle className="h-16 w-16 text-green-500" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              All Caught Up!
            </h3>
            <p className="text-gray-600">
              There are no pending blood bank approvals at the moment.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;