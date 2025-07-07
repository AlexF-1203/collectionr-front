import { useState, useEffect, useRef } from 'react';
import '../styles/CardDetail.css';
import { RARITY_COLORS } from '../constants/';
import TCGCard from './TCGCard';

const CardDetailComponent = ({ card, onBack, onAddFavorite = () => {} }) => {
  const [priceHistory, setPriceHistory] = useState([]);
  const tooltipRef = useRef(null);

  useEffect(() => {
    if (!card || !card.prices || !card.prices[0]?.daily_price) return;

    const dailyPrices = card.prices[0].daily_price;
    const data = [];

    for (let i = 30; i >= 1; i--) {
      const price = dailyPrices[`day_${i}`];
      if (price !== undefined && price !== null) {
        data.push({
          day: i,
          price: parseFloat(price).toFixed(2)
        });
      }
    }

    setPriceHistory(data);
  }, [card]);


  const getImageUrl = (card) => {
    if (!card) return '';
    if (card.image_url && card.image_url !== 'null') return card.image_url;
    return '';
  };

  const generateSmoothPath = (points) => {
    if (!points || points.length < 2) return '';

    let d = `M ${points[0].x},${points[0].y}`;

    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const midX = (prev.x + curr.x) / 2;
      const midY = (prev.y + curr.y) / 2;
      d += ` Q ${prev.x},${prev.y} ${midX},${midY}`;
    }

    d += ` T ${points[points.length - 1].x},${points[points.length - 1].y}`;
    return d;
  };

  const renderGraph = () => {
    if (!priceHistory || priceHistory.length === 0) return null;

    const prices = priceHistory.map(d => parseFloat(d.price));
    const maxPrice = Math.max(...prices);
    const minPrice = Math.min(...prices);
    const range = maxPrice - minPrice || 1;

    const svgPoints = priceHistory.map((point, index) => {
      const x = (index / (priceHistory.length - 1)) * 100;
      const y = 100 - ((parseFloat(point.price) - minPrice) / range) * 80;
      return { x, y, price: point.price, day: point.day };
    });

    const pathD = generateSmoothPath(svgPoints);

    return (
      <svg
        className="price-line"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        onMouseMove={(e) => {
          try {
            const svg = e.currentTarget;
            const rect = svg.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;

            const closest = svgPoints.reduce((a, b) =>
              Math.abs(b.x - x) < Math.abs(a.x - x) ? b : a
            );

            if (tooltipRef.current) {
              tooltipRef.current.style.opacity = '1';
              tooltipRef.current.style.visibility = 'visible';
              tooltipRef.current.style.left = `${closest.x}%`;
              tooltipRef.current.style.top = `${closest.y}%`;
              tooltipRef.current.innerHTML = `
                <div class='tooltip-content'>
                  <div class='tooltip-day'>Jour ${closest.day}</div>
                  <div class='tooltip-price'>$${closest.price}</div>
                </div>
              `;
            }
          } catch (error) {
            console.error('Erreur tooltip:', error);
          }
        }}
        onMouseLeave={() => {
          try {
            if (tooltipRef.current) {
              tooltipRef.current.style.opacity = '0';
              tooltipRef.current.style.visibility = 'hidden';
            }
          } catch (error) {
            console.error('Erreur tooltip leave:', error);
          }
        }}
      >
        <defs>
          <linearGradient id="lineGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FF8F3F" />
            <stop offset="100%" stopColor="#F8B622" />
          </linearGradient>
          <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        <path
          d={pathD}
          fill="none"
          stroke="url(#lineGradient)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          filter="url(#glow)"
        />
      </svg>
    );
  };

  // Protection contre card undefined
  if (!card) {
    return (
      <div className="page-container">
        <div className="card-detail-container">
          <button className="back-button" onClick={onBack}>
            <span className="back-icon">←</span> Retour à ma collection
          </button>
          <div className="error-message">
            <h2>Erreur: Aucune carte sélectionnée</h2>
            <p>Veuillez retourner à votre collection et sélectionner une carte.</p>
          </div>
        </div>
      </div>
    );
  }

  const rarity = card.rarity || 'UNKNOWN';
  const colorValue = RARITY_COLORS?.[rarity] || RARITY_COLORS?.UNKNOWN || '#666';
  const isGradient = rarity && RARITY_COLORS?.[rarity];

  const rarityStyle = isGradient
    ? {
        background: colorValue,
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        fontWeight: 'bold',
      }
    : {
        color: colorValue,
        fontWeight: 'bold',
      };

  const getCurrentPrice = () => {
    if (!priceHistory || priceHistory.length === 0) return 'Prix non disponible';
    const currentPrice = priceHistory.find(p => p.day === 1)?.price;
    return currentPrice ? `$${currentPrice}` : 'Prix non disponible';
  };

  const getPriceStats = () => {
    if (!priceHistory || priceHistory.length === 0) {
      return { max: 0, min: 0, avg: 0 };
    }

    const prices = priceHistory.map(d => parseFloat(d.price));
    const max = Math.max(...prices);
    const min = Math.min(...prices);
    const avg = (max + min) / 2;

    return { max, min, avg };
  };

  const { max, min, avg } = getPriceStats();

  return (
    <div className="page-container">
      <div className="card-detail-container">
        <button className="back-button" onClick={onBack}>
          <span className="back-icon">←</span> Retour à ma collection
        </button>
        <button
          className="favorite-button"
          onClick={() => onAddFavorite(card.id)}
        >
          <span className="favorite-icon">⭐</span> Ajouter aux favoris
        </button>


        <h1 className="card-detail-title">{card.name || 'Carte Pokémon'}</h1>

        <div className="card-detail-content">
          <div className="card-image-container">
            <TCGCard
              src={getImageUrl(card)}
              alt={card.name || 'Carte Pokémon'}
            />
          </div>

          <div className="card-info-container">
            <div className="price-history-card">
              <h2 className="section-title">Prix évolution (30j)</h2>
              {priceHistory.length > 0 ? (
                <div className="price-chart-container">
                  <div className="price-chart">
                    <div className="price-chart-grid">
                      <div className="grid-line horizontal" style={{ top: '25%' }}></div>
                      <div className="grid-line horizontal" style={{ top: '50%' }}></div>
                      <div className="grid-line horizontal" style={{ top: '75%' }}></div>
                      <div className="grid-line vertical" style={{ left: '33.33%' }}></div>
                      <div className="grid-line vertical" style={{ left: '66.66%' }}></div>
                      <div className="grid-line vertical" style={{ right: 0 }}></div>
                    </div>
                    {renderGraph()}
                    <div className="price-tooltip" ref={tooltipRef}></div>
                  </div>
                  <div className="price-chart-labels">
                    <span>Jour 30</span>
                    <span>Jour 15</span>
                    <span>Jour 1</span>
                  </div>
                  <div className="price-range">
                    <span>${max.toFixed(2)}</span>
                    <span>${avg.toFixed(2)}</span>
                    <span>${min.toFixed(2)}</span>
                  </div>
                </div>
              ) : (
                <p className="no-data-message">Aucun historique de prix disponible</p>
              )}
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <h3 className="stat-title">SET</h3>
                <p className="stat-value">{card.set?.title || 'Set inconnu'}</p>
              </div>
              <div className="stat-card">
                <h3 className="stat-title">RARETÉ</h3>
                <p className="stat-value" style={rarityStyle}>
                  {rarity}
                </p>
              </div>
              <div className="stat-card">
                <h3 className="stat-title">PRIX ACTUEL</h3>
                <p className="stat-value price-value">
                  {getCurrentPrice()}
                </p>
              </div>
              <div className="stat-card">
                <h3 className="stat-title">DATE DE SORTIE</h3>
                <p className="stat-value">{card.release_date || 'Date inconnue'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardDetailComponent;
