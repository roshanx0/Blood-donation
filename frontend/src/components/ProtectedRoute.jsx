import { Navigate, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, userType, user } = useSelector(
    (state) => state.auth
  );
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to appropriate login page based on allowed roles
    let loginPath = "/login/user"; // Default to user login

    if (allowedRoles && allowedRoles.length > 0) {
      if (allowedRoles.includes("organization")) {
        loginPath = "/login/organization";
      } else if (allowedRoles.includes("bloodbank")) {
        loginPath = "/login/bloodbank";
      } else if (allowedRoles.includes("admin")) {
        loginPath = "/login/user"; // Admin login through user login
      }
    }

    // Save the intended destination
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  // Check if user has the required role
  if (allowedRoles && allowedRoles.length > 0) {
    const userRole = user?.role === "admin" ? "admin" : userType;

    if (!allowedRoles.includes(userRole)) {
      // Redirect to appropriate dashboard based on user type
      if (userRole === "admin") {
        return <Navigate to="/admin/dashboard" replace />;
      } else if (userRole === "bloodbank") {
        return <Navigate to="/bloodbank/dashboard" replace />;
      } else if (userRole === "organization") {
        return <Navigate to="/organization/dashboard" replace />;
      } else {
        return <Navigate to="/user/dashboard" replace />;
      }
    }
  }

  return children;
};

export default ProtectedRoute;
