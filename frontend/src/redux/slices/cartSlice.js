import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from '../../utils/api'; // Adjust the path as necessary
import { logoutUser } from "./authSlice";

// Helpers
const loadCartFromStorage = () => {
  const storedCart = localStorage.getItem("cart");
  return storedCart ? JSON.parse(storedCart) : { products: [] };
};

const saveCartToStorage = (cart) => {
  localStorage.setItem("cart", JSON.stringify(cart));
};

// Common error handler
const handleApiError = (error, thunkAPI) => {
  if (error.response?.status === 401) {
    thunkAPI.dispatch(logoutUser());
  }
  return thunkAPI.rejectWithValue(error.response?.data || { message: "Unexpected error" });
};

// Fetch cart
export const fetchCart = createAsyncThunk("cart/fetchCart", async ({ userId, guestId }, thunkAPI) => {
  try {
    const response = await api.get("/api/cart", {
      params: { userId, guestId },
    });
    return response.data;
  } catch (error) {
    return handleApiError(error, thunkAPI);
  }
});

// Add item to cart
export const addToCart = createAsyncThunk("cart/addToCart", async (payload, thunkAPI) => {
  try {
    const response = await api.post("/api/cart", payload);
    return response.data;
  } catch (error) {
    return handleApiError(error, thunkAPI);
  }
});

// Update quantity
export const updateCartItemQuantity = createAsyncThunk(
  "cart/updateCartItemQuantity",
  async (payload, thunkAPI) => {
    try {
      const response = await api.put("/api/cart", payload);
      return response.data;
    } catch (error) {
      return handleApiError(error, thunkAPI);
    }
  }
);

// Remove from cart
export const removeFromCart = createAsyncThunk(
  "cart/removeFromCart",
  async ({ productId, guestId, userId, size, color }, thunkAPI) => {
    try {
      const response = await api.delete("/api/cart", {
        data: { productId, guestId, userId, size, color },
      });
      return response.data;
    } catch (error) {
      return handleApiError(error, thunkAPI);
    }
  }
);

// Merge guest cart
export const mergeCart = createAsyncThunk("cart/mergeCart", async ({ guestId, user }, thunkAPI) => {
  try {
    const response = await api.post("/api/cart/merge", { guestId, user });
    return response.data;
  } catch (error) {
    return handleApiError(error, thunkAPI);
  }
});

// Slice
const cartSlice = createSlice({
  name: "cart",
  initialState: {
    cart: loadCartFromStorage(),
    loading: false,
    error: null,
  },
  reducers: {
    clearCart: (state) => {
      state.cart = { products: [] };
      localStorage.removeItem("cart");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(fetchCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to fetch cart";
      })

      .addCase(addToCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addToCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(addToCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to add to cart";
      })

      .addCase(updateCartItemQuantity.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateCartItemQuantity.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(updateCartItemQuantity.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to update quantity";
      })

      .addCase(removeFromCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeFromCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(removeFromCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to remove from cart";
      })

      .addCase(mergeCart.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(mergeCart.fulfilled, (state, action) => {
        state.loading = false;
        state.cart = action.payload;
        saveCartToStorage(action.payload);
      })
      .addCase(mergeCart.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || "Failed to merge cart";
      });
  },
});

export const { clearCart } = cartSlice.actions;
export default cartSlice.reducer;
