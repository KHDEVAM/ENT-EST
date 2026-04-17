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
  localStorage.removeItem("user");
  window.location.href="/login";
};

export const isAuthenticated = () => {
  return localStorage.getItem("token") !== null;
};

export const getCurrentUser = () => {
  return localStorage.getItem("token");
};


// ================= CHATBOT IA =================
export const askAI = async (question, courseContent = null, courseTitle = null) => {
  try {
    // Simulation pour le test (car service IA pas encore prêt)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    const lowerQuestion = question.toLowerCase();
    if (lowerQuestion.includes('microservice')) {
      return { success: true, response: "Un microservice est une petite application indépendante qui fait une seule chose spécifique. Ils communiquent entre eux via des API." };
    } else if (lowerQuestion.includes('docker')) {
      return { success: true, response: "Docker est un outil qui permet de conteneuriser des applications pour qu'elles fonctionnent partout de la même façon." };
    } else {
      return { success: true, response: `Merci pour votre question sur "${question}". Je suis l'assistant IA de l'EST Salé. N'hésitez pas à consulter vos cours pour plus d'informations.` };
    }
  } catch (error) {
    throw error.response?.data || { detail: "Erreur avec l'IA" };
  }
};
// ================= COURS =================
export const getCourses = async () => {
  try {
    // Pour l'instant, on retourne des données fictives
    // Plus tard, on appellera le vrai backend : http://localhost:8002/courses
    return [
      { id: 1, title: 'Architecture Microservices', teacher: 'Prof. Alaoui', description: 'Découvrez les bases des microservices' },
      { id: 2, title: 'Docker & Kubernetes', teacher: 'Prof. Benali', description: 'Conteneurisation et orchestration' },
      { id: 3, title: 'Programmation Web avec React', teacher: 'Prof. Chraibi', description: 'Développement frontend moderne' },
      { id: 4, title: 'Bases de données NoSQL', teacher: 'Prof. Toumi', description: 'Introduction à Cassandra' },
    ];
  } catch (error) {
    throw error.response?.data || { detail: "Erreur chargement cours" };
  }
};

// ================= SCHEDULE =================

// GET all schedules
export const getSchedule = async () => {
  const res = await fetch(`${API_URL}/api/schedule/`);
  return res.json();
};

export const createSchedule = async (data) => {
  const res = await fetch(`${API_URL}/api/schedule/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  return res.json();
};