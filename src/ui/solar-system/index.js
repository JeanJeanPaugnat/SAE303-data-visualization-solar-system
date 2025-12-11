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
  
  
}
export { SolarSystemView };