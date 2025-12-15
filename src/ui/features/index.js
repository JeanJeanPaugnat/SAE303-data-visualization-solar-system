import { htmlToDOM  } from "../../lib/utils.js";
import template from "./template.html?raw";

// HeaderView est un composant statique
// on ne fait que charger le template HTML
// en donnant la possibilité de l'avoir sous forme html ou bien de dom
class featuresView {
  constructor() {
    this.root = htmlToDOM(template);
  } 
    html() {
    return template;
  } 
    dom() {
    return this.root;
  }

};

export { featuresView };