import axios from "axios"

console.log("Initialisation de l'API avec authentification par cookies...");

let isRefreshing = false;
let isRedirecting = false;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/",
  withCredentials: true,
});

api.interceptors.response.use(
  (response) => {
    console.log("Réponse reçue pour:", response.config.url);
    return response;
  },
  async (error) => {
    console.log("Erreur de réponse pour:", error.config?.url);
    const originalRequest = error.config;

    if (error.response && error.response.status === 401 && !originalRequest._retry && !isRefreshing) {
      if (window.location.pathname === "/login") {
        console.log("Déjà sur la page de login, pas de redirection");
        return Promise.reject(error);
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        console.log("Tentative de rafraîchissement du token");
        await axios.post(
          `${api.defaults.baseURL}/api/token/refresh/`,
          {},
          { withCredentials: true }
        );

        isRefreshing = false;
        return api(originalRequest);
      } catch (refreshError) {
        console.error("Echec du rafraîchissement:", refreshError);
        isRefreshing = false;

        if (!isRedirecting && window.location.pathname !== "/login") {
          console.warn("Redirection vers la page de login");
          isRedirecting = true;
          window.location.href = "/login";
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
