import axios from "axios";
import { logout } from "../redux/slices/authSlice";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});

export const setupInterceptors = (store) => {
  axiosClient.interceptors.request.use(
    (config) => {
      const accessToken = store.getState().auth.accessToken;
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error) => Promise.reject(error),
  );

  axiosClient.interceptors.response.use(
    (response) => response,
    (error) => {
      const { response, config: originalRequest } = error;
      if (
        response &&
        (response.status === 401 || response.status === 403) &&
        !originalRequest.url.includes("/auth/login")
      ) {
        store.dispatch(logout());
      }
      return Promise.reject(error);
    },
  );
};

export default axiosClient;
