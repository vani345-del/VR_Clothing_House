import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api"; // Adjust the path as necessary
import { logoutUser } from "./authSlice";

// Helper to handle 401 error globally
const handleApiError = (error, thunkAPI) => {
  if (error.response?.status === 401) {
    thunkAPI.dispatch(logoutUser());
  }
  return thunkAPI.rejectWithValue(error.response?.data || { message: "Something went wrong" });
};

// ✅ Fetch all users (admin only)
export const fetchUsers = createAsyncThunk("admin/fetchUsers", async (_, thunkAPI) => {
  try {
    const response = await api.get("/api/admin/users");
    return response.data;
  } catch (error) {
    return handleApiError(error, thunkAPI);
  }
});

// ✅ Add new user
export const addUser = createAsyncThunk("admin/addUser", async (userData, thunkAPI) => {
  try {
    const response = await api.post("/api/admin/users", userData);
    return response.data;
  } catch (error) {
    return handleApiError(error, thunkAPI);
  }
});

// ✅ Update user
export const updateUser = createAsyncThunk("admin/updateUser", async ({ id, name, email, role }, thunkAPI) => {
  try {
    const response = await api.put(`/api/admin/users/${id}`, { name, email, role });
    return response.data.user;
  } catch (error) {
    return handleApiError(error, thunkAPI);
  }
});

// ✅ Delete user
export const deleteUser = createAsyncThunk("admin/deleteUser", async (id, thunkAPI) => {
  try {
    await api.delete(`/api/admin/users/${id}`);
    return id;
  } catch (error) {
    return handleApiError(error, thunkAPI);
  }
});

const adminSlice = createSlice({
  name: "admin",
  initialState: {
    users: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch users";
      })

      // Add User
      .addCase(addUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users.push(action.payload.user);
      })
      .addCase(addUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to add user";
      })

      // Update User
      .addCase(updateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.loading = false;
        const updatedUser = action.payload;
        const index = state.users.findIndex((user) => user._id === updatedUser._id);
        if (index !== -1) {
          state.users[index] = updatedUser;
        }
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to update user";
      })

      // Delete User
      .addCase(deleteUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.loading = false;
        state.users = state.users.filter((user) => user._id !== action.payload);
      })
      .addCase(deleteUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to delete user";
      });
  },
});

export default adminSlice.reducer;
