const RARITY_COLORS = {
  COMMON: '#A8A8A8',
  UNCOMMON: '#78C850',
  RARE: '#404040',
  HOLORARE: '#1E90FF',
  HOLORAREGX: '#9932CC',
  HOLORAREEX: '#8A2BE2',
  HOLORARELVX: '#DA70D6',
  HOLORARESTARRARE: '#FFD700',
  BREAKRARE: '#F4C430',
  PRIMERARE: '#B8860B',
  PRISMRARE: '#00CED1',
  RAINBOWRARE: 'linear-gradient(to right, red, orange, yellow, green, blue, indigo, violet)',
  SHININGRARE: '#4169E1',
  SHINYRARE: '#40E0D0',
  SHINYRAREGX: '#7B68EE',
  HOLORAREV: '#20B2AA',
  HOLORAREVMAX: '#C71585',
  HOLORAREVSTAR: '#E6BE8A',
  ULTRARARE: '#BA55D3',
  ACERARE: '#DC143C',
  SECRETRARE: '#FFD700',
  ILLUSTRATIONRARE: '#00BFFF',
  SPECIALILLUSTRATIONRARE: '#FF8C00',
  DOUBLERARE: '#9370DB',
  TRIPLERAARE: '#FF4500',
  PROMO: '#FF6347',
  LEGENDRARE: '#8B0000',
  UNKNOWN: '#CCCCCC',
};

const RARITY_LABELS = {
  COMMON: 'Common',
  UNCOMMON: 'Uncommon',
  RARE: 'Rare',
  HOLORARE: 'Holo Rare',
  HOLORAREGX: 'Holo Rare GX',
  HOLORAREEX: 'Holo Rare EX',
  HOLORARELVX: 'Holo Rare LV.X',
  HOLORARESTARRARE: 'Holo Rare ★',
  BREAKRARE: 'Rare BREAK',
  PRIMERARE: 'Rare Prime',
  PRISMRARE: 'Rare Prism Star',
  RAINBOWRARE: 'Rainbow Rare',
  SHININGRARE: 'Shining Rare',
  SHINYRARE: 'Shiny Rare',
  SHINYRAREGX: 'Shiny Rare GX',
  HOLORAREV: 'Holo Rare V',
  HOLORAREVMAX: 'Holo Rare VMAX',
  HOLORAREVSTAR: 'Holo Rare VSTAR',
  ULTRARARE: 'Ultra Rare',
  ACERARE: 'Rare ACE',
  SECRETRARE: 'Secret Rare',
  ILLUSTRATIONRARE: 'Illustration Rare',
  SPECIALILLUSTRATIONRARE: 'Special Illustration Rare',
  DOUBLERARE: 'Double Rare',
  TRIPLERAARE: 'Triple Rare',
  PROMO: 'Promo',
  LEGENDRARE: 'Legend Rare',
  UNKNOWN: 'Unknown',
};

const RarityBadge = ({ rarity }) => {
  const color = RARITY_COLORS[rarity] || RARITY_COLORS.UNKNOWN;
  const label = RARITY_LABELS[rarity] || 'Unknown';

  const isGradient = color.startsWith('linear-gradient');

  return (
    <span
      style={{
        background: isGradient ? color : undefined,
        backgroundColor: !isGradient ? color : undefined,
        border: '1px solid rgba(0,0,0,0.1)',
        display: 'inline-block',
        minWidth: 100,
        textAlign: 'center',
      }}
    >
      {label}
    </span>
  );
};

export default RarityBadge;
