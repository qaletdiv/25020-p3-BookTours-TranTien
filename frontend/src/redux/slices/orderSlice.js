import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";

export const fetchUserOrders = createAsyncThunk("orders/fetchUserOrders", async (_, { rejectWithValue }) => {
  try {
    const res = await axiosClient.get("/orders");
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data || err.message);
  }
});

export const addOrder = createAsyncThunk("orders/addOrder", async (orderData, { rejectWithValue }) => {
  try {
    const res = await axiosClient.post("/orders", orderData);
    return res.data;
  } catch (err) {
    return rejectWithValue(err.response?.data?.message || "Đặt tour thất bại");
  }
});

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    currentNewOrder: null,
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserOrders.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(fetchUserOrders.fulfilled, (state, action) => { state.loading = false; state.orders = action.payload; })
      .addCase(fetchUserOrders.rejected, (state, action) => { state.loading = false; state.error = action.payload; })
      .addCase(addOrder.pending, (state) => { state.loading = true; state.error = null; })
      .addCase(addOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.currentNewOrder = action.payload;
      })
      .addCase(addOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Đặt tour thất bại";
      });
  },
});

export default orderSlice.reducer;
