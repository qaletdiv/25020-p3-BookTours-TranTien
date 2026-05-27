import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";

export const fetchPost = createAsyncThunk(
  "posts/fetchPost",
  async () => {
    const res = await axiosClient.get("/posts");
    return res.data;
  }
);

const postsSlice = createSlice({
  name: "posts",
  initialState: {
    posts: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPost.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPost.fulfilled, (state, action) => {
        state.loading = false;
        state.posts = action.payload;
      })
      .addCase(fetchPost.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
  },
});

export default postsSlice.reducer;