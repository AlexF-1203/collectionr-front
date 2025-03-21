import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function Logout() {
  const navigate = useNavigate();

  useEffect(() => {
    const logout = async () => {
      try {
        console.log("Déconnexion en cours...");
        await api.post('/api/logout/');
        console.log("Déconnexion réussie");
        navigate('/login');
      } catch (error) {
        console.error('Erreur lors de la déconnexion:', error);
        navigate('/login');
      }
    };
    
    logout();
  }, [navigate]);

  return <div className="logout-message">Déconnexion en cours...</div>;
}

export default Logout; 