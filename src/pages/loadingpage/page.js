import template from "./template.html?raw";
import { gsap } from "gsap";
import { htmlToDOM } from "@/lib/utils.js";
import hyperspaceSound from "@/stock/blender-hyperspace-jump.mp3";

let C = {};
let V = {};

// --- MOTEUR HYPERSPACE ---
C.animateHyperspaceStars = function(canvas) {
  const ctx = canvas.getContext('2d');
  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  window.addEventListener('resize', resize);
  resize();

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const stars = [];
  const starCount = 400;
  
  for (let i = 0; i < starCount; i++) {
    stars.push({
      x: (Math.random() - 0.5) * canvas.width * 2,
      y: (Math.random() - 0.5) * canvas.height * 2,
      z: Math.random() * 1000,
      px: 0, py: 0 // Positions précédentes pour l'effet de traînée
    });
  }

  let speed = 0.5;
  let acceleration = 1.035; // Accélération constante

  function draw() {
    // Fond noir avec très faible persistance pour accentuer le flou
    ctx.fillStyle = 'rgba(16, 19, 31, 0.2)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    speed *= acceleration;
    if (speed > 150) speed = 150; // Cap de vitesse

    stars.forEach(star => {
      star.z -= speed;

      // Reset de l'étoile si elle sort de l'écran (derrière nous)
      if (star.z <= 0) {
        star.z = 1000;
        star.x = (Math.random() - 0.5) * canvas.width * 2;
        star.y = (Math.random() - 0.5) * canvas.height * 2;
        star.px = 0;
        star.py = 0;
      }

      // Projection 3D vers 2D
      const k = 128 / star.z;
      const x = star.x * k + centerX;
      const y = star.y * k + centerY;

      if (star.px !== 0) {
        const opacity = Math.min(1, (1000 - star.z) / 500);
        ctx.strokeStyle = `rgba(255, 255, 255, ${opacity})`;
        ctx.lineWidth = Math.max(0.5, k * 1.5);
        ctx.lineCap = 'round';
        
        ctx.beginPath();
        ctx.moveTo(x, y);
        ctx.lineTo(star.px, star.py); // Trait entre actuelle et précédente
        ctx.stroke();
      }

      star.px = x;
      star.py = y;
    });

    requestAnimationFrame(draw);
  }

  draw();
};

// --- SEQUENCE D'ANIMATION ET AUDIO ---
C.playHyperspaceSequence = function(container) {
  const atmosphere = container.querySelector('.atmosphere-layer');
  const statusMsg = container.querySelector('#status-msg');
  
  // Audio
  const driveSound = new Audio(hyperspaceSound); 
  driveSound.volume = 0;
  
  const tl = gsap.timeline();

  // 1. Démarrage du son et changement progressif du texte
  tl.to(driveSound, {
    volume: 1,
    duration: 3,
    onStart: () => {
      driveSound.currentTime = 0; // Remet l'audio au début
      driveSound.play().catch(e => console.log("Audio bloqué par navigateur"));
    }
  }, 0);

  tl.to(statusMsg, {
    innerText: "CALCUL DES COORDONNÉES...",
    duration: 1.5,
  }, 0.5);

  tl.to(statusMsg, {
    innerText: "SAUT DANS 3... 2... 1...",
    duration: 1.5,
  }, 2);

  // 2. Le Flash Blanc Final (Le "Saut")
  tl.to(atmosphere, {
    opacity: 1,
    duration: 0.4,
    ease: "power2.in"
  }, 3.5);

  // 3. Sortie et Redirection vers le système solaire
  tl.to(container, {
    opacity: 0,
    duration: 0.8,
    onComplete: () => {
      driveSound.pause();
      driveSound.currentTime = 0; // Remet à zéro pour la prochaine fois
      window.location = 'system-solar';
    }
  }, 4.0);
};

V.init = function() {
  V.rootPage = htmlToDOM(template);
  
  const startButton = V.rootPage.querySelector('#start-button');
  const startScreen = V.rootPage.querySelector('.start-screen');
  const loadingOverlay = V.rootPage.querySelector('.loading-overlay');
  
  // Démarrer l'animation du canvas directement
  const canvas = V.rootPage.querySelector('#hyperspace-canvas');
  C.animateHyperspaceStars(canvas);
  
  // Attendre le clic utilisateur
  startButton.addEventListener('click', () => {
    // Cacher l'écran de démarrage
    gsap.to(startScreen, {
      opacity: 0,
      duration: 0.5,
      onComplete: () => startScreen.style.display = 'none'
    });
    
    // Afficher le loading
    loadingOverlay.style.display = 'flex';
    gsap.from(loadingOverlay, { opacity: 0, duration: 0.5 });
    
    // Lancer la séquence avec audio
    requestAnimationFrame(() => {
      C.playHyperspaceSequence(V.rootPage);
    });
  });
  
  return V.rootPage;
}

export function loadingPage() {
  return V.init();
}