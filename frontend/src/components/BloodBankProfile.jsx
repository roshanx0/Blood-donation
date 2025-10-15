import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  FileText,
  Edit2,
  Save,
  X,
  CheckCircle,
  Clock,
} from "lucide-react";
import Card from "./Card";
import toast from "react-hot-toast";
import axios from "../utils/axios";
import { setUser } from "../redux/slices/authSlice";

const BloodBankProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
    city: user?.city || "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await axios.put("/auth/profile", formData);
      dispatch(setUser(response.data.user));
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || "",
      phone: user?.phone || "",
      address: user?.address || "",
      city: user?.city || "",
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <Building2 className="h-6 w-6 text-red-600 mr-2" />
            Blood Bank Profile
          </h2>
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit2 className="h-4 w-4" />
              <span>Edit Profile</span>
            </button>
          ) : (
            <div className="flex space-x-2">
              <button
                onClick={handleSubmit}
                disabled={isSaving}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                <Save className="h-4 w-4" />
                <span>{isSaving ? "Saving..." : "Save"}</span>
              </button>
              <button
                onClick={handleCancel}
                disabled={isSaving}
                className="flex items-center space-x-2 px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
              >
                <X className="h-4 w-4" />
                <span>Cancel</span>
              </button>
            </div>
          )}
        </div>

        {/* Approval Status Banner */}
        <div
          className={`mb-6 p-4 rounded-lg border-2 ${
            user?.isApproved
              ? "bg-green-50 border-green-200"
              : "bg-yellow-50 border-yellow-200"
          }`}
        >
          <div className="flex items-center space-x-3">
            {user?.isApproved ? (
              <>
                <CheckCircle className="h-6 w-6 text-green-600" />
                <div>
                  <p className="font-semibold text-green-900">
                    Verified Blood Bank
                  </p>
                  <p className="text-sm text-green-700">
                    Your blood bank is approved and active
                  </p>
                </div>
              </>
            ) : (
              <>
                <Clock className="h-6 w-6 text-yellow-600" />
                <div>
                  <p className="font-semibold text-yellow-900">
                    Pending Approval
                  </p>
                  <p className="text-sm text-yellow-700">
                    Your blood bank registration is awaiting admin verification
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Profile Avatar */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center shadow-lg">
            <Building2 className="h-12 w-12 text-white" />
          </div>
        </div>

        {/* Profile Information */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Blood Bank Name */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blood Bank Name
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              ) : (
                <div className="flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-lg">
                  <Building2 className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-900 font-medium text-lg">
                    {user?.name}
                  </span>
                </div>
              )}
            </div>

            {/* Email (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-lg opacity-60 cursor-not-allowed">
                <Mail className="h-5 w-5 text-gray-400" />
                <span className="text-gray-900">{user?.email}</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                Email cannot be changed
              </p>
            </div>

            {/* Phone */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Phone Number
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  pattern="[0-9]{10}"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="10 digit number"
                />
              ) : (
                <div className="flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-lg">
                  <Phone className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-900 font-medium">
                    {user?.phone}
                  </span>
                </div>
              )}
            </div>

            {/* License Number (Read-only) */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                License Number
              </label>
              <div className="flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-lg opacity-60 cursor-not-allowed">
                <FileText className="h-5 w-5 text-gray-400" />
                <span className="text-gray-900 font-mono">
                  {user?.licenseNumber}
                </span>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                License number cannot be changed
              </p>
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                City
              </label>
              {isEditing ? (
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              ) : (
                <div className="flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-lg">
                  <MapPin className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-900 font-medium">
                    {user?.city}
                  </span>
                </div>
              )}
            </div>

            {/* Address */}
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Address
              </label>
              {isEditing ? (
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows="3"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  placeholder="Enter complete address"
                />
              ) : (
                <div className="flex items-start space-x-3 px-4 py-3 bg-gray-50 rounded-lg">
                  <MapPin className="h-5 w-5 text-gray-400 mt-0.5" />
                  <span className="text-gray-900">{user?.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Additional Information */}
          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Account Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Account Type:</span>
                <span className="ml-2 font-medium text-gray-900">
                  Blood Bank
                </span>
              </div>
              <div>
                <span className="text-gray-600">Registered Since:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {new Date(user?.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Status:</span>
                <span
                  className={`ml-2 font-medium ${
                    user?.isActive ? "text-green-600" : "text-red-600"
                  }`}
                >
                  {user?.isActive ? "Active" : "Inactive"}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Approval Status:</span>
                <span
                  className={`ml-2 font-medium ${
                    user?.isApproved ? "text-green-600" : "text-yellow-600"
                  }`}
                >
                  {user?.isApproved ? "Approved" : "Pending"}
                </span>
              </div>
              <div className="md:col-span-2">
                <span className="text-gray-600">Blood Bank ID:</span>
                <span className="ml-2 font-mono text-xs text-gray-600">
                  {user?._id}
                </span>
              </div>
            </div>
          </div>
        </form>
      </Card>

      {/* Important Information */}
      <Card>
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <FileText className="h-5 w-5 text-red-600 mr-2" />
          Important Information
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start">
            <span className="text-red-600 mr-2">•</span>
            <span>Keep your blood inventory updated regularly</span>
          </li>
          <li className="flex items-start">
            <span className="text-red-600 mr-2">•</span>
            <span>Respond promptly to blood requests in your area</span>
          </li>
          <li className="flex items-start">
            <span className="text-red-600 mr-2">•</span>
            <span>Ensure proper storage and handling of blood units</span>
          </li>
          <li className="flex items-start">
            <span className="text-red-600 mr-2">•</span>
            <span>Maintain accurate records of all transactions</span>
          </li>
          <li className="flex items-start">
            <span className="text-red-600 mr-2">•</span>
            <span>
              Contact admin for any technical issues or verification queries
            </span>
          </li>
        </ul>
      </Card>
    </div>
  );
};

export default BloodBankProfile;
