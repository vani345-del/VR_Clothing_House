import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../../utils/api";
import { logoutUser } from "./authSlice";

// 🔒 Reusable error handler
const handleApiError = (error, thunkAPI) => {
  if (error.response?.status === 401) {
    thunkAPI.dispatch(logoutUser());
  }
  return thunkAPI.rejectWithValue(error.response?.data || { message: "Something went wrong" });
};

// ✅ Fetch admin products
export const fetchAdminProducts = createAsyncThunk("adminProducts/fetchProducts", async (_, thunkAPI) => {
  try {
    const res = await api.get("/api/admin/products");
    return res.data;
  } catch (error) {
    return handleApiError(error, thunkAPI);
  }
});

// ✅ Create product
export const createProduct = createAsyncThunk("adminProducts/createProduct", async (productData, thunkAPI) => {
  try {
    const res = await api.post("/api/products", productData);
    return res.data;
  } catch (error) {
    return handleApiError(error, thunkAPI);
  }
});

// ✅ Update product
export const updateProduct = createAsyncThunk("adminProducts/updateProduct", async ({ id, productData }, thunkAPI) => {
  try {
    const res = await api.put(`/api/products/${id}`, productData);
    return res.data;
  } catch (error) {
    return handleApiError(error, thunkAPI);
  }
});

// ✅ Delete product
export const deleteProduct = createAsyncThunk("adminProducts/deleteProduct", async (id, thunkAPI) => {
  try {
    await api.delete(`/api/products/${id}`);
    return id;
  } catch (error) {
    return handleApiError(error, thunkAPI);
  }
});

const adminProductSlice = createSlice({
  name: "adminProducts",
  initialState: {
    products: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchAdminProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAdminProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload;
      })
      .addCase(fetchAdminProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch products";
      })

      // Create
      .addCase(createProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products.push(action.payload);
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to create product";
      })

      // Update
      .addCase(updateProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.loading = false;
        const index = state.products.findIndex((p) => p._id === action.payload._id);
        if (index !== -1) state.products[index] = action.payload;
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to update product";
      })

      // Delete
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.loading = false;
        state.products = state.products.filter((p) => p._id !== action.payload);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to delete product";
      });
  },
});

export default adminProductSlice.reducer;
