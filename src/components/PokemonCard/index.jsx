import React, { useRef, useState } from 'react';
import './styles.css';

const PokemonCard = ({ 
  name,
  number,
  set,
  types = [],
  subtypes = ["basic"],
  supertype = "pokémon",
  rarity = "common",
  images,
}) => {
  const cardRef = useRef(null);
  const [isInteracting, setIsInteracting] = useState(false);
  const [rotation, setRotation] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 50, y: 50 });

  const cardClasses = [
    'card',
    types[0]?.toLowerCase() || '',
    'interactive',
    'masked',
    isInteracting ? 'interacting' : ''
  ].filter(Boolean).join(' ');

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;

    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const rotateX = ((e.clientY - centerY) / (rect.height / 2)) * 10;
    const rotateY = ((e.clientX - centerX) / (rect.width / 2)) * 10;

    setRotation({ x: rotateX, y: rotateY });
    setPosition({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100
    });
  };

  return (
    <div 
      ref={cardRef}
      className={cardClasses}
      data-number={number?.toString()}
      data-set={set?.toLowerCase()}
      data-subtypes={subtypes.join(' ').toLowerCase()}
      data-supertype={supertype.toLowerCase()}
      data-rarity={rarity.toLowerCase()}
      data-trainer-gallery="false"
      style={{
        '--mx': `${position.x}%`,
        '--my': `${position.y}%`,
        '--posx': `${position.x}%`,
        '--posy': `${position.y}%`,
      }}
    >
      <div className="card__translater">
        <div 
          className="card__rotator"
          onMouseMove={handleMouseMove}
          onMouseEnter={() => setIsInteracting(true)}
          onMouseLeave={() => {
            setIsInteracting(false);
            setRotation({ x: 0, y: 0 });
            setPosition({ x: 50, y: 50 });
          }}
          style={{
            '--rotate-x': `${rotation.x}deg`,
            '--rotate-y': `${rotation.y}deg`,
          }}
        >
          <div className="card__front">
            <img 
              src={images?.large} 
              alt={name}
              loading="lazy"
              className="card__image"
              width="660"
              height="921"
            />
            <div className="card__shine" />
            <div className="card__glare" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PokemonCard; 