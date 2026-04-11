// frontend/src/services/api.js

import axios from 'axios';

// L'adresse de notre backend (service Auth sur le port 8001)
const API_URL = 'http://localhost:8001';

// Création d'un client axios configuré
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur : ajoute automatiquement le token JWT à chaque requête
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ========== SERVICES D'AUTHENTIFICATION ==========

// Connexion
export const login = async (email, password) => {
  try {
    const response = await api.post('/login', { email, password });
    
    // Stocker le token et les infos utilisateur
    localStorage.setItem('token', response.data.access_token);
    localStorage.setItem('user', JSON.stringify({
      id: response.data.user_id,
      email: response.data.email,
      name: response.data.full_name,
      role: response.data.role
    }));
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: "Erreur de connexion au serveur" };
  }
};

// Inscription
export const register = async (userData) => {
  try {
    const response = await api.post('/register', userData);
    
    localStorage.setItem('token', response.data.access_token);
    localStorage.setItem('user', JSON.stringify({
      id: response.data.user_id,
      email: response.data.email,
      name: response.data.full_name,
      role: response.data.role
    }));
    
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: "Erreur d'inscription" };
  }
};

// Déconnexion
export const logout = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

// Récupérer l'utilisateur connecté
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Vérifier si l'utilisateur est connecté
export const isAuthenticated = () => {
  return localStorage.getItem('token') !== null;
};

// ========== SERVICES DES COURS (API du service-cours sur port 8002) ==========

// Récupérer tous les cours
export const getCourses = async () => {
  try {
    const response = await axios.get('http://localhost:8002/courses');
    return response.data;
  } catch (error) {
    console.error('Erreur getCourses:', error);
    return []; // Retourne un tableau vide en cas d'erreur
  }
};

// Récupérer un cours spécifique par son ID
export const getCourseById = async (courseId) => {
  try {
    const response = await axios.get(`http://localhost:8002/courses/${courseId}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { detail: "Cours non trouvé" };
  }
};

// ========== SERVICES IA (API du service-ia sur port 8004) ==========

// Poser une question à l'IA
export const askAI = async (question, courseContent = null, courseTitle = null) => {
  try {
    let url = 'http://localhost:8004/chat';
    let body = { question };
    
    // Si on a du contexte (un cours spécifique), on utilise l'autre endpoint
    if (courseContent) {
      url = 'http://localhost:8004/chat-with-context';
      body = {
        question,
        course_content: courseContent,
        course_title: courseTitle
      };
    }
    
    const response = await axios.post(url, body);
    return response.data;
  } catch (error) {
    console.error('Erreur askAI:', error);
    return { 
      success: false, 
      response: "Désolé, le service IA n'est pas disponible pour le moment." 
    };
  }
};

export default api;