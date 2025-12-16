import { htmlToDOM  } from "../../lib/utils.js";
import template from "./template.html?raw";

// HeaderView est un composant statique
// on ne fait que charger le template HTML
// en donnant la possibilité de l'avoir sous forme html ou bien de dom
class hoverTextView {
  constructor() {
    this.root = htmlToDOM(template);
  } 

    html() {
    return template;
  } 
    dom(code, percentage) {
    let codeACText = this.root.querySelector(".codeACText");
    let percentageAcquisition = this.root.querySelector(".percentageAcquisition");
    codeACText.textContent = code;
    percentageAcquisition.textContent = percentage;
    return this.root;
  }

};

export { hoverTextView };