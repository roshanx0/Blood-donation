import { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import {
  getMyRequests,
  getMatchingRequests,
} from "../../redux/slices/requestSlice";
import axios from "../../utils/axios";
import {
  Droplet,
  Building2,
  Plus,
  Edit,
  AlertCircle,
  TrendingUp,
  Bell,
  FileText,
  Save,
  X,
} from "lucide-react";
import DashboardLayout from "../../components/DashboardLayout";
import StatCard from "../../components/StatCard";
import Card from "../../components/Card";
import BloodTypeBadge from "../../components/BloodTypeBadge";
import Loader from "../../components/Loader";
import toast from "react-hot-toast";

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
      const inventoryData = response.data.inventory || [];

      // Initialize inventory if empty
      if (inventoryData.length === 0) {
        const defaultInventory = [
          { bloodType: "A+", quantity: 0 },
          { bloodType: "A-", quantity: 0 },
          { bloodType: "B+", quantity: 0 },
          { bloodType: "B-", quantity: 0 },
          { bloodType: "AB+", quantity: 0 },
          { bloodType: "AB-", quantity: 0 },
          { bloodType: "O+", quantity: 0 },
          { bloodType: "O-", quantity: 0 },
        ];
        setInventory(defaultInventory);
      } else {
        setInventory(inventoryData);
      }
    } catch (error) {
      console.error("Error fetching inventory:", error);
      toast.error("Failed to load inventory");
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
      await axios.put("/bloodbanks/inventory", { inventory });
      toast.success("Inventory updated successfully!");
      setIsEditMode(false);
    } catch (error) {
      toast.error("Failed to update inventory");
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
    <DashboardLayout activeTab="overview" userType="bloodbank">
      <div className="space-y-6">
        {/* Welcome Section */}
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            {user?.name}
          </h1>
          <p className="text-gray-600 text-lg">
            Blood Bank Management Dashboard
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            icon={Droplet}
            title="Total Blood Units"
            value={totalUnits}
            color="red"
            subtitle="Available in stock"
          />

          <StatCard
            icon={FileText}
            title="My Requests"
            value={myRequests.length}
            color="blue"
            subtitle="Requests created"
          />
          <StatCard
            icon={AlertCircle}
            title="Low Stock Items"
            value={lowStockItems.length}
            color="yellow"
            subtitle="Requires attention"
          />
          <StatCard
            icon={Bell}
            title="Requests in City"
            value={matchingRequests.length}
            color="green"
            subtitle="In your area"
          />
        </div>

        {/* Low Stock Alert */}
        {lowStockItems.length > 0 && (
          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
            <div className="flex items-start">
              <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5 mr-2 flex-shrink-0" />
              <div>
                <p className="text-sm text-yellow-800 font-semibold mb-1">
                  Low Stock Alert
                </p>
                <p className="text-sm text-yellow-700">
                  The following blood types are running low (less than 5 units):{" "}
                  <strong>
                    {lowStockItems.map((item) => item.bloodType).join(", ")}
                  </strong>
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Blood Inventory */}
        <Card>
          <div className="flex items-center justify-between mb-6">
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
                  className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  <Save className="h-4 w-4" />
                  <span>{isSaving ? "Saving..." : "Save"}</span>
                </button>
                <button
                  onClick={() => {
                    setIsEditMode(false);
                    fetchInventory();
                  }}
                  className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  <X className="h-4 w-4" />
                  <span>Cancel</span>
                </button>
              </div>
            )}
          </div>

          {inventory.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 text-lg">Loading inventory...</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-4">
              {inventory.map((item) => (
                <div
                  key={item.bloodType}
                  className={`bg-white rounded-lg p-4 border text-center ${
                    item.quantity < 5
                      ? "border-2 border-yellow-400"
                      : "border-gray-200"
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
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Link to="/requests/create">
              <Card className="text-center cursor-pointer hover:shadow-xl transition-shadow">
                <div className="flex justify-center mb-3">
                  <div className="bg-gradient-to-r from-red-600 to-red-700 p-4 rounded-xl shadow-md">
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
                  <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-4 rounded-xl shadow-md">
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
                className="text-red-600 hover:text-red-700 font-semibold text-sm"
              >
                View All →
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-4">
              {matchingRequests.slice(0, 3).map((request) => (
                <Card
                  key={request._id}
                  className="hover:shadow-xl transition-shadow"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex items-start space-x-4">
                      <BloodTypeBadge bloodType={request.bloodType} size="md" />
                      <div className="flex-1">
                        <h3 className="text-lg font-bold text-gray-900 mb-2">
                          {request.patientName}
                        </h3>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div>
                            <span className="font-semibold">Blood Type:</span>{" "}
                            {request.bloodType}
                          </div>
                          <div>
                            <span className="font-semibold">Quantity:</span>{" "}
                            {request.quantity} units
                          </div>
                          <div>
                            <span className="font-semibold">Urgency:</span>{" "}
                            <span
                              className={`badge urgency-${request.urgency}`}
                            >
                              {request.urgency}
                            </span>
                          </div>
                          {request.hospital && (
                            <div>
                              <span className="font-semibold">Hospital:</span>{" "}
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
    </DashboardLayout>
  );
};

export default BloodBankDashboard;
