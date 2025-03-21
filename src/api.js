import axios from "axios"

console.log("Initialisation de l'API avec authentification par cookies...");

// Indicateur pour éviter les boucles infinies
let isRefreshing = false;
let isRedirecting = false;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/",
  withCredentials: true, // Important pour envoyer/recevoir les cookies
});

// Plus besoin des intercepteurs pour gérer les tokens dans localStorage
// Nous gardons l'intercepteur de réponse pour les erreurs 401

api.interceptors.response.use(
  (response) => {
    console.log("Réponse reçue pour:", response.config.url);
    return response;
  },
  async (error) => {
    console.log("Erreur de réponse pour:", error.config?.url);
    const originalRequest = error.config;
    
    // Si l'erreur est 401 (non autorisé) et que nous n'avons pas déjà essayé de rafraîchir le token
    if (error.response && error.response.status === 401 && !originalRequest._retry && !isRefreshing) {
      // Vérifier si nous sommes déjà sur la page de login
      if (window.location.pathname === "/login") {
        console.log("Déjà sur la page de login, pas de redirection");
        return Promise.reject(error);
      }
      
      originalRequest._retry = true;
      isRefreshing = true;
      
      try {
        console.log("Tentative de rafraîchissement du token");
        // Le token de rafraîchissement est envoyé automatiquement via cookie
        await axios.post(
          `${api.defaults.baseURL}/api/token/refresh/`,
          {}, 
          { withCredentials: true }
        );
        
        isRefreshing = false;
        // Réessayer la requête d'origine
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Echec du rafraîchissement:", refreshError);
        isRefreshing = false;
        
        // Redirection vers la page de connexion, mais une seule fois
        if (!isRedirecting && window.location.pathname !== "/login") {
          console.warn("Redirection vers la page de login");
          isRedirecting = true;
          window.location.href = "/login";
          // Réinitialiser après la redirection
          setTimeout(() => {
            isRedirecting = false;
          }, 1000);
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;