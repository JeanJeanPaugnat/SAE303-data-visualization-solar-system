import { htmlToDOM, genericRenderer } from "@/lib/utils.js";
import template from "./template.html?raw";


export class ModalView {


  constructor() {
    this.cardElement = null;
  }

  dom(starData) {
    const element = htmlToDOM(genericRenderer(template, starData));
    this.cardElement = element;

    const slider = this.cardElement.querySelector('.custom-slider');
    if (slider) {
        slider.addEventListener('input', (e) => {
            this.setProgress(e.target.value);
        });
    }
    
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';
    overlay.appendChild(element);

    overlay.addEventListener('click', e => {
      if (e.target === overlay) {
        overlay.remove();
      }
    });

    const closeBtn = element.querySelector('.close-btn');
    if(closeBtn) {
      closeBtn.addEventListener('click', () => {
        overlay.remove();
      });
    }

    return overlay;
  }

  setHistorique(historique) {
    if (!this.cardElement) {
      console.error("L'élément du modal n'a pas été initialisé.");
      return;
    }
    const historiqueList = this.cardElement.querySelector('.historique-list');
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