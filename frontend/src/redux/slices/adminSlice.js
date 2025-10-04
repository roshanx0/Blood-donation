import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../../utils/axios";
import toast from "react-hot-toast";

const initialState = {
  pendingBloodBanks: [],
  allBloodBanks: [],
  allUsers: [],
  stats: null,
  isLoading: false,
  error: null,
};

// Get Pending Blood Banks
export const getPendingBloodBanks = createAsyncThunk(
  "admin/getPendingBloodBanks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/admin/bloodbanks/pending");
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch pending blood banks";
      return rejectWithValue(message);
    }
  }
);

// Approve Blood Bank
export const approveBloodBank = createAsyncThunk(
  "admin/approveBloodBank",
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/admin/bloodbanks/${id}/approve`);
      toast.success("Blood bank approved successfully!");
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to approve blood bank";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Reject Blood Bank
export const rejectBloodBank = createAsyncThunk(
  "admin/rejectBloodBank",
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/admin/bloodbanks/${id}/reject`);
      toast.success("Blood bank registration rejected");
      return id;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to reject blood bank";
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Get All Blood Banks
export const getAllBloodBanks = createAsyncThunk(
  "admin/getAllBloodBanks",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/admin/bloodbanks");
      return response.data;
    } catch (error) {
      const message =
        error.response?.data?.message || "Failed to fetch blood banks";
      return rejectWithValue(message);
    }
  }
);

// Get All Users
export const getAllUsers = createAsyncThunk(
  "admin/getAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/admin/users");
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch users";
      return rejectWithValue(message);
    }
  }
);

// Get Dashboard Stats
export const getDashboardStats = createAsyncThunk(
  "admin/getDashboardStats",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get("/admin/stats");
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || "Failed to fetch stats";
      return rejectWithValue(message);
    }
  }
);

const adminSlice = createSlice({
  name: "admin",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Pending Blood Banks
      .addCase(getPendingBloodBanks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getPendingBloodBanks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.pendingBloodBanks = action.payload.bloodBanks;
      })
      .addCase(getPendingBloodBanks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Approve Blood Bank
      .addCase(approveBloodBank.fulfilled, (state, action) => {
        const approvedId = action.payload.bloodBank._id;
        state.pendingBloodBanks = state.pendingBloodBanks.filter(
          (bank) => bank._id !== approvedId
        );
        state.allBloodBanks.push(action.payload.bloodBank);
      })

      // Reject Blood Bank
      .addCase(rejectBloodBank.fulfilled, (state, action) => {
        const rejectedId = action.payload;
        state.pendingBloodBanks = state.pendingBloodBanks.filter(
          (bank) => bank._id !== rejectedId
        );
      })

      // Get All Blood Banks
      .addCase(getAllBloodBanks.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllBloodBanks.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allBloodBanks = action.payload.bloodBanks;
      })
      .addCase(getAllBloodBanks.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Get All Users
      .addCase(getAllUsers.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allUsers = action.payload.users;
      })
      .addCase(getAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })

      // Get Dashboard Stats
      .addCase(getDashboardStats.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getDashboardStats.fulfilled, (state, action) => {
        state.isLoading = false;
        state.stats = action.payload.stats;
      })
      .addCase(getDashboardStats.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = adminSlice.actions;
export default adminSlice.reducer;
