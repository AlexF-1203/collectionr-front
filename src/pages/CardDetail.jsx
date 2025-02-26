import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CardDetailComponent from '../components/CardDetailComponent';
import PriceChartGradient from '../components/PriceChartGradient';
import api from '../api';
import '../styles/CardDetail.css';
import '../components/TCGCard'; // Import du Web Component

// Force l'enregistrement du composant web s'il n'est pas déjà défini
if (!customElements.get('tcg-card')) {
  import('../components/TCGCard').then(() => {
    console.log('TCGCard custom element registered in CardDetail');
  });
}

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
        console.log("Card data fetched:", response.data); // Log pour le débogage
        setCard(response.data);
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
          <div className="loader"></div>
          <p className="loading-text">Chargement des détails de la carte...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="cards-page">
        <div className="error-container">
          <div className="error-icon">!</div>
          <div className="error-message">{error}</div>
          <button className="back-button" onClick={handleBack}>Retour à ma collection</button>
        </div>
      </div>
    );
  }

  return (
    <>
      <PriceChartGradient />
      <CardDetailComponent card={card} onBack={handleBack} />
    </>
  );
};

export default CardDetail;