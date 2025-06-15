import React from 'react';

// Composant pour les définitions SVG des gradients utilisés dans le graphique
const PriceChartGradient = () => {
  return (
    <svg style={{ position: 'absolute', width: 0, height: 0 }} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="gradient-line" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#FF8F3F" />
          <stop offset="100%" stopColor="#F8B622" />
        </linearGradient>

        <linearGradient id="card-hover-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255, 143, 63, 0.1)" />
          <stop offset="100%" stopColor="rgba(248, 182, 34, 0.05)" />
        </linearGradient>

        <linearGradient id="card-shine" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="rgba(255, 255, 255, 0.5)" />
          <stop offset="50%" stopColor="rgba(255, 255, 255, 0)" />
          <stop offset="100%" stopColor="rgba(255, 255, 255, 0.5)" />
        </linearGradient>
      </defs>
    </svg>
  );
};

export default PriceChartGradient;
