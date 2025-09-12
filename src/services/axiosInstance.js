import axios from "axios";

export const BASEURL = "http://localhost:8000/api";

// Create Axios instance
const axiosInstance = axios.create({
  baseURL: BASEURL,
  withCredentials: true, // Allows sending cookies
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper to refresh access token
const refreshToken = async () => {
  try {
    const response = await axios.post(
      `${BASEURL}accounts/v1/token/refresh/`,
      {},
      { withCredentials: true }
    );
    return response.data.access;
  } catch (error) {
    console.error("Token refresh failed", error);
    throw error;
  }
};

// Request interceptor to inject the access token
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token refresh
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const newAccessToken = await refreshToken();
        localStorage.setItem("accessToken", newAccessToken);
        axiosInstance.defaults.headers.common[
          "Authorization"
        ] = `Bearer ${newAccessToken}`;
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        console.error("Refresh failed, redirecting to login");
        localStorage.removeItem("access_token");
        // Redirect without using useNavigate
        // window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
