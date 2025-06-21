import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { logoutUser } from "./authSlice";

// 🔐 Centralized error handler
const handleApiError = (error, thunkAPI) => {
  if (error.response?.status === 401) {
    thunkAPI.dispatch(logoutUser());
  }
  return thunkAPI.rejectWithValue(
    error.response?.data || { message: error.message || "Something went wrong" }
  );
};

// ✅ Fetch all orders (Admin only)
export const fetchAllOrders = createAsyncThunk(
  "adminOrders/fetchAllOrders",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/api/admin/orders");
      return res.data;
    } catch (error) {
      return handleApiError(error, thunkAPI);
    }
  }
);

// ✅ Update order status (delivered, processing, etc.)
export const updateOrderStatus = createAsyncThunk(
  "adminOrders/updateOrderStatus",
  async ({ id, status }, thunkAPI) => {
    try {
      const res = await api.put(`/api/admin/orders/${id}`, { status });
      return res.data;
    } catch (error) {
      return handleApiError(error, thunkAPI);
    }
  }
);

// ✅ Delete order
export const deleteOrder = createAsyncThunk(
  "adminOrders/deleteOrder",
  async (id, thunkAPI) => {
    try {
      await api.delete(`/api/admin/orders/${id}`);
      return id;
    } catch (error) {
      return handleApiError(error, thunkAPI);
    }
  }
);

const adminOrderSlice = createSlice({
  name: "adminOrders",
  initialState: {
    orders: [],
    totalOrders: 0,
    totalSales: 0,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // 🔄 Fetch all orders
      .addCase(fetchAllOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload;
        state.totalOrders = action.payload.length;
        state.totalSales = action.payload.reduce(
          (sum, order) => sum + order.totalPrice,
          0
        );
      })
      .addCase(fetchAllOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch orders";
      })

      // ✅ Update order status
      .addCase(updateOrderStatus.fulfilled, (state, action) => {
        const updated = action.payload;
        const index = state.orders.findIndex((o) => o._id === updated._id);
        if (index !== -1) {
          state.orders[index] = updated;
        }
      })
      .addCase(updateOrderStatus.rejected, (state, action) => {
        state.error = action.payload?.message || "Failed to update order status";
      })

      // 🗑 Delete order
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter((o) => o._id !== action.payload);
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.error = action.payload?.message || "Failed to delete order";
      });
  },
});

export default adminOrderSlice.reducer;
