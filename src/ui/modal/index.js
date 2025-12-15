import { htmlToDOM, genericRenderer } from "@/lib/utils.js";
import template from "./template.html?raw";


class ModalView {

  constructor() {
    this.root = htmlToDOM(template);
    this.setupSliderListener();
  }

  setupSliderListener() {
    const slider = this.root.querySelector('.custom-slider');
    const circularProgress = this.root.querySelector('.circular-progress');
    const progressValue = this.root.querySelector('.progress-value');
    let statut = this.root.querySelector('.meta-status');

    if (slider && circularProgress && progressValue) {
      // Initial value
      this.updateProgress(slider.value, circularProgress, slider, progressValue, statut);
      this.updateStatus(slider.value, statut);
      // Listen to changes
      slider.addEventListener('input', (e) => {
        this.updateProgress(e.target.value, circularProgress, slider, progressValue, statut);
        this.updateStatus(e.target.value, statut);
      });
    }
  }

  updateProgress(value, circularProgress, slider, progressValue, statut) {
    // Update the CSS variable for the circular progress
    circularProgress.style.setProperty('--percent', value);
    slider.style.setProperty('--slider-percent', `${value}%`);
    // Update the text display
    progressValue.textContent = `${value}%`;
    this.updateStatus(value, statut);

  }

  updateStatus(value, statut) {
    if (value < 33) {
      statut.textContent = "STATUS: BEGINNER";
    } else if (value < 66) {
      statut.textContent = "STATUS: INTERMEDIATE";
    } else if (value >= 100) {
      statut.textContent = "STATUS: FULLY ACQUIRED";
    } else {
      statut.textContent = "STATUS: ADVANCED";
    }
  }

  addLocalStorageListener(key, element) {
    let storedValue = localStorage.getItem(key);
    if (storedValue !== null) {
      element.value = storedValue;
      this.updateProgress(storedValue, this.root.querySelector('.circular-progress'), element, this.root.querySelector('.progress-value'), this.root.querySelector('.meta-status'));
    }
    element.addEventListener('input', (e) => {
      localStorage.setItem(key, e.target.value);
    });
  }

    html(data) {
      return genericRenderer(template, data);
    }

    dom(data) {
      const element = htmlToDOM(genericRenderer(template, data));
      let numberAC = element.querySelector('.title').textContent;
      let buttons = element.querySelectorAll('.btn');
      console.log(buttons);
      for (let btn of buttons) {
        console.log('c ici que ça bug');
        
        if (btn.textContent.includes('Sauvegarder')) {
          btn.addEventListener('click', () => {
            this.addLocalStorageListener(numberAC , element.querySelector('.custom-slider'));
          });
        }else if (btn.textContent === 'Annuler') {
          btn.addEventListener('click', () => {
            console.log('Secondary button clicked');
          });
      }  }
      this.addLocalStorageListener(numberAC, element.querySelector('.custom-slider'));
      const slider = element.querySelector('.custom-slider');
      const circularProgress = element.querySelector('.circular-progress');
      const progressValue = element.querySelector('.progress-value');
      let statut = element.querySelector('.meta-status');

      if (slider && circularProgress && progressValue) {
        this.updateProgress(slider.value, circularProgress, slider, progressValue, statut);
        this.updateStatus(slider.value, statut);
        slider.addEventListener('input', (e) => {
          this.updateProgress(e.target.value, circularProgress, slider, progressValue, statut);
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
}

export { ModalView };