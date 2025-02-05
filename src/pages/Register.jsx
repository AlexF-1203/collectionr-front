import React, { useState } from 'react';
import '../styles/Sign.css'; // Assurez-vous de créer ce fichier CSS

const Login = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    passwordConfirmation: '',
    country: '',
    city: '',
    address: '',
    postalCode: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Logique de soumission du formulaire
    console.log(formData);
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Créer un compte</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-inputs">
            <input
              type="text"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
              placeholder="Prénom"
              required
              autoFocus
            />
            <input
              type="text"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
              placeholder="Nom"
              required
            />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Email"
              required
            />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Mot de passe"
              required
            />
            <input
              type="password"
              name="passwordConfirmation"
              value={formData.passwordConfirmation}
              onChange={handleChange}
              placeholder="Confirmer le mot de passe"
              required
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="button-shine">S'inscrire</button>
          </div>
        </form>
        <div className="form-links">
          {/* Ajoutez ici les liens supplémentaires si nécessaire */}
        </div>
      </div>
    </div>
  );
};

export default Login;
