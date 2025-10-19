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
import { AnimatePresence } from "framer-motion";
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
import OrganizationLogin from "./pages/auth/OrganizationLogin";
import OrganizationRegister from "./pages/auth/OrganizationRegister";

// Dashboard Pages
import UserDashboard from "./pages/dashboard/UserDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import BloodBankDashboard from "./pages/dashboard/BloodBankDashboard";
import OrganizationDashboard from "./pages/dashboard/OrganizationDashboard";

// Profile Pages
import UserProfilePage from "./pages/profile/UserProfilePage";
import BloodBankProfilePage from "./pages/profile/BloodBankProfilePage";
import OrganizationProfilePage from "./pages/profile/OrganizationProfilePage";

// Donation History
import DonationHistory from "./pages/DonationHistory";

// Request Pages
import CreateRequest from "./pages/requests/CreateRequest";
import RequestList from "./pages/requests/RequestList";
import RequestDetail from "./pages/requests/RequestDetail";
import MyRequests from "./pages/requests/MyRequests";

// Blood Bank Pages
import BloodBankList from "./pages/bloodbanks/BloodBankList";
import BloodBankScanner from "./pages/bloodbanks/BloodBankScanner";

// Admin Pages
import ManageUsers from "./pages/admin/ManageUsers";
import ManageBloodBanks from "./pages/admin/ManageBloodBanks";
import ManageOrganizations from "./pages/admin/ManageOrganizations";
import ManageCamps from "./pages/admin/ManageCamps";

// Blood Camp Pages
import BloodCampList from "./pages/camps/BloodCampList";
import CreateBloodCamp from "./pages/camps/CreateBloodCamp";
import BloodCampDetail from "./pages/camps/BloodCampDetail";

// Organization Pages
import MyCamps from "./pages/organization/MyCamps";
import CampScanner from "./pages/organization/CampScanner";

// User Pages
import UserMyCamps from "./pages/user/MyCamps";

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
      <AnimatePresence mode="wait">
        <Routes>
          {/* Public Routes with Layout (Navbar + Footer) */}
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            <Route path="/login/user" element={<UserLogin />} />
            <Route path="/login/bloodbank" element={<BloodBankLogin />} />
            <Route path="/login/organization" element={<OrganizationLogin />} />
            <Route path="/register/user" element={<UserRegister />} />
            <Route path="/register/bloodbank" element={<BloodBankRegister />} />
            <Route
              path="/register/organization"
              element={<OrganizationRegister />}
            />

            {/* Public Blood Bank List */}
            <Route path="/blood-banks" element={<BloodBankList />} />

            {/* Blood Camps - Public Routes */}
            <Route path="/camps" element={<BloodCampList />} />
            <Route path="/camps/:id" element={<BloodCampDetail />} />

            {/* Public Requests List */}
            <Route path="/requests" element={<RequestList />} />

            {/* Eligibility Criteria */}
            <Route path="/eligibility" element={<EligibilityCriteria />} />
          </Route>

          {/* Dashboard Routes (No Layout - they use DashboardLayout internally) */}
          {/* Protected Routes - User Dashboard */}
          <Route
            path="/user/dashboard"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <UserDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/user/profile"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <UserProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/user/donation-history"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <DonationHistory />
              </ProtectedRoute>
            }
          />

          <Route
            path="/user/my-camps"
            element={
              <ProtectedRoute allowedRoles={["user"]}>
                <UserMyCamps />
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

          <Route
            path="/admin/organizations"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ManageOrganizations />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/camps"
            element={
              <ProtectedRoute allowedRoles={["admin"]}>
                <ManageCamps />
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

          <Route
            path="/bloodbank/profile"
            element={
              <ProtectedRoute allowedRoles={["bloodbank"]}>
                <BloodBankProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/bloodbank/scan-donation"
            element={
              <ProtectedRoute allowedRoles={["bloodbank"]}>
                <BloodBankScanner />
              </ProtectedRoute>
            }
          />

          <Route
            path="/bloodbank/inventory"
            element={
              <ProtectedRoute allowedRoles={["bloodbank"]}>
                <BloodBankDashboard />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - Organization Dashboard */}
          <Route
            path="/organization/dashboard"
            element={
              <ProtectedRoute allowedRoles={["organization"]}>
                <OrganizationDashboard />
              </ProtectedRoute>
            }
          />

          <Route
            path="/organization/profile"
            element={
              <ProtectedRoute allowedRoles={["organization"]}>
                <OrganizationProfilePage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/organization/my-camps"
            element={
              <ProtectedRoute allowedRoles={["organization"]}>
                <MyCamps />
              </ProtectedRoute>
            }
          />

          <Route
            path="/organization/camps/:id/scan"
            element={
              <ProtectedRoute allowedRoles={["organization"]}>
                <CampScanner />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - Organization (Create Blood Camps) */}
          <Route
            path="/camps/create"
            element={
              <ProtectedRoute allowedRoles={["organization"]}>
                <CreateBloodCamp />
              </ProtectedRoute>
            }
          />

          {/* Protected Routes - Requests */}
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
        </Routes>
      </AnimatePresence>
    </Router>
  );
}

export default App;
