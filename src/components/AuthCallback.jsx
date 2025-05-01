import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function AuthCallback() {
  const navigate = useNavigate();
  const [message, setMessage] = useState('Authentification en cours...');
  const [error, setError] = useState(null);

  useEffect(() => {
    const authenticateUser = async () => {
      try {
        console.log('AuthCallback: Vérification de la connexion...');
        await api.get('/api/user/profile/');

        console.log('AuthCallback: Utilisateur authentifié !');
        setMessage('Authentification réussie, redirection...');

        setTimeout(() => {
          navigate('/', { replace: true });
        }, 1000);
      } catch (err) {
        console.error('AuthCallback: Erreur d\'authentification', err);
        setError('Erreur lors de l\'authentification.');
        setMessage('Erreur d\'authentification. Redirection vers la page de connexion...');

        setTimeout(() => {
          navigate('/login', { replace: true });
        }, 2000);
      }
    };

    authenticateUser();
  }, [navigate]);

  return (
    <div style={{ textAlign: 'center', marginTop: '50px' }}>
      <h2>{message}</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default AuthCallback;
