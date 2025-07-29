"use client";

import { useState, useEffect } from "react";
import axios from "axios";

// For development, use proxy. For production, use environment variable
//const API_BASE_URL = "https://back-platform-doc.vercel.app";

const API_BASE_URL = "https://back-platform-doc-re1c.vercel.app";

// Configure axios with base URL
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setLoading(false);
        return;
      }

      const response = await api.get("/api/auth/verify", {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.data.success) {
        setIsAuthenticated(true);
        setUser(response.data.user);
      } else {
        localStorage.removeItem("token");
        localStorage.removeItem("userData");
      }
    } catch (error) {
      localStorage.removeItem("token");
      localStorage.removeItem("userData");
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const response = await api.post("/api/auth/login", credentials);

      if (response.data.success) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("userData", JSON.stringify(response.data.user));
        setIsAuthenticated(true);
        setUser(response.data.user);
        return { success: true };
      }
    } catch (error) {
      return {
        success: false,
        message:
          error.response?.data?.message ||
          "Erreur de connexion. Veuillez vérifier vos identifiants.",
      };
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userData");
    setIsAuthenticated(false);
    setUser(null);
  };

  return {
    isAuthenticated,
    user,
    loading,
    login,
    logout,
  };
};
