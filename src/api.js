// Vérifiez votre fichier api.js
// L'intercepteur doit ajouter correctement le token d'authentification

import axios from "axios"
import { ACCESS_TOKEN } from "./constants"

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
  (error) => {
    if (error.response && error.response.status === 401) {
      console.warn("Erreur 401: Session expirée ou token invalide");
      // Rediriger vers la page de connexion si nécessaire
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export default api;