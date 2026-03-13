import axios from "axios";
import { clearTokens, getAccessToken, setAccessToken } from "../utils/tokenStorage";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

const jsonHeaders = { "Content-Type": "application/json" };

const api = axios.create({
  baseURL: API_BASE,
  headers: jsonHeaders,
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  const token = getAccessToken();
  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status === 401 &&
      originalRequest &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/api/refresh")
    ) {
      originalRequest._retry = true;

      try {
        const { data } = await api.post("/api/refresh");
        setAccessToken(data.accessToken);
        originalRequest.headers = originalRequest.headers || {};
        originalRequest.headers.Authorization = `Bearer ${data.accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        clearTokens();
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export const loginUser = (payload) => api.post("/api/login", payload);

export const signupUser = (payload) => api.post("/api/users", payload);

export const fetchUsers = () => api.get("/api/users");

export const logoutUser = () => api.post("/api/logout");

export const refreshTokens = async () => {
  const { data } = await api.post("/api/refresh");
  setAccessToken(data.accessToken);
  return data.accessToken;
};
