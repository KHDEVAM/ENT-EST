// src/services/api.js
import axios from "axios";

const API_URL = "http://127.0.0.1:8000";

const api = axios.create({
  baseURL: API_URL,
});

// ================= LOGIN =================
export const login = async (username, password) => {
  try {
    const formData = new URLSearchParams();
    formData.append("username", username);
    formData.append("password", password);

    const response = await api.post("/login", formData, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    localStorage.setItem("token", response.data.access_token);

    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: "Erreur login" };
  }
};

// ================= REGISTER =================
export const register = async (userData) => {
  try {
    const response = await api.post("/register", userData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: "Erreur register" };
  }
};

// ================= PROTECTED =================
export const getProtected = async () => {
  try {
    const token = localStorage.getItem("token");

    const response = await api.get("/protected", {
      params: { token },
    });

    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: "Erreur protected" };
  }
};

// ================= UTILS =================
export const logout = () => {
  localStorage.removeItem("token");
};

export const isAuthenticated = () => {
  return localStorage.getItem("token") !== null;
};

export const getCurrentUser = () => {
  return localStorage.getItem("token");
};