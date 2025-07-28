import axios from "axios";

// Determine the API base URL based on environment
const getApiBaseUrl = () => {
  // If we're in development
  if (import.meta.env.DEV) {
    return "/api";
  }

  // If we have a custom API URL in environment
  if (import.meta.env.VITE_API_URL) {
    return import.meta.env.VITE_API_URL;
  }

  // Production API URL - replace with your actual Vercel backend URL
  return "https://back-platform-doc.vercel.app";
};

// Create axios instance with default config
const api = axios.create({
  baseURL: getApiBaseUrl(),
  timeout: 15000, // Increased timeout for Vercel cold starts
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: false, // Set to false for cross-origin requests in production
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // Log request for debugging
    console.log(
      `API Request: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`,
    );

    return config;
  },
  (error) => {
    console.error("Request interceptor error:", error);
    return Promise.reject(error);
  },
);

// Response interceptor to handle errors
api.interceptors.response.use(
  (response) => {
    console.log(`API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error("API Error:", error);

    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
      window.location.href = "/login";
    }

    // Handle CORS errors
    if (error.code === "ERR_NETWORK" || !error.response) {
      console.error("Network/CORS error detected");
    }

    return Promise.reject(error);
  },
);

export default api;
