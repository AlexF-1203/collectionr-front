import { Navigate } from "react-router-dom";
import PropTypes from 'prop-types';
import axios from "axios";
import { useState, useEffect } from "react";

function ProtectedRoute({ children }) {
    const [isAuthorized, setIsAuthorized] = useState(null);
    const baseURL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const checkAuth = async () => {
            if (window.location.pathname === "/login") {
                setIsAuthorized(false);
                return;
            }

            try {
                console.log("ProtectedRoute: vérification d'authentification");

                await axios.get(`${baseURL}/api/user/profile/`, {
                    withCredentials: true
                });

                console.log("ProtectedRoute: utilisateur authentifié");
                setIsAuthorized(true);
            } catch (error) {
                console.error("ProtectedRoute: erreur d'authentification", error);
                setIsAuthorized(false);
            }
        };

        checkAuth();
    }, [baseURL]);

    if (isAuthorized === null) {
        return <div>Loading...</div>;
    }

    return isAuthorized ? children : <Navigate to="/login" />;
}

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired
};

export default ProtectedRoute;
