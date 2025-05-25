import { useState, useEffect, useRef } from 'react';
import '../styles/CardDetail.css';
import TCGCard from './TCGCard';

const CardDetailComponent = ({ card, onBack = () => {} }) => {
  const [priceHistory, setPriceHistory] = useState([]);
  const tooltipRef = useRef(null);

  useEffect(() => {
    if (!card || !card.prices || !card.prices[0]?.daily_price) return;

    const dailyPrices = card.prices[0].daily_price;
    const data = [];

    for (let i = 30; i >= 1; i--) {
      const price = dailyPrices[`day_${i}`];
      if (price !== undefined) {
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
    if (card.set_id && card.number) return `https://images.pokemontcg.io/${card.set_id}/${card.number}_hires.png`;
    return '';
  };

  const generateSmoothPath = (points) => {
    if (points.length < 2) return '';
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
    const maxPrice = Math.max(...priceHistory.map(d => parseFloat(d.price)));
    const minPrice = Math.min(...priceHistory.map(d => parseFloat(d.price)));
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
          const svg = e.currentTarget;
          const { left, width } = svg.getBoundingClientRect();
          const x = ((e.clientX - left) / width) * 100;

          const closest = svgPoints.reduce((a, b) =>
            Math.abs(b.x - x) < Math.abs(a.x - x) ? b : a
          );

          if (tooltipRef.current) {
            tooltipRef.current.style.opacity = 1;
            tooltipRef.current.style.visibility = 'visible';
            tooltipRef.current.style.left = `${closest.x}%`;
            tooltipRef.current.style.top = `${closest.y}%`;
            tooltipRef.current.innerHTML = `<div class='tooltip-content'><div class='tooltip-day'>Jour ${closest.day}</div><div class='tooltip-price'>$${closest.price}</div></div>`;
          }
        }}
        onMouseLeave={() => {
          if (tooltipRef.current) {
            tooltipRef.current.style.opacity = 0;
            tooltipRef.current.style.visibility = 'hidden';
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

  return (
    <div className="page-container">
      <div className="card-detail-container">
        <button className="back-button" onClick={onBack}>
          <span className="back-icon">←</span> Retour à ma collection
        </button>

        <h1 className="card-detail-title">{card?.name || 'Carte Pokémon'}</h1>

        <div className="card-detail-content">
          <div className="card-image-container">
            <TCGCard src={getImageUrl(card)} alt={card?.name || 'Carte Pokémon'} />
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
                    <span>${Math.max(...priceHistory.map(d => parseFloat(d.price))).toFixed(2)}</span>
                    <span>${((Math.max(...priceHistory.map(d => parseFloat(d.price))) + Math.min(...priceHistory.map(d => parseFloat(d.price)))) / 2).toFixed(2)}</span>
                    <span>${Math.min(...priceHistory.map(d => parseFloat(d.price))).toFixed(2)}</span>
                  </div>
                </div>
              ) : (
                <p className="no-data-message">Aucun historique de prix disponible</p>
              )}
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <h3 className="stat-title">SET</h3>
                <p className="stat-value">{card.set_name || card.set || 'Set inconnu'}</p>
              </div>
              <div className="stat-card">
                <h3 className="stat-title">RARETÉ</h3>
                <p className="stat-value">{card.rarity || 'Rareté inconnue'}</p>
              </div>
              <div className="stat-card">
                <h3 className="stat-title">PRIX ACTUEL</h3>
                <p className="stat-value price-value">
                  {
                   priceHistory.length > 0
                    ? `$${priceHistory.find(p => p.day === 1)?.price || '...'}`
                    : 'Prix non disponible'
                  }
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
