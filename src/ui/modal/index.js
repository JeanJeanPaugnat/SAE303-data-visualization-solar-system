import { htmlToDOM, genericRenderer } from "@/lib/utils.js";
import template from "./template.html?raw";
import { gsap } from "gsap";
import { Animation } from "@/lib/animation.js";

class ModalView {

  constructor() {
    this.cardElement = null;
  }

  dom(starData) {
    const element = htmlToDOM(genericRenderer(template, starData));
    this.cardElement = element;

    // --- SETUP DES ÉLÉMENTS (Slider, etc.) ---
    const slider = this.cardElement.querySelector('.custom-slider');
    if (slider) {
        slider.addEventListener('input', (e) => {
            this.setProgress(e.target.value);
        });
    }
    
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.appendChild(element);

    // Ajout d'un élément pour l'effet de flash global sur la carte
    const flashOverlay = document.createElement('div');
    flashOverlay.className = 'flash-effect';
    this.cardElement.appendChild(flashOverlay);

    // --- ANIMATION D'OUVERTURE STYLE ANIMUS ---
    // On utilise un petit setTimeout pour laisser le DOM s'insérer
    setTimeout(() => {
        Animation.animusReveal(this.cardElement);
    }, 50);

    // --- GESTION DU BOUTON SAUVEGARDER (avec animation) ---
    const saveBtn = this.cardElement.querySelector('.btn-primary');
    if (saveBtn) {
        const originalContent = saveBtn.innerHTML;
        
        // On stocke le listener pour pouvoir le retirer plus tard si besoin
        const saveClickListener = (e) => {
            e.preventDefault(); // Empêcher le comportement par défaut

            // Création d'une timeline GSAP pour séquencer les effets
            const tl = gsap.timeline();

            // --- SÉQUENCE D'ANIMATION ---
            // 1. "Compression"
            tl.to(saveBtn, {
                scale: 0.9,
                backgroundColor: "#fff",
                duration: 0.1,
                ease: "power2.in"
            });

            // 2. "Transmission & Succès"
            tl.to(saveBtn, {
                scale: 1.05,
                backgroundColor: "#00ff9d",
                color: "#050e18",
                boxShadow: "0 0 30px rgba(0, 255, 157, 0.6)",
                duration: 0.25,
                ease: "back.out(1.7)",
                onStart: () => {
                    saveBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg> Sauvegardé !`;
                    saveBtn.classList.add('success');
                }

            });

            // 3. "Feedback Global"
            tl.to(flashOverlay, {
                opacity: 0.3,
                yoyo: true,
                repeat: 1,
                ease: "power2.inOut"
            }, "-=0.2");

            // 4. "Retour au calme" - reste en état "Succès" définitif
            tl.to(saveBtn, {
                scale: 1,
                color: "#050e18",
                boxShadow: "none",
                ease: "power2.inOut",
                onComplete: () => {
                    // Affiche "Succès" et garde la couleur verte définitivement
                    saveBtn.innerHTML = 'Succès';
                }
            });
        };

        // On attache le listener pour la première fois
        // { once: true } assure qu'il ne se déclenche qu'une fois, puis est retiré.
        saveBtn.addEventListener('click', saveClickListener, { once: true });
    }

    // --- GESTION OVERLAY ET FERMETURE ---
    const handleClose = () => {
        Animation.animusHide(this.cardElement, 0.5, () => {
            overlay.remove();
        });
    };

    overlay.addEventListener('click', e => {
      if (e.target === overlay) {
        handleClose();
      }
    });

    const closeBtn = element.querySelector('.close-btn');
    if(closeBtn) {
      closeBtn.addEventListener('click', handleClose);
    }
    
    let annulerBtn = element.querySelector('.btn-secondary');
    if(annulerBtn) {
      annulerBtn.addEventListener('click', handleClose);
    }

    return overlay;
  }

  setHistorique(historique) {
    if (!this.cardElement) {
      console.error("L'élément du modal n'a pas été initialisé.");
      return;
    }
    const historiqueList = this.cardElement.querySelector('.historique-list');
    // Logique à implémenter ici
  }

  setProgress(percentage) {
    if (!this.cardElement) {
      console.error("L'élément du modal n'a pas été initialisé.");
      return;
    }

    const progressSlider = this.cardElement.querySelector('.custom-slider');
    const progressValueText = this.cardElement.querySelector('.progress-value');
    const circularProgress = this.cardElement.querySelector('.circular-progress');
    const statut = this.cardElement.querySelector('.meta-status');

    if (!progressSlider || !progressValueText || !circularProgress || !statut) {
        console.error("Un des éléments de progression du modal est introuvable.");
        return;
    }

    const clampedPercentage = Math.max(0, Math.min(100, percentage));

    progressSlider.value = clampedPercentage;
    progressValueText.textContent = `${clampedPercentage}%`;
    circularProgress.style.setProperty('--percent', clampedPercentage);
    progressSlider.style.setProperty('--slider-percent', `${clampedPercentage}%`);

    if (clampedPercentage < 33) {
      statut.textContent = "STATUS: BEGINNER";
    } else if (clampedPercentage < 66) {
      statut.textContent = "STATUS: INTERMEDIATE";
    } else if (clampedPercentage >= 100) {
      statut.textContent = "STATUS: FULLY ACQUIRED";
    } else {
      statut.textContent = "STATUS: ADVANCED";
    }
  }
}

export { ModalView };