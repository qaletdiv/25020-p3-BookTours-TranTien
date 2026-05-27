import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import { setupInterceptors } from "../api/axiosClient";
import productSlice from "./slices/productSlice";
import postsSlice from "./slices/postSlice";
import orderSlice from "./slices/orderSlice"
import cartSlice from "./slices/cartSlice"

const store = configureStore({
  reducer: {
    auth: authSlice,
    products: productSlice,
    posts: postsSlice,
    orders: orderSlice,
    cart: cartSlice,
  },
});
setupInterceptors(store);

export default store;
