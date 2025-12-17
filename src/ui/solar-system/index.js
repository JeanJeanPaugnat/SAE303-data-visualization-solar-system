import { htmlToDOM } from "@/lib/utils.js";
import template from "./template.html?raw";

class SolarSystemView {

  constructor() {
    this.root = htmlToDOM(template);
  }

  html() {
    return template;
  }

  dom() {
    return this.root;
  }

  getMainPath() {
    return this.root.querySelector('[id="orbit-main"]');

  }
  getElements() {
    return this.root.querySelectorAll('[data-name="skills"]');

  }
  getStars() {
    return this.root.querySelectorAll('[id$="-ac1"], [id$="-ac2"], [id$="-ac3"], [id$="-ac4"], [id$="-ac5"], [id$="-ac6"], [id$="-ac7"]');
  }

  getStarById(id) {
    return this.root.querySelector(`#${id}`);
  }

  addStarClickListener(starId, callback) {

    const star = this.getStarById(starId);
    if (star) {
      star.addEventListener('click', callback);
      star.style.cursor = 'pointer';
    }
  }

  addAllStarsHoverListener(hoverCallback, outCallback) {
    const stars = this.getStars();
    stars.forEach(star => {
      star.addEventListener('mouseenter', hoverCallback);
      star.addEventListener('mouseleave', outCallback);
      star.style.cursor = 'pointer';
    });
  }

  addAllStarsClickListener(callback) {
    const stars = this.getStars();
    stars.forEach(star => {
      star.addEventListener('click', callback);
      star.style.cursor = 'pointer';
    });
  }
}
export { SolarSystemView };