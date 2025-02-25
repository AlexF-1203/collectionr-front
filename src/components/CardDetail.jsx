import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import CardDetailComponent from '../components/CardDetailComponent'; // Importez le composant que j'ai créé

const CardDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [card, setCard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCardDetails = async () => {
      try {
        setLoading(true);
        const response = await api.get(`/api/cards/${id}/`);
        setCard(response.data);
        setError(null);
      } catch (err) {
        console.error("Erreur lors du chargement des détails de la carte:", err);
        setError("Impossible de charger les détails de la carte.");
      } finally {
        setLoading(false);
      }
    };

    fetchCardDetails();
  }, [id]);

  const handleBack = () => {
    navigate('/cards');
  };

  if (loading) {
    return (
      <div className="cards-page">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p>Chargement des détails de la carte...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cards-page">
        <div className="error-message">{error}</div>
        <button className="back-button" onClick={handleBack}>Retour à ma collection</button>
      </div>
    );
  }

  return <CardDetailComponent card={card} onBack={handleBack} />;
};

export default CardDetail;