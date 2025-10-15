import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  User,
  Mail,
  Phone,
  MapPin,
  Droplet,
  Edit2,
  Save,
  X,
} from "lucide-react";
import Card from "./Card";
import toast from "react-hot-toast";
import axios from "../utils/axios";
import { setUser } from "../redux/slices/authSlice";

const UserProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    city: user?.city || "",
    bloodType: user?.bloodType || "",
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
      city: user?.city || "",
      bloodType: user?.bloodType || "",
    });
    setIsEditing(false);
  };

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <Card>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center">
            <User className="h-6 w-6 text-red-600 mr-2" />
            My Profile
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

        {/* Profile Avatar */}
        <div className="flex justify-center mb-6">
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center shadow-lg">
              <User className="h-12 w-12 text-white" />
            </div>
            <div className="absolute -bottom-2 -right-2 bg-white rounded-full p-2 shadow-md">
              <Droplet className="h-5 w-5 text-red-600" />
            </div>
          </div>
        </div>

        {/* Profile Information */}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Full Name
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
                  <User className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-900 font-medium">
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

            {/* Blood Type */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Blood Type
              </label>
              {isEditing ? (
                <select
                  name="bloodType"
                  value={formData.bloodType}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                >
                  <option value="">Select Blood Type</option>
                  <option value="A+">A+</option>
                  <option value="A-">A-</option>
                  <option value="B+">B+</option>
                  <option value="B-">B-</option>
                  <option value="AB+">AB+</option>
                  <option value="AB-">AB-</option>
                  <option value="O+">O+</option>
                  <option value="O-">O-</option>
                </select>
              ) : (
                <div className="flex items-center space-x-3 px-4 py-2 bg-red-50 rounded-lg border-2 border-red-200">
                  <Droplet className="h-5 w-5 text-red-600" />
                  <span className="text-red-900 font-bold text-lg">
                    {user?.bloodType}
                  </span>
                </div>
              )}
            </div>

            {/* Account Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Account Status
              </label>
              <div className="flex items-center space-x-3 px-4 py-2 bg-green-50 rounded-lg border border-green-200">
                <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-green-900 font-medium">Active</span>
              </div>
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
                  Donor/Recipient
                </span>
              </div>
              <div>
                <span className="text-gray-600">Member Since:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {new Date(user?.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Role:</span>
                <span className="ml-2 font-medium text-gray-900 capitalize">
                  {user?.role}
                </span>
              </div>
              <div>
                <span className="text-gray-600">User ID:</span>
                <span className="ml-2 font-mono text-xs text-gray-600">
                  {user?._id}
                </span>
              </div>
            </div>
          </div>
        </form>
      </Card>

      {/* Blood Donation Tips */}
      <Card>
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <Droplet className="h-5 w-5 text-red-600 mr-2" />
          Blood Donation Tips
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start">
            <span className="text-red-600 mr-2">•</span>
            <span>Drink plenty of water before and after donation</span>
          </li>
          <li className="flex items-start">
            <span className="text-red-600 mr-2">•</span>
            <span>Eat a healthy meal before donating blood</span>
          </li>
          <li className="flex items-start">
            <span className="text-red-600 mr-2">•</span>
            <span>Rest for at least 10-15 minutes after donation</span>
          </li>
          <li className="flex items-start">
            <span className="text-red-600 mr-2">•</span>
            <span>Avoid heavy lifting for the rest of the day</span>
          </li>
          <li className="flex items-start">
            <span className="text-red-600 mr-2">•</span>
            <span>You can donate whole blood every 56 days</span>
          </li>
        </ul>
      </Card>
    </div>
  );
};

export default UserProfile;
