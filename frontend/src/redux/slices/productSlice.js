import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";

export const fetchProduct = createAsyncThunk("products/fetchProduct", async () => {
  const res = await axiosClient.get("/tours");
  return res.data;
});

export const fetchRelatedProducts = createAsyncThunk(
  "products/fetchRelatedProducts",
  async (slug) => {
    const res = await axiosClient.get(`/tours/related/${slug}`);
    return res.data;
  }
);

export const fetchFilterProducts = createAsyncThunk(
  "products/fetchFilterProducts",
  async (filterParams, thunkAPI) => {
    try {
      const params = new URLSearchParams();
      if (filterParams.id) params.append("categoryId", filterParams.id);
      const response = await axiosClient.get(`/tours?${params.toString()}`);
      return response.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data || { message: "Lỗi server" });
    }
  }
);

export const fetchProductSlug = createAsyncThunk("products/fetchProductSlug", async (slug) => {
  const res = await axiosClient.get(`/tours/${slug}`);
  return res.data;
});

export const fetchPagedTours = createAsyncThunk(
  "products/fetchPagedTours",
  async ({ page = 1, categoryId } = {}, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (categoryId) params.append("categoryId", categoryId);
      const res = await axiosClient.get(`/tours/page/${page}?${params}`);
      return res.data; // { data, total, page, pageSize }
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

export const fetchProductsFilter = createAsyncThunk(
  "products/fetchProductsFilter",
  async (filterHome, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (filterHome.idTour) params.append("categoryId", filterHome.idTour);
      if (filterHome.departure) params.append("departure", filterHome.departure);
      if (filterHome.destination) params.append("destination", filterHome.destination);
      if (filterHome.date) params.append("startDate", filterHome.date.toISOString().split("T")[0]);
      if (filterHome.duration) params.append("durationRange", filterHome.duration);

      const res = await axiosClient.get(`/tours/search?${params.toString()}`);
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    pagedProducts: [],
    pagedTotal: 0,
    filterProducts: [],
    filterHome: [],
    totalFilterHome: 0,
    relatedProducts: [],
    currentProduct: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProduct.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProduct.fulfilled, (state, action) => { state.loading = false; state.products = action.payload; })
      .addCase(fetchProduct.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      .addCase(fetchPagedTours.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchPagedTours.fulfilled, (state, action) => {
        state.loading = false;
        state.pagedProducts = action.payload.data;
        state.pagedTotal = action.payload.total;
      })
      .addCase(fetchPagedTours.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(fetchFilterProducts.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchFilterProducts.fulfilled, (state, action) => { state.loading = false; state.filterProducts = action.payload; })
      .addCase(fetchFilterProducts.rejected, (state, action) => { state.loading = false; state.error = action.payload?.message; })
      .addCase(fetchRelatedProducts.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchRelatedProducts.fulfilled, (state, action) => { state.loading = false; state.relatedProducts = action.payload; })
      .addCase(fetchRelatedProducts.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      .addCase(fetchProductSlug.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchProductSlug.fulfilled, (state, action) => { state.loading = false; state.currentProduct = action.payload; })
      .addCase(fetchProductSlug.rejected, (state, action) => { state.loading = false; state.error = action.error.message; })
      .addCase(fetchProductsFilter.pending, (state) => { state.loading = true; })
      .addCase(fetchProductsFilter.fulfilled, (state, action) => {
        state.loading = false;
        state.filterHome = action.payload.data;
        state.totalFilterHome = action.payload.total;
      })
      .addCase(fetchProductsFilter.rejected, (state, action) => { state.loading = false; state.error = action.payload; });
  },
});

export default productSlice.reducer;
