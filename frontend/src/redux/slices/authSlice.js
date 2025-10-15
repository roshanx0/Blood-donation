import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axios";
import toast from "react-hot-toast";

// Get user from localStorage
const user = JSON.parse(localStorage.getItem("user"));
const token = localStorage.getItem("token");

// Determine user type from stored user data
const getUserType = (user) => {
  if (!user) return null;
  if (user.role === "admin") return "admin";
  if (user.role === "organization") return "organization";
  if (user.role === "bloodbank") return "bloodbank";
  return "user";
};

const initialState = {
  user: user || null,
  token: token || null,
  isLoading: false,
  isAuthenticated: !!token,
  userType: getUserType(user),
};

// Register User
export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await axios.post("/auth/register/user", userData);
      toast.success("Registration successful!");
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Register Blood Bank
export const registerBloodBank = createAsyncThunk(
  "auth/registerBloodBank",
  async (bloodBankData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "/auth/register/bloodbank",
        bloodBankData
      );
      toast.success(
        "Blood bank registration submitted! Awaiting admin approval."
      );
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Login User
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post("/auth/login/user", credentials);
      toast.success("Login successful!");
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Login Blood Bank
export const loginBloodBank = createAsyncThunk(
  "auth/loginBloodBank",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post("/auth/login/bloodbank", credentials);
      toast.success("Login successful!");
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Register Organization
export const registerOrganization = createAsyncThunk(
  "auth/registerOrganization",
  async (organizationData, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "/auth/organization/register",
        organizationData
      );
      toast.success("Organization registered! Awaiting admin verification.");
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Registration failed";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Login Organization
export const loginOrganization = createAsyncThunk(
  "auth/loginOrganization",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        "/auth/organization/login",
        credentials
      );
      toast.success("Login successful!");
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Login failed";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Get Current User
export const getCurrentUser = createAsyncThunk(
  "auth/getCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/auth/me");
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch user";
      return rejectWithValue(message);
    }
  }
);

// Logout
export const logout = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      await axios.post("/auth/logout");
      toast.success("Logged out successfully");
      return null;
    } catch (error) {
      const message = error.response?.data?.message || "Logout failed";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setCredentials: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.isAuthenticated = true;
      state.userType = getUserType(action.payload.user);
    },
    setUser: (state, action) => {
      state.user = action.payload;
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder
      // Register User
      .addCase(registerUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.userType =
          action.payload.user.role === "admin" ? "admin" : "user";
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(registerUser.rejected, (state) => {
        state.isLoading = false;
      })

      // Register Blood Bank
      .addCase(registerBloodBank.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerBloodBank.fulfilled, (state) => {
        state.isLoading = false;
      })
      .addCase(registerBloodBank.rejected, (state) => {
        state.isLoading = false;
      })

      // Login User
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.userType =
          action.payload.user.role === "admin" ? "admin" : "user";
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(loginUser.rejected, (state) => {
        state.isLoading = false;
      })

      // Login Blood Bank
      .addCase(loginBloodBank.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginBloodBank.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.userType = "bloodbank";
        localStorage.setItem("token", action.payload.token);
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(loginBloodBank.rejected, (state) => {
        state.isLoading = false;
      })

      // Register Organization
      .addCase(registerOrganization.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(registerOrganization.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.data.organization;
        state.token = action.payload.data.token;
        state.userType = "organization";
        localStorage.setItem("token", action.payload.data.token);
        localStorage.setItem(
          "user",
          JSON.stringify(action.payload.data.organization)
        );
      })
      .addCase(registerOrganization.rejected, (state) => {
        state.isLoading = false;
      })

      // Login Organization
      .addCase(loginOrganization.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(loginOrganization.fulfilled, (state, action) => {
        state.isLoading = false;
        state.isAuthenticated = true;
        state.user = action.payload.data.organization;
        state.token = action.payload.data.token;
        state.userType = "organization";
        localStorage.setItem("token", action.payload.data.token);
        localStorage.setItem(
          "user",
          JSON.stringify(action.payload.data.organization)
        );
      })
      .addCase(loginOrganization.rejected, (state) => {
        state.isLoading = false;
      })

      // Get Current User
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.userType = action.payload.userType;
        localStorage.setItem("user", JSON.stringify(action.payload.user));
      })
      .addCase(getCurrentUser.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.userType = null;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      })

      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.userType = null;
        state.isLoading = false;
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      });
  },
});

export const { clearError, setCredentials, setUser } = authSlice.actions;
export default authSlice.reducer;
