// Vérifiez votre fichier api.js
// L'intercepteur doit ajouter correctement le token d'authentification

import axios from "axios"
import { ACCESS_TOKEN, REFRESH_TOKEN } from "./constants"

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/",
});

// Cet intercepteur est crucial pour résoudre les problèmes d'authentification
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(ACCESS_TOKEN);
    if (token) {
      // S'assurer que les en-têtes existent
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
      
      // Ajouter des logs pour le débogage
      console.log("Token d'authentification ajouté à la requête:", token.substring(0, 10) + "...");
    } else {
      console.warn("Aucun token d'authentification trouvé dans localStorage");
    }
    return config;
  },
  (error) => {
    console.error("Erreur dans l'intercepteur de requête:", error);
    return Promise.reject(error);
  }
);

// Optionnel: Ajouter un intercepteur de réponse pour gérer les erreurs 401
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Si l'erreur est 401 (non autorisé) et que nous n'avons pas déjà essayé de rafraîchir le token
    if (error.response && error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Essayer de rafraîchir le token
        const refreshToken = localStorage.getItem(REFRESH_TOKEN);
        if (refreshToken) {
          const response = await axios.post(
            `${api.defaults.baseURL}/api/token/refresh/`,
            { refresh: refreshToken }
          );
          
          if (response.status === 200) {
            // Mettre à jour le token d'accès
            localStorage.setItem(ACCESS_TOKEN, response.data.access);
            
            // Mettre à jour l'en-tête d'autorisation
            originalRequest.headers.Authorization = `Bearer ${response.data.access}`;
            
            // Réessayer la requête d'origine
            return api(originalRequest);
          }
        }
      } catch (refreshError) {
        console.error("Erreur lors du rafraîchissement du token:", refreshError);
      }
      
      // Si nous n'avons pas pu rafraîchir le token ou s'il n'y a pas de token de rafraîchissement
      console.warn("Session expirée, redirection vers la page de connexion");
      localStorage.removeItem(ACCESS_TOKEN);
      localStorage.removeItem(REFRESH_TOKEN);
      window.location.href = "/login";
    }
    
    return Promise.reject(error);
  }
);

export default api;