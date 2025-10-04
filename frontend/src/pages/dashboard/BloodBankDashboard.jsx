import { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { getMyRequests, getMatchingRequests } from '../../redux/slices/requestSlice';
import axios from '../../utils/axios';
import {
  Droplet,
  Building2,
  Plus,
  Edit,
  AlertCircle,
  TrendingUp,
  Bell,
} from 'lucide-react';
import Card from '../../components/Card';
import BloodTypeBadge from '../../components/BloodTypeBadge';
import Loader from '../../components/Loader';
import toast from 'react-hot-toast';

const BloodBankDashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const { myRequests, matchingRequests, isLoading } = useSelector(
    (state) => state.requests
  );
  const dispatch = useDispatch();

  const [inventory, setInventory] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    dispatch(getMyRequests());
    dispatch(getMatchingRequests());
    fetchInventory();
  }, [dispatch]);

  const fetchInventory = async () => {
    try {
      const response = await axios.get(`/bloodbanks/${user._id}/inventory`);
      setInventory(response.data.inventory);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    }
  };

  const handleInventoryChange = (bloodType, value) => {
    setInventory((prev) =>
      prev.map((item) =>
        item.bloodType === bloodType
          ? { ...item, quantity: parseInt(value) || 0 }
          : item
      )
    );
  };

  const handleSaveInventory = async () => {
    setIsSaving(true);
    try {
      await axios.put('/bloodbanks/inventory', { inventory });
      toast.success('Inventory updated successfully!');
      setIsEditMode(false);
    } catch (error) {
      toast.error('Failed to update inventory');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return <Loader fullScreen />;
  }

  const totalUnits = inventory.reduce((sum, item) => sum + item.quantity, 0);
  const lowStockItems = inventory.filter((item) => item.quantity < 5);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            {user?.name}
          </h1>
          <p className="text-gray-600">Blood Bank Management Dashboard</p>
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
              {totalUnits}
            </div>
            <div className="text-sm text-gray-600">Total Blood Units</div>
          </Card>

          <Card gradient className="text-center">
            <div className="flex justify-center mb-3">
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-3 rounded-full">
                <Building2 className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {myRequests.length}
            </div>
            <div className="text-sm text-gray-600">My Requests</div>
          </Card>

          <Card gradient className="text-center">
            <div className="flex justify-center mb-3">
              <div className="bg-gradient-to-r from-yellow-600 to-yellow-700 p-3 rounded-full">
                <AlertCircle className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="text-3xl font-bold text-gray-900 mb-1">
              {lowStockItems.length}
            </div>
            <div className="text-sm text-gray-600">Low Stock Items</div>
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
            <div className="text-sm text-gray-600">Requests in City</div>
          </Card>
        </div>

        {/* Low Stock Alert */}
        {lowStockItems.length > 0 && (
          <div className="mb-8">
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
              <div className="flex items-start">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
                <div>
                  <p className="text-sm text-yellow-800 font-semibold mb-1">
                    Low Stock Alert
                  </p>
                  <p className="text-sm text-yellow-700">
                    The following blood types are running low (less than 5 units):{' '}
                    <strong>
                      {lowStockItems.map((item) => item.bloodType).join(', ')}
                    </strong>
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Blood Inventory */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <Droplet className="h-6 w-6 text-red-600 mr-2" />
              Blood Inventory
            </h2>
            {!isEditMode ? (
              <button
                onClick={() => setIsEditMode(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Edit className="h-4 w-4" />
                <span>Update Inventory</span>
              </button>
            ) : (
              <div className="flex space-x-2">
                <button
                  onClick={handleSaveInventory}
                  disabled={isSaving}
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  {isSaving ? (
                    <>
                      <div className="spinner border-white border-t-transparent w-4 h-4"></div>
                      <span>Saving...</span>
                    </>
                  ) : (
                    <span>Save Changes</span>
                  )}
                </button>
                <button
                  onClick={() => {
                    setIsEditMode(false);
                    fetchInventory();
                  }}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
            {inventory.map((item) => (
              <Card
                key={item.bloodType}
                className={`text-center ${
                  item.quantity < 5 ? 'border-2 border-yellow-400' : ''
                }`}
              >
                <BloodTypeBadge bloodType={item.bloodType} size="md" />
                {isEditMode ? (
                  <input
                    type="number"
                    min="0"
                    value={item.quantity}
                    onChange={(e) =>
                      handleInventoryChange(item.bloodType, e.target.value)
                    }
                    className="mt-3 w-full text-center text-2xl font-bold text-gray-900 border-2 border-gray-300 rounded-lg py-1 focus:border-red-500 focus:outline-none"
                  />
                ) : (
                  <div className="mt-3 text-2xl font-bold text-gray-900">
                    {item.quantity}
                  </div>
                )}
                <div className="mt-1 text-xs text-gray-600">units</div>
                {item.quantity < 5 && (
                  <div className="mt-2">
                    <span className="inline-block px-2 py-1 text-xs font-semibold bg-yellow-100 text-yellow-800 rounded-full">
                      Low Stock
                    </span>
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link to="/requests/create">
              <Card className="text-center cursor-pointer hover:shadow-xl transition-shadow">
                <div className="flex justify-center mb-3">
                  <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 rounded-full">
                    <Plus className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  Create Blood Request
                </h3>
                <p className="text-sm text-gray-600">
                  Request blood from donors in your area
                </p>
              </Card>
            </Link>

            <Link to="/requests">
              <Card className="text-center cursor-pointer hover:shadow-xl transition-shadow">
                <div className="flex justify-center mb-3">
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 rounded-full">
                    <TrendingUp className="h-8 w-8 text-white" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-2">
                  View All Requests
                </h3>
                <p className="text-sm text-gray-600">
                  Browse and respond to blood requests
                </p>
              </Card>
            </Link>
          </div>
        </div>

        {/* Recent Requests in Your City */}
        {matchingRequests.length > 0 && (
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                <Bell className="h-6 w-6 text-red-600 mr-2" />
                Blood Requests in {user?.city}
              </h2>
              <Link
                to="/requests"
                className="text-red-600 hover:text-red-700 font-semibold"
              >
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {matchingRequests.slice(0, 3).map((request) => (
                <Card key={request._id} className="hover:shadow-xl transition-shadow">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start space-x-4">
                      <BloodTypeBadge bloodType={request.bloodType} size="md" />
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          {request.patientName}
                        </h3>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div>
                            <span className="font-semibold">Blood Type:</span>{' '}
                            {request.bloodType}
                          </div>
                          <div>
                            <span className="font-semibold">Quantity:</span>{' '}
                            {request.quantity} units
                          </div>
                          <div>
                            <span className="font-semibold">Urgency:</span>{' '}
                            <span
                              className={`badge urgency-${request.urgency}`}
                            >
                              {request.urgency}
                            </span>
                          </div>
                          {request.hospital && (
                            <div>
                              <span className="font-semibold">Hospital:</span>{' '}
                              {request.hospital}
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
          </div>
        )}

        {matchingRequests.length === 0 && (
          <Card className="text-center py-12">
            <div className="flex justify-center mb-4">
              <Bell className="h-16 w-16 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">
              No Active Requests
            </h3>
            <p className="text-gray-600">
              There are no blood requests in your city at the moment.
            </p>
          </Card>
        )}
      </div>
    </div>
  );
};

export default BloodBankDashboard;