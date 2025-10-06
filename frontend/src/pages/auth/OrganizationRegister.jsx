import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Building2,
  Mail,
  Lock,
  Phone,
  MapPin,
  FileText,
  Calendar,
  User,
  Briefcase,
} from "lucide-react";
import Card from "../../components/Card";
import ErrorMessage from "../../components/ErrorMessage";
import axios from "../../utils/axios";

const OrganizationRegister = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    type: "hospital",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    address: "",
    city: "",
    registrationNumber: "",
    contactPersonName: "",
    contactPersonDesignation: "",
    contactPersonPhone: "",
    established: "",
    description: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    setLoading(true);

    try {
      const {
        confirmPassword,
        contactPersonName,
        contactPersonDesignation,
        contactPersonPhone,
        ...dataToSend
      } = formData;

      dataToSend.contactPerson = {
        name: contactPersonName,
        designation: contactPersonDesignation,
        phone: contactPersonPhone,
      };

      const response = await axios.post(
        "/auth/organization/register",
        dataToSend
      );

      if (response.data.success) {
        localStorage.setItem("token", response.data.data.token);
        localStorage.setItem("userType", "organization");
        navigate("/organization/dashboard");
      }
    } catch (err) {
      setError(
        err.response?.data?.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-full mb-4">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Register Your Organization
          </h1>
          <p className="text-gray-700 font-medium">
            Hospital, NGO, or College - Join us to organize blood donation camps
          </p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            {error && <ErrorMessage message={error} />}

            {/* Organization Type */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Organization Type *
              </label>
              <div className="grid grid-cols-3 gap-4">
                {["hospital", "ngo", "college"].map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setFormData({ ...formData, type })}
                    className={`py-3 px-4 rounded-lg border-2 font-bold text-sm transition-all capitalize ${
                      formData.type === type
                        ? "bg-red-600 text-white border-red-600"
                        : "bg-white text-gray-700 border-gray-300 hover:border-red-400"
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Organization Details */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Organization Name *
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="input-field pl-11"
                    placeholder="Enter organization name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className="input-field pl-11"
                    placeholder="organization@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Phone Number *
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className="input-field pl-11"
                    placeholder="1234567890"
                    pattern="[0-9]{10}"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Registration Number *
                </label>
                <div className="relative">
                  <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <input
                    type="text"
                    name="registrationNumber"
                    value={formData.registrationNumber}
                    onChange={handleChange}
                    className="input-field pl-11"
                    placeholder="REG123456"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  City *
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    className="input-field pl-11"
                    placeholder="Enter city"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Established Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <input
                    type="date"
                    name="established"
                    value={formData.established}
                    onChange={handleChange}
                    className="input-field pl-11"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Address *
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3 h-5 w-5 text-gray-500" />
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  className="input-field pl-11"
                  rows="2"
                  placeholder="Complete address"
                  required
                />
              </div>
            </div>

            {/* Contact Person Details */}
            <div className="border-t pt-6">
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Contact Person Details
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Name *
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <input
                      type="text"
                      name="contactPersonName"
                      value={formData.contactPersonName}
                      onChange={handleChange}
                      className="input-field pl-11"
                      placeholder="Contact person name"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Designation *
                  </label>
                  <div className="relative">
                    <Briefcase className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <input
                      type="text"
                      name="contactPersonDesignation"
                      value={formData.contactPersonDesignation}
                      onChange={handleChange}
                      className="input-field pl-11"
                      placeholder="Manager, Director, etc."
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-900 mb-2">
                    Phone *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                    <input
                      type="tel"
                      name="contactPersonPhone"
                      value={formData.contactPersonPhone}
                      onChange={handleChange}
                      className="input-field pl-11"
                      placeholder="1234567890"
                      pattern="[0-9]{10}"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Description (Optional)
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="input-field pl-4"
                rows="3"
                placeholder="Brief description about your organization..."
                maxLength="500"
              />
              <p className="text-xs text-gray-600 mt-1">
                {formData.description.length}/500 characters
              </p>
            </div>

            {/* Password */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t pt-6">
              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <input
                    type="password"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    className="input-field pl-11"
                    placeholder="Min. 6 characters"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">
                  Confirm Password *
                </label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                  <input
                    type="password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleChange}
                    className="input-field pl-11"
                    placeholder="Re-enter password"
                    required
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {loading ? "Registering..." : "Register Organization"}
            </button>

            <p className="text-center text-sm text-gray-700">
              Already have an account?{" "}
              <Link
                to="/login/organization"
                className="text-red-600 font-bold hover:text-red-700"
              >
                Login here
              </Link>
            </p>
          </form>
        </Card>

        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-900 font-medium">
            <strong>Note:</strong> Your organization will be verified by our
            admin team before you can create blood donation camps.
          </p>
        </div>
      </div>
    </div>
  );
};

export default OrganizationRegister;
