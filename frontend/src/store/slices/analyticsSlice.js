import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL;;

export const fetchSummary = createAsyncThunk('analytics/fetchSummary', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${API}/products/analytics/summary`);
    return res.data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message || err.message); }
});

export const fetchProductsPerCategory = createAsyncThunk('analytics/fetchProductsPerCategory', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${API}/products/analytics/products-per-category`);
    return res.data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message || err.message); }
});

export const fetchTopReviewed = createAsyncThunk('analytics/fetchTopReviewed', async (limit = 10, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${API}/products/analytics/top-reviewed`, { params: { limit } });
    return res.data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message || err.message); }
});

export const fetchDiscountDistribution = createAsyncThunk('analytics/fetchDiscountDistribution', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${API}/products/analytics/discount-distribution`);
    return res.data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message || err.message); }
});

export const fetchCategoryAvgRating = createAsyncThunk('analytics/fetchCategoryAvgRating', async (_, { rejectWithValue }) => {
  try {
    const res = await axios.get(`${API}/products/analytics/category-avg-rating`);
    return res.data.data;
  } catch (err) { return rejectWithValue(err.response?.data?.message || err.message); }
});

const analyticsSlice = createSlice({
  name: 'analytics',
  initialState: {
    summary: null,
    productsPerCategory: [],
    topReviewed: [],
    discountDistribution: [],
    categoryAvgRating: [],
    loading: { summary: false, charts: false },
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    const pending = (key) => (state) => { state.loading[key] = true; state.error = null; };
    const rejected = (state, action) => { state.loading = { summary: false, charts: false }; state.error = action.payload; };

    builder
      .addCase(fetchSummary.pending, pending('summary'))
      .addCase(fetchSummary.fulfilled, (state, action) => { state.loading.summary = false; state.summary = action.payload; })
      .addCase(fetchSummary.rejected, rejected)

      .addCase(fetchProductsPerCategory.pending, pending('charts'))
      .addCase(fetchProductsPerCategory.fulfilled, (state, action) => { state.loading.charts = false; state.productsPerCategory = action.payload; })
      .addCase(fetchProductsPerCategory.rejected, rejected)

      .addCase(fetchTopReviewed.fulfilled, (state, action) => { state.topReviewed = action.payload; })
      .addCase(fetchDiscountDistribution.fulfilled, (state, action) => { state.discountDistribution = action.payload; })
      .addCase(fetchCategoryAvgRating.fulfilled, (state, action) => { state.categoryAvgRating = action.payload; });
  },
});

export default analyticsSlice.reducer;
