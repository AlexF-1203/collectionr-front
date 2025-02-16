// import foilHoloBg from '../../src/assets/img/foil-holo-bg.png';
// import foilHoloMask from '../../src/assets/img/foil-holo-mask.png';
// import foilEtched from '../../src/assets/img/foil-etched.png';
// import foilEtchedMask from '../../src/assets/img/foil-etched-mask.png';
// import foilGalaxy from '../../src/assets/img/foil-galaxy.png';
// import foilGalaxyMask from '../../src/assets/img/foil-galaxy-mask.png';
// import foilRainbow from '../../src/assets/img/foil-rainbow.png';
// import foilRainbowMask from '../../src/assets/img/foil-rainbow-mask.png';
// import foilTexture from '../../src/assets/img/foil-texture.png';
// import foilTextureMask from '../../src/assets/img/foil-texture-mask.png';
// import foilVintage from '../../src/assets/img/foil-vintage.png';
// import foilVintageMask from '../../src/assets/img/foil-vintage-mask.png';

export default {
  'rare holo v': {
    foil: '/assets/img/cosmos-top.png',
    mask: '/assets/img/cosmos-top.png'
  },
  'amazing rare': {
    foil: '/assets/img/foil-amazing.png',
    mask: '/assets/img/mask-amazing.png'
  },
  'Rare Holo VMAX': {
    foil: new URL('../assets/img/foil-rainbow.png', import.meta.url).href,
    mask: new URL('../assets/img/foil-rainbow-mask.png', import.meta.url).href,
    className: 'rare-holo-vmax'
  },
  'Rare Rainbow': {
    foil: new URL('../assets/img/foil-texture.png', import.meta.url).href,
    mask: new URL('../assets/img/foil-texture-mask.png', import.meta.url).href,
    className: 'rare-rainbow'
  },
  'Rare Ultra': {
    foil: new URL('../assets/img/foil-vintage.png', import.meta.url).href,
    mask: new URL('../assets/img/foil-vintage-mask.png', import.meta.url).href,
    className: 'rare-ultra'
  },
  'Common': {
    foil: new URL('../assets/img/cosmos-top.png', import.meta.url).href,
    mask: new URL('../assets/img/cosmos-top.png', import.meta.url).href,
    className: 'common'
  },
  'Uncommon': {
    foil: new URL('../assets/img/foil-galaxy.png', import.meta.url).href,
    mask: new URL('../assets/img/foil-galaxy-mask.png', import.meta.url).href,
    className: 'uncommon'
  },
  'rare ultra': {
    // Pour les cartes V
  },
  'rare holo vmax': {
    // Pour les cartes VMAX
  }
}; 