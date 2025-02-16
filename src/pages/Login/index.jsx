import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ACCESS_TOKEN } from '../../constants';

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });

  const handleLogin = async (credentials) => {
    try {
      const response = await fetch('http://localhost:8000/api/token/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      if (!response.ok) {
        throw new Error('Erreur de connexion');
      }

      const data = await response.json();
      localStorage.setItem(ACCESS_TOKEN, data.access);
      // Redirection vers la collection
      navigate('/collection');
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  return (
    <div>
      {/* Formulaire de connexion */}
    </div>
  );
};

export default Login; 