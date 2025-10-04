import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../utils/axios';
import toast from 'react-hot-toast';

const initialState = {
  requests: [],
  myRequests: [],
  matchingRequests: [],
  currentRequest: null,
  isLoading: false,
  error: null,
};

// Create Request
export const createRequest = createAsyncThunk(
  'requests/createRequest',
  async (requestData, { rejectWithValue }) => {
    try {
      const response = await axios.post('/requests', requestData);
      toast.success('Blood request created successfully!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to create request';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Get All Requests
export const getAllRequests = createAsyncThunk(
  'requests/getAllRequests',
  async (filters = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams(filters).toString();
      const response = await axios.get(`/requests?${params}`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch requests';
      return rejectWithValue(message);
    }
  }
);

// Get Matching Requests
export const getMatchingRequests = createAsyncThunk(
  'requests/getMatchingRequests',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/requests/matching');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch matching requests';
      return rejectWithValue(message);
    }
  }
);

// Get My Requests
export const getMyRequests = createAsyncThunk(
  'requests/getMyRequests',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get('/requests/my-requests');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch your requests';
      return rejectWithValue(message);
    }
  }
);

// Get Request By ID
export const getRequestById = createAsyncThunk(
  'requests/getRequestById',
  async (id, { rejectWithValue }) => {
    try {
      const response = await axios.get(`/requests/${id}`);
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to fetch request';
      return rejectWithValue(message);
    }
  }
);

// Update Request Status
export const updateRequestStatus = createAsyncThunk(
  'requests/updateRequestStatus',
  async ({ id, status }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`/requests/${id}/status`, { status });
      toast.success('Request status updated!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to update status';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Respond to Request
export const respondToRequest = createAsyncThunk(
  'requests/respondToRequest',
  async ({ id, message }, { rejectWithValue }) => {
    try {
      const response = await axios.post(`/requests/${id}/respond`, { message });
      toast.success('Response sent successfully!');
      return response.data;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to send response';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

// Delete Request
export const deleteRequest = createAsyncThunk(
  'requests/deleteRequest',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`/requests/${id}`);
      toast.success('Request deleted successfully!');
      return id;
    } catch (error) {
      const message = error.response?.data?.message || 'Failed to delete request';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const requestSlice = createSlice({
  name: 'requests',
  initialState,
  reducers: {
    clearCurrentRequest: (state) => {
      state.currentRequest = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Request
      .addCase(createRequest.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(createRequest.fulfilled, (state, action) => {
        state.isLoading = false;
        state.requests.unshift(action.payload.request);
        state.myRequests.unshift(action.payload.request);
      })
      .addCase(createRequest.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Get All Requests
      .addCase(getAllRequests.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getAllRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.requests = action.payload.requests;
      })
      .addCase(getAllRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Get Matching Requests
      .addCase(getMatchingRequests.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMatchingRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.matchingRequests = action.payload.requests;
      })
      .addCase(getMatchingRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Get My Requests
      .addCase(getMyRequests.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getMyRequests.fulfilled, (state, action) => {
        state.isLoading = false;
        state.myRequests = action.payload.requests;
      })
      .addCase(getMyRequests.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Get Request By ID
      .addCase(getRequestById.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getRequestById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentRequest = action.payload.request;
      })
      .addCase(getRequestById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      
      // Update Request Status
      .addCase(updateRequestStatus.fulfilled, (state, action) => {
        const updatedRequest = action.payload.request;
        state.requests = state.requests.map((req) =>
          req._id === updatedRequest._id ? updatedRequest : req
        );
        state.myRequests = state.myRequests.map((req) =>
          req._id === updatedRequest._id ? updatedRequest : req
        );
        if (state.currentRequest?._id === updatedRequest._id) {
          state.currentRequest = updatedRequest;
        }
      })
      
      // Respond to Request
      .addCase(respondToRequest.fulfilled, (state, action) => {
        const updatedRequest = action.payload.request;
        state.requests = state.requests.map((req) =>
          req._id === updatedRequest._id ? updatedRequest : req
        );
        if (state.currentRequest?._id === updatedRequest._id) {
          state.currentRequest = updatedRequest;
        }
      })
      
      // Delete Request
      .addCase(deleteRequest.fulfilled, (state, action) => {
        const deletedId = action.payload;
        state.requests = state.requests.filter((req) => req._id !== deletedId);
        state.myRequests = state.myRequests.filter((req) => req._id !== deletedId);
        if (state.currentRequest?._id === deletedId) {
          state.currentRequest = null;
        }
      });
  },
});

export const { clearCurrentRequest, clearError } = requestSlice.actions;
export default requestSlice.reducer;