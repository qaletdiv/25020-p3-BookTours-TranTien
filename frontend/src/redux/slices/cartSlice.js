import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    orderByUser: {},
  },
  reducers: {
    addCart: (state, action) => {
      state.orderByUser = action.payload;
    },
    clearCart: (state) => {
      state.orderByUser = {};
    },
  },
});

export const { addCart, clearCart } = cartSlice.actions;
export default cartSlice.reducer;
