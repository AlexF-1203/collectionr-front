import React, { useEffect, useRef, useState } from 'react';
import '../styles/TCGCard.css'; // Assurez-vous que les styles sont correctement importés

const EXPAND_TRANSITION_TIME = 600;

const TCGCard = ({ src, alt }) => {
  const cardRef = useRef(null);
  const proxyRef = useRef(null);
  const [expanded, setExpanded] = useState(false);
  const [ready, setReady] = useState(false);
  const [transforming, setTransforming] = useState(false);
  const [isTouching, setIsTouching] = useState(false);

  useEffect(() => {
    const card = cardRef.current;
    const proxy = proxyRef.current;

    const handleMouseEnter = (e) => {
      if (isTouching) return;
      startInteraction(e.clientX, e.clientY);
    };

    const handleMouseMove = (e) => {
      if (isTouching) return;
      updateTransform(e.clientX, e.clientY);
    };

    const handleMouseLeave = () => {
      if (isTouching) return;
      endInteraction();
    };

    const handleTouchStart = (e) => {
      setIsTouching(true);
      const touch = e.touches[0];
      startInteraction(touch.clientX, touch.clientY);
    };

    const handleTouchMove = (e) => {
      e.preventDefault();
      const touch = e.touches[0];
      updateTransform(touch.clientX, touch.clientY);
    };

    const handleTouchEnd = () => {
      endInteraction();
    };

    const handleClick = () => {
      if (expanded) {
        close();
      } else {
        setExpanded(true);
        centerCard();
        document.addEventListener('click', handleDocumentClick);
        document.addEventListener('keydown', handleDocumentKeydown);
      }
    };

    const handleResize = () => {
      if (expanded) {
        centerCard(true);
      }
    };

    const startInteraction = (clientX, clientY) => {
      if (!ready) return;
      const transitionTime = 300;
      card.style.transition = `all ${transitionTime}ms ease-out`;
      if (!expanded) {
        document.documentElement.style.setProperty('--z-index', '2');
      }
      document.documentElement.style.setProperty('--glare-opacity', '0.75');
      const r = (Math.random() * 0.5 + 0.5) * (Math.random() < 0.5 ? -1 : 1);
      document.documentElement.style.setProperty('--display-rz', `${r}deg`);
      updateTransform(clientX, clientY);
      setTimeout(() => {
        card.style.transition = '';
      }, transitionTime);
    };

    const updateTransform = (clientX, clientY) => {
      if (transforming) return;
      const rect = card.getBoundingClientRect();
      const x = clientX - rect.left;
      const y = clientY - rect.top;
      const xPercent = (x / rect.width) * 100;
      const yPercent = (y / rect.height) * 100;
      const xFromCenter = x - rect.width / 2;
      const yFromCenter = y - rect.height / 2;
      const tiltX = (yFromCenter / rect.height) * 10;
      const tiltY = -(xFromCenter / rect.width) * 10;
      setTransforming(true);
      requestAnimationFrame(() => {
        document.documentElement.style.setProperty('--pointer-x', `${xPercent}%`);
        document.documentElement.style.setProperty('--pointer-y', `${yPercent}%`);
        document.documentElement.style.setProperty('--display-rx', `${tiltX}deg`);
        document.documentElement.style.setProperty('--display-ry', `${tiltY}deg`);
        setTransforming(false);
      });
    };

    const endInteraction = () => {
      const transitionTime = 300;
      card.style.transition = `all ${transitionTime}ms ease-out`;
      document.documentElement.style.setProperty('--glare-opacity', '0');
      document.documentElement.style.setProperty('--display-rz', '0deg');
      document.documentElement.style.setProperty('--display-rx', '0deg');
      document.documentElement.style.setProperty('--display-ry', '0deg');
      setTimeout(() => {
        if (!expanded) {
          document.documentElement.style.setProperty('--z-index', '');
        }
        card.style.transition = '';
        setIsTouching(false);
      }, transitionTime);
    };

    const close = () => {
      setExpanded(false);
      resetCardPosition();
      document.removeEventListener('click', handleDocumentClick);
      document.removeEventListener('keydown', handleDocumentKeydown);
    };

    const centerCard = (skipTransition = false) => {
      if (skipTransition) {
        card.style.setProperty('transition', 'none');
      }
      document.documentElement.style.setProperty('--z-index', '20');
      document.documentElement.style.setProperty('--display-rz', '0deg');
      const screenX = window.innerWidth / 2;
      const screenY = window.innerHeight / 2;
      const rect = proxy.getBoundingClientRect();
      const isPortrait = window.innerHeight > window.innerWidth;
      const scaleX = (window.innerWidth / card.clientWidth) * 0.9;
      const scaleY = (window.innerHeight / card.clientHeight) * 0.9;
      let scale = isPortrait ? scaleX : scaleY;
      if (isPortrait && card.clientHeight * scale > window.innerHeight) {
        scale = scaleY;
      }
      const tx = screenX - rect.left - rect.width / 2;
      const ty = screenY - rect.top - rect.height / 2;

      card.style.setProperty('--display-tx', `${tx}px`);
      card.style.setProperty('--display-ty', `${ty}px`);
      card.style.setProperty('--display-scale', Math.min(scale, 1));
      setTimeout(() => {
        card.style.setProperty('transition', '');
      }, EXPAND_TRANSITION_TIME);
    };

    const resetCardPosition = (skipTransition = false) => {
      const scale = proxy.getBoundingClientRect().height / card.clientHeight;
      if (skipTransition) {
        card.style.setProperty('transition', 'none');
      }
      card.style.setProperty('--display-tx', '0px');
      card.style.setProperty('--display-ty', '0px');
      card.style.setProperty('--display-scale', scale);
      setTimeout(() => {
        card.style.setProperty('transition', '');
        document.documentElement.style.setProperty('--z-index', '');
      }, EXPAND_TRANSITION_TIME * 0.25);
    };

    const handleDocumentClick = (e) => {
      if (expanded && e.target !== card) {
        close();
      }
    };

    const handleDocumentKeydown = (e) => {
      close();
    };

    const initImage = () => {
      const img = cardRef.current.querySelector('.tcg-card');
      const fadeInDuration = 500;
      img.style.opacity = 0;
      img.style.transition = `opacity ${fadeInDuration}ms ease-in`;
      setReady(false);
      if (img.complete) {
        resetCardPosition(true);
        img.style.opacity = '';
        setReady(true);
        img.style.display = 'block';
        setTimeout(() => {
          img.style.transition = '';
        }, fadeInDuration);
      } else {
        proxy.style.overflow = 'hidden';
        img.onload = () => {
          resetCardPosition(true);
          proxy.style.overflow = '';
          img.style.opacity = '';
          setReady(true);
          setTimeout(() => {
            img.style.transition = '';
          }, fadeInDuration);
        };
      }
    };

    card.addEventListener('mouseenter', handleMouseEnter);
    card.addEventListener('mouseleave', handleMouseLeave);
    card.addEventListener('mousemove', handleMouseMove);
    card.addEventListener('touchstart', handleTouchStart);
    card.addEventListener('touchmove', handleTouchMove);
    card.addEventListener('touchend', handleTouchEnd);
    card.addEventListener('touchcancel', handleTouchEnd);
    card.addEventListener('click', handleClick);

    window.addEventListener('resize', handleResize);

    initImage();

    const resizeObserver = new ResizeObserver(resetCardPosition);
    resizeObserver.observe(proxy);

    return () => {
      card.removeEventListener('mouseenter', handleMouseEnter);
      card.removeEventListener('mouseleave', handleMouseLeave);
      card.removeEventListener('mousemove', handleMouseMove);
      card.removeEventListener('touchstart', handleTouchStart);
      card.removeEventListener('touchmove', handleTouchMove);
      card.removeEventListener('touchend', handleTouchEnd);
      card.removeEventListener('touchcancel', handleTouchEnd);
      card.removeEventListener('click', handleClick);
      window.removeEventListener('resize', handleResize);
      resizeObserver.disconnect();
    };
  }, [expanded, ready, transforming, isTouching]);

  return (
    <div className="tcg-wrapper" ref={proxyRef}>
      <div className="tcg-proxy"></div>
      <button className="tcg-display" ref={cardRef}>
        <img className="tcg-card" src={src} alt={alt} loading="lazy" />
        <div className="tcg-shine"></div>
        <div className="tcg-glare"></div>
      </button>
    </div>
  );
};

export default TCGCard;
