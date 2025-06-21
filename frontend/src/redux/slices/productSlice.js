import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../utils/api';
import { logoutUser } from './authSlice';

// Reusable error handler
const handleApiError = (error, thunkAPI) => {
  if (error.response?.status === 401) {
    thunkAPI.dispatch(logoutUser());
  }
  return thunkAPI.rejectWithValue(error.response?.data || { message: 'Something went wrong' });
};



// Existing fetch thunks (optional if still needed)
export const fetchSarees = createAsyncThunk('products/fetchSarees', async (_, thunkAPI) => {
  try {
    const res = await api.get(`/api/products?category=Sarees`);
    return res.data;
  } catch (error) {
    return handleApiError(error, thunkAPI);
  }
});

export const fetchDresses = createAsyncThunk('products/fetchDresses', async (_, thunkAPI) => {
  try {
    const res = await api.get(`/api/products?category=Dresses`);
    return res.data;
  } catch (error) {
    return handleApiError(error, thunkAPI);
  }
});

export const fetchKidsware = createAsyncThunk('products/fetchKidsware', async (_, thunkAPI) => {
  try {
    const res = await api.get(`/api/products?category=Kidswear`);
    return res.data;
  } catch (error) {
    return handleApiError(error, thunkAPI);
  }
});

export const fetchProductDetails = createAsyncThunk('products/fetchProductDetails', async (id, thunkAPI) => {
  try {
    const res = await api.get(`/api/products/${id}`);
    return res.data;
  } catch (error) {
    return handleApiError(error, thunkAPI);
  }
});

export const fetchSimilarProducts = createAsyncThunk('products/fetchSimilarProducts', async ({ id }, thunkAPI) => {
  try {
    const res = await api.get(`/api/products/similar/${id}`);
    return res.data;
  } catch (error) {
    return handleApiError(error, thunkAPI);
  }
});

export const fetchFilteredProducts = createAsyncThunk(
  'products/fetchFilteredProducts',
  async ({ category, search = '' }, thunkAPI) => {
    try {
      const response = await api.get(`/api/products?category=${category}&search=${search}`);
      return response.data;
    } catch (error) {
      return handleApiError(error, thunkAPI);
    }
  }
);



const productSlice = createSlice({
  name: 'products',
  initialState: {
    items: [],
    loading: false,
    error: null,
    selectedProduct: null,
    similarProducts: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // ✅ For dynamic fetch with search
      
      // Still keeping existing fetchers (optional)
      .addCase(fetchSarees.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSarees.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchSarees.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch sarees';
      })

      .addCase(fetchDresses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDresses.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchDresses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch dresses';
      })

      .addCase(fetchKidsware.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchKidsware.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
      })
      .addCase(fetchKidsware.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch kidswear';
      })

      .addCase(fetchProductDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProductDetails.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProduct = action.payload;
      })
      .addCase(fetchProductDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch product details';
      })

      .addCase(fetchSimilarProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSimilarProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.similarProducts = action.payload;
      })
      .addCase(fetchSimilarProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload?.message || 'Failed to fetch similar products';
      })
      .addCase(fetchFilteredProducts.pending, (state) => {
  state.loading = true;
  state.error = null;
})
.addCase(fetchFilteredProducts.fulfilled, (state, action) => {
  state.loading = false;
  state.items = action.payload;
})
.addCase(fetchFilteredProducts.rejected, (state, action) => {
  state.loading = false;
  state.error = action.payload?.message || 'Failed to fetch products';
})
      
  },
});

export default productSlice.reducer;
