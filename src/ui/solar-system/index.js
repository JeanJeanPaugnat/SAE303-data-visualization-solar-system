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
    // Retourne toutes les étoiles (les cercles avec la classe fill)
    return this.root.querySelectorAll('[id$="-ac1"], [id$="-ac2"], [id$="-ac3"], [id$="-ac4"], [id$="-ac5"], [id$="-ac6"], [id$="-ac7"]');
  }

  getStarById(id) {
    // Cible une étoile spécifique par ID
    return this.root.querySelector(`#${id}`);
  }

  addStarClickListener(starId, callback) {
    // Ajoute un listener de click sur une étoile
    const star = this.getStarById(starId);
    if (star) {
      star.addEventListener('click', callback);
      star.style.cursor = 'pointer'; // Change le curseur pour montrer que c'est cliquable
    }
  }

  addAllStarsClickListener(callback) {
    // Ajoute un listener de click sur toutes les étoiles
    const stars = this.getStars();
    stars.forEach(star => {
      star.addEventListener('click', callback);
      star.style.cursor = 'pointer';
    });
  }
}
export { SolarSystemView };