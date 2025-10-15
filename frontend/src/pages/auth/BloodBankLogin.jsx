import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { loginBloodBank } from "../../redux/slices/authSlice";
import { Mail, Lock, LogIn, Building2, AlertCircle } from "lucide-react";

const BloodBankLogin = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const { isLoading, isAuthenticated, userType, error } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Don't use useEffect for redirect - it causes issues
  // Users can manually visit login page even if logged in

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginBloodBank(formData));

    // Only navigate if login was successful
    if (result.type === "auth/loginBloodBank/fulfilled") {
      navigate("/bloodbank/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 animate-slide-up">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center mb-5">
            <div className="bg-gradient-to-br from-red-600 to-red-700 p-4 rounded-2xl shadow-md">
              <Building2 className="h-12 w-12 text-white" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">
            Blood Bank Login
          </h2>
          <p className="text-sm text-gray-600">
            Sign in to manage your blood bank account
          </p>
        </div>

        {/* Login Form Card */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8">
          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start">
              <AlertCircle className="h-5 w-5 text-red-600 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-sm text-red-800 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label htmlFor="email" className="label">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field pl-11"
                  placeholder="bloodbank@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label htmlFor="password" className="label">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field pl-11"
                  placeholder="••••••••"
                />
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full btn-primary flex items-center justify-center space-x-2"
            >
              {isLoading ? (
                <>
                  <div className="spinner border-white border-t-transparent w-5 h-5"></div>
                  <span>Signing in...</span>
                </>
              ) : (
                <>
                  <LogIn className="h-5 w-5" />
                  <span>Sign In</span>
                </>
              )}
            </button>
          </form>

          {/* Info Box */}
          <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-xl">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
              <p className="text-sm text-blue-800">
                <strong className="font-semibold">Important:</strong> Blood bank
                accounts require admin approval. Please wait for approval after
                registration before attempting to login.
              </p>
            </div>
          </div>

          {/* Links */}
          <div className="mt-6 pt-6 border-t border-gray-200">
            <div className="space-y-3 text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/register/bloodbank"
                  className="font-medium text-red-600 hover:text-red-700 transition-colors"
                >
                  Register here
                </Link>
              </p>
              <p className="text-sm text-gray-600">
                Are you a donor?{" "}
                <Link
                  to="/login/user"
                  className="font-medium text-red-600 hover:text-red-700 transition-colors"
                >
                  Login here
                </Link>
              </p>
            </div>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-xs text-gray-500">
          By signing in, you agree to our Terms of Service and Privacy Policy
        </p>
      </div>
    </div>
  );
};

export default BloodBankLogin;
