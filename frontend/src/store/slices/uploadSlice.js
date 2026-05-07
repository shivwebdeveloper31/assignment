import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

const API = process.env.REACT_APP_API_URL || '/api';

export const uploadFile = createAsyncThunk(
  'upload/uploadFile',
  async (file, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      const response = await axios.post(`${API}/products/import`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        onUploadProgress: (progressEvent) => {
          // progress handled in component
        }
      });
      return response.data;
    } catch (err) {
      return rejectWithValue(err.response?.data?.message || err.message);
    }
  }
);

const uploadSlice = createSlice({
  name: 'upload',
  initialState: {
    loading: false,
    success: false,
    error: null,
    result: null,
  },
  reducers: {
    resetUpload: (state) => {
      state.loading = false;
      state.success = false;
      state.error = null;
      state.result = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(uploadFile.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
        state.result = null;
      })
      .addCase(uploadFile.fulfilled, (state, action) => {
        state.loading = false;
        state.success = true;
        state.result = action.payload;
      })
      .addCase(uploadFile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { resetUpload } = uploadSlice.actions;
export default uploadSlice.reducer;
