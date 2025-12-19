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


  updateStarProgress(acId, percentage) {
    const stars = this.getStars();
    stars.forEach(star => {
      const starAcId = star.getAttribute('data-acs');
      if (starAcId === acId) {
        const roundedPercentage = Math.round(percentage / 10) * 10;
        star.setAttribute('data-percentage', roundedPercentage);
      }
    });
  }

  updateAllStarsProgress(userData) {
    if (!userData || !userData.acquisitions) return;
    
    Object.keys(userData.acquisitions).forEach(acId => {
      const acquisition = userData.acquisitions[acId];
      this.updateStarProgress(acId, acquisition.percentage || 0);
    });
  }

  updateLevelPlanetProgress(levelId, percentage) {
    const planet = this.root.querySelector(`#${levelId}`);
    if (planet) {
      const roundedPercentage = Math.round(percentage / 10) * 10;
      planet.setAttribute('data-level-percentage', roundedPercentage);
    }
  }


  updateAllLevelPlanetsProgress(userData) {
    if (!userData || !userData.acquisitions) return;

    const levelPlanets = this.root.querySelectorAll('[id$="-center"]');
    
    levelPlanets.forEach(planet => {
      const planetId = planet.id;
      const levelPrefix = planetId.replace('-center', '');
      const levelStars = this.root.querySelectorAll(`[id^="${levelPrefix}-ac"]`);
      
      if (levelStars.length === 0) return;
      
      let totalPercentage = 0;
      let validAcCount = 0;
      
      levelStars.forEach(star => {
        const acId = star.getAttribute('data-acs');
        if (acId && userData.acquisitions[acId]) {
          totalPercentage += userData.acquisitions[acId].percentage || 0;
          validAcCount++;
        }
      });
      
      const averagePercentage = validAcCount > 0 ? totalPercentage / validAcCount : 0;
      this.updateLevelPlanetProgress(planetId, averagePercentage);
    });

    // Mettre à jour les planètes principales de skills (pour l'animation de pulse)
    this.updateSkillPlanetsProgress(userData);
  }


  updateSkillPlanetsProgress(userData) {
    if (!userData || !userData.acquisitions) return;

    const skills = ['entreprendre', 'exprimer', 'developper', 'comprendre', 'concevoir'];
    
    skills.forEach(skillName => {
      const skillPlanet = this.root.querySelector(`#skill-${skillName}-planet`);
      if (!skillPlanet) return;

      // Trouver tous les centres de niveaux de ce skill
      const levelCenters = this.root.querySelectorAll(`[id^="skill-${skillName}-level"][id$="-center"]`);
      
      if (levelCenters.length === 0) return;

      // Calculer le pourcentage moyen de tous les niveaux
      let totalPercentage = 0;
      let levelCount = 0;

      levelCenters.forEach(levelCenter => {
        const levelPrefix = levelCenter.id.replace('-center', '');
        const levelStars = this.root.querySelectorAll(`[id^="${levelPrefix}-ac"]`);
        
        if (levelStars.length === 0) return;

        let levelTotal = 0;
        let validAcCount = 0;

        levelStars.forEach(star => {
          const acId = star.getAttribute('data-acs');
          if (acId && userData.acquisitions[acId]) {
            levelTotal += userData.acquisitions[acId].percentage || 0;
            validAcCount++;
          }
        });

        if (validAcCount > 0) {
          totalPercentage += levelTotal / validAcCount;
          levelCount++;
        }
      });

      const skillAveragePercentage = levelCount > 0 ? totalPercentage / levelCount : 0;
      const roundedPercentage = Math.round(skillAveragePercentage / 10) * 10;
      skillPlanet.setAttribute('data-level-percentage', roundedPercentage);
    });
  }
}
export { SolarSystemView };