import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  Building2,
  Mail,
  Phone,
  MapPin,
  User,
  FileText,
  Edit2,
  Save,
  X,
  CheckCircle,
  Clock,
  Calendar,
} from "lucide-react";
import Card from "./Card";
import toast from "react-hot-toast";
import axios from "../utils/axios";
import { setUser } from "../redux/slices/authSlice";

const OrganizationProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    address: user?.address || "",
    city: user?.city || "",
    description: user?.description || "",
    contactPerson: {
      name: user?.contactPerson?.name || "",
      designation: user?.contactPerson?.designation || "",
      phone: user?.contactPerson?.phone || "",
    },
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("contactPerson.")) {
      const field = name.split(".")[1];
      setFormData({
        ...formData,
        contactPerson: { ...formData.contactPerson, [field]: value },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
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
      description: user?.description || "",
      contactPerson: {
        name: user?.contactPerson?.name || "",
        designation: user?.contactPerson?.designation || "",
        phone: user?.contactPerson?.phone || "",
      },
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
            Organization Profile
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

        {/* Verification Status Banner */}
        <div
          className={`mb-6 p-4 rounded-lg border-2 ${
            user?.isVerified
              ? "bg-green-50 border-green-200"
              : "bg-yellow-50 border-yellow-200"
          }`}
        >
          <div className="flex items-center space-x-3">
            {user?.isVerified ? (
              <>
                <CheckCircle className="h-6 w-6 text-green-600" />
                <div>
                  <p className="font-semibold text-green-900">
                    Verified Organization
                  </p>
                  <p className="text-sm text-green-700">
                    Your organization is verified and can host blood camps
                  </p>
                </div>
              </>
            ) : (
              <>
                <Clock className="h-6 w-6 text-yellow-600" />
                <div>
                  <p className="font-semibold text-yellow-900">
                    Pending Verification
                  </p>
                  <p className="text-sm text-yellow-700">
                    Your organization registration is awaiting admin
                    verification
                  </p>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Profile Avatar */}
        <div className="flex justify-center mb-6">
          <div className="w-24 h-24 bg-gradient-to-br from-blue-600 to-blue-700 rounded-full flex items-center justify-center shadow-lg">
            <Building2 className="h-12 w-12 text-white" />
          </div>
        </div>

        {/* Profile Information */}
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Information */}
          <div>
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Organization Name */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization Name
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

              {/* Type (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Organization Type
                </label>
                <div className="flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-lg opacity-60 cursor-not-allowed">
                  <Building2 className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-900 capitalize">{user?.type}</span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Organization type cannot be changed
                </p>
              </div>

              {/* Registration Number (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Registration Number
                </label>
                <div className="flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-lg opacity-60 cursor-not-allowed">
                  <FileText className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-900 font-mono">
                    {user?.registrationNumber}
                  </span>
                </div>
                <p className="text-xs text-gray-500 mt-1">
                  Registration number cannot be changed
                </p>
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

              {/* Established (Read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Established
                </label>
                <div className="flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-lg">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-900 font-medium">
                    {user?.established
                      ? new Date(user.established).toLocaleDateString()
                      : "N/A"}
                  </span>
                </div>
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

              {/* Description */}
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  About Organization
                </label>
                {isEditing ? (
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows="4"
                    maxLength="500"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                    placeholder="Brief description about your organization (max 500 characters)"
                  />
                ) : (
                  <div className="px-4 py-3 bg-gray-50 rounded-lg">
                    <p className="text-gray-900">
                      {user?.description || "No description provided"}
                    </p>
                  </div>
                )}
                {isEditing && (
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.description?.length || 0}/500 characters
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Contact Person Information */}
          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Contact Person Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Contact Person Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="contactPerson.name"
                    value={formData.contactPerson.name}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-lg">
                    <User className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-900 font-medium">
                      {user?.contactPerson?.name}
                    </span>
                  </div>
                )}
              </div>

              {/* Contact Person Designation */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Designation
                </label>
                {isEditing ? (
                  <input
                    type="text"
                    name="contactPerson.designation"
                    value={formData.contactPerson.designation}
                    onChange={handleChange}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                  />
                ) : (
                  <div className="flex items-center space-x-3 px-4 py-2 bg-gray-50 rounded-lg">
                    <FileText className="h-5 w-5 text-gray-400" />
                    <span className="text-gray-900">
                      {user?.contactPerson?.designation}
                    </span>
                  </div>
                )}
              </div>

              {/* Contact Person Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                {isEditing ? (
                  <input
                    type="tel"
                    name="contactPerson.phone"
                    value={formData.contactPerson.phone}
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
                      {user?.contactPerson?.phone}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Account Information */}
          <div className="pt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Account Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Account Type:</span>
                <span className="ml-2 font-medium text-gray-900">
                  Organization
                </span>
              </div>
              <div>
                <span className="text-gray-600">Registered Since:</span>
                <span className="ml-2 font-medium text-gray-900">
                  {new Date(user?.createdAt).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Verification Status:</span>
                <span
                  className={`ml-2 font-medium ${
                    user?.isVerified ? "text-green-600" : "text-yellow-600"
                  }`}
                >
                  {user?.isVerified ? "Verified" : "Pending"}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Role:</span>
                <span className="ml-2 font-medium text-gray-900 capitalize">
                  {user?.role}
                </span>
              </div>
              <div className="md:col-span-2">
                <span className="text-gray-600">Organization ID:</span>
                <span className="ml-2 font-mono text-xs text-gray-600">
                  {user?._id}
                </span>
              </div>
            </div>
          </div>
        </form>
      </Card>

      {/* Blood Camp Guidelines */}
      <Card>
        <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center">
          <Calendar className="h-5 w-5 text-red-600 mr-2" />
          Blood Camp Guidelines
        </h3>
        <ul className="space-y-2 text-sm text-gray-700">
          <li className="flex items-start">
            <span className="text-red-600 mr-2">•</span>
            <span>
              Ensure proper medical facilities are available at the camp venue
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-red-600 mr-2">•</span>
            <span>Coordinate with local blood banks for blood collection</span>
          </li>
          <li className="flex items-start">
            <span className="text-red-600 mr-2">•</span>
            <span>Arrange for qualified medical staff and volunteers</span>
          </li>
          <li className="flex items-start">
            <span className="text-red-600 mr-2">•</span>
            <span>Provide refreshments and rest area for donors</span>
          </li>
          <li className="flex items-start">
            <span className="text-red-600 mr-2">•</span>
            <span>
              Maintain proper records of all donors and blood units collected
            </span>
          </li>
          <li className="flex items-start">
            <span className="text-red-600 mr-2">•</span>
            <span>
              Follow all safety and hygiene protocols during blood donation
            </span>
          </li>
        </ul>
      </Card>
    </div>
  );
};

export default OrganizationProfile;
