import { useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { Toaster } from "react-hot-toast";
import { getCurrentUser } from "./redux/slices/authSlice";

// Scroll to top on route change (except for home page)
function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    // Scroll to top for all pages except home
    if (pathname !== "/") {
      window.scrollTo(0, 0);
    }
  }, [pathname]);

  return null;
}

// Layout
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

// Pages
import Home from "./pages/Home";

// Auth Pages
import UserLogin from "./pages/auth/UserLogin";
import UserRegister from "./pages/auth/UserRegister";
import BloodBankLogin from "./pages/auth/BloodBankLogin";
import BloodBankRegister from "./pages/auth/BloodBankRegister";

// Dashboard Pages
import UserDashboard from "./pages/dashboard/UserDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import BloodBankDashboard from "./pages/dashboard/BloodBankDashboard";

// Request Pages
import CreateRequest from "./pages/requests/CreateRequest";
import RequestList from "./pages/requests/RequestList";
import RequestDetail from "./pages/requests/RequestDetail";
import MyRequests from "./pages/requests/MyRequests";

// Blood Bank Pages
import BloodBankList from "./pages/bloodbanks/BloodBankList";

// Admin Pages
import ManageUsers from "./pages/admin/ManageUsers";
import ManageBloodBanks from "./pages/admin/ManageBloodBanks";

// Other Pages
import EligibilityCriteria from "./pages/EligibilityCriteria";

function App() {
  const dispatch = useDispatch();
  const { isAuthenticated, token } = useSelector((state) => state.auth);

  useEffect(() => {
    if (token && isAuthenticated) {
      dispatch(getCurrentUser());
    }
  }, [dispatch, token, isAuthenticated]);

  return (
    <Router>
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: "#fff",
            color: "#363636",
            fontWeight: "600",
          },
          success: {
            iconTheme: {
              primary: "#10b981",
              secondary: "#fff",
            },
          },
          error: {
            iconTheme: {
              primary: "#ef4444",
              secondary: "#fff",
            },
          },
        }}
      />
      <ScrollToTop />
      <Routes>
        {/* Layout Wrapper */}
        <Route element={<Layout />}>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login/user" element={<UserLogin />} />
          <Route path="/login/bloodbank" element={<BloodBankLogin />} />
          <Route path="/register/user" element={<UserRegister />} />
          <Route path="/register/bloodbank" element={<BloodBankRegister />} />

          {/* Public Blood Bank List */}
          <Route path="/blood-banks" element={<BloodBankList />} />

          {/* Eligibility Criteria */}
          <Route path="/eligibility" element={<EligibilityCriteria />} />

          {/* Protected Routes - User Dashboard */}
          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - Admin Dashboard */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <AdminDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/users"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ManageUsers />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/blood-banks"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ManageBloodBanks />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - Blood Bank Dashboard */}
          <Route
            path="/bloodbank/dashboard"
            element={
              <ProtectedRoute allowedRoles={["bloodbank"]}>
                <BloodBankDashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - Requests */}
          <Route
            path="/requests"
            element={
              <ProtectedRoute>
                <RequestList />
              </ProtectedRoute>
            }
          />

          <Route
            path="/requests/create"
            element={
              <ProtectedRoute>
                <CreateRequest />
              </ProtectedRoute>
            }
          />

          <Route
            path="/requests/my-requests"
            element={
              <ProtectedRoute>
                <MyRequests />
              </ProtectedRoute>
            }
          />

          <Route
            path="/requests/:id"
            element={
              <ProtectedRoute>
                <RequestDetail />
              </ProtectedRoute>
            }
          />

          {/* Catch-all redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
