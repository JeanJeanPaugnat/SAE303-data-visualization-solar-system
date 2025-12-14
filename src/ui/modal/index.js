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

    html(data) {
      return genericRenderer(template, data);
    }

    dom(data) {
      const element = htmlToDOM(genericRenderer(template, data));
      // Setup listeners for the new DOM element
      const slider = element.querySelector('.custom-slider');
      const circularProgress = element.querySelector('.circular-progress');
      const progressValue = element.querySelector('.progress-value');
      let statut = element.querySelector('.meta-status');

      if (slider && circularProgress && progressValue) {
        // Initial value
        this.updateProgress(slider.value, circularProgress, slider, progressValue, statut);
        this.updateStatus(slider.value, statut);
        // Listen to changes
        slider.addEventListener('input', (e) => {
          this.updateProgress(e.target.value, circularProgress, slider, progressValue, statut);
        });
      }

      return element;
    }
}

export { ModalView };