import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Building2, Mail, Lock } from "lucide-react";
import Card from "../../components/Card";
import ErrorMessage from "../../components/ErrorMessage";
import { loginOrganization } from "../../redux/slices/authSlice";

const OrganizationLogin = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { isLoading, isAuthenticated, userType } = useSelector(
    (state) => state.auth
  );

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // Get the page user was trying to access before login
  const from = location.state?.from?.pathname || null;

  useEffect(() => {
    // Redirect if already logged in as organization
    if (isAuthenticated && userType === "organization") {
      if (from) {
        navigate(from, { replace: true });
      } else {
        navigate("/organization/dashboard");
      }
    }
  }, [isAuthenticated, userType, navigate, from]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await dispatch(loginOrganization(formData));

    if (result.type === "auth/loginOrganization/fulfilled") {
      if (from) {
        navigate(from, { replace: true });
      } else {
        navigate("/organization/dashboard");
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-white flex items-center justify-center py-12 px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-full mb-4">
            <Building2 className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Organization Login
          </h1>
          <p className="text-gray-700 font-medium">Hospital / NGO / College</p>
        </div>

        <Card>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-900 mb-2">
                Email Address
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
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="input-field pl-11"
                  placeholder="Enter your password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-red-600 text-white py-3 rounded-lg font-bold hover:bg-red-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
            >
              {isLoading ? "Logging in..." : "Login"}
            </button>

            <p className="text-center text-sm text-gray-700">
              Don't have an account?{" "}
              <Link
                to="/register/organization"
                className="text-red-600 font-bold hover:text-red-700"
              >
                Register here
              </Link>
            </p>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default OrganizationLogin;
