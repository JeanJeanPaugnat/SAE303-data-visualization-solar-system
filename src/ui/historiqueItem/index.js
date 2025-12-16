import { htmlToDOM  } from "../../lib/utils.js";
import template from "./template.html?raw";

// HeaderView est un composant statique
// on ne fait que charger le template HTML
// en donnant la possibilité de l'avoir sous forme html ou bien de dom
class HistoriqueItemView {
    constructor() {
        this.root = htmlToDOM(template);
    } 

  html() {
    return template;
  }

  dom(data) {
    const element = htmlToDOM(template);
    const date = element.querySelector('.history-date');
    const score = element.querySelector('.history-score');
    const evolution = element.querySelector('.history-trend');

    if (data) {
        // Format date to be more readable, e.g., "14 OCT 2024"
        const dateObj = new Date(data.date);
        date.textContent = dateObj.toLocaleDateString('fr-FR', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase();
        
        score.textContent = `${data.percentage}%`;
        
        // Hide evolution for now
        evolution.style.display = 'none';
    }
    
    return element;
  }
};

export { HistoriqueItemView };
