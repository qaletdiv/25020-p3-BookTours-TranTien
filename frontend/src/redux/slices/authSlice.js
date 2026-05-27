import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axiosClient from "../../api/axiosClient";

export const register = createAsyncThunk(
  "auth/register",
  async ({ email, password, name, phone }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("/auth/register", {
        username: name,
        email,
        password,
        phone,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.errors?.[0]?.msg ||
        error.response?.data?.message ||
        "Đăng ký thất bại"
      );
    }
  }
);

export const updateAvatar = createAsyncThunk(
  "auth/updateAvatar",
  async (formData, { rejectWithValue }) => {
    try {
      const res = await axiosClient.patch("/auth/update-my-avatar", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Cập nhật ảnh thất bại");
    }
  }
);

export const login = createAsyncThunk(
  "auth/login",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await axiosClient.post("/auth/login", {
        emailOrUsername: email,
        password,
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Đăng nhập thất bại"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    loading: false,
    error: null,
    accessToken: localStorage.getItem("accessToken") || null,
    user: localStorage.getItem("user") || null,
  },
  reducers: {
    logout: (state) => {
      state.accessToken = null;
      state.user = null;
      localStorage.removeItem("accessToken");
      localStorage.removeItem("user");
    },
    setUser: (state, action) => {
      state.user = JSON.stringify(action.payload);
      localStorage.setItem("user", JSON.stringify(action.payload));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Đăng ký thất bại";
      })
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        const { accessToken, user } = action.payload;
        state.loading = false;
        state.error = null;
        state.accessToken = accessToken;
        state.user = JSON.stringify(user);
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("user", JSON.stringify(user));
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Đăng nhập thất bại";
      })
      .addCase(updateAvatar.fulfilled, (state, action) => {
        const current = state.user ? JSON.parse(state.user) : {};
        const updated = { ...current, avatar: action.payload.avatarUrl };
        state.user = JSON.stringify(updated);
        localStorage.setItem("user", JSON.stringify(updated));
      });
  },
});

export const { logout, setUser } = authSlice.actions;
export default authSlice.reducer;
