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

  /**
   * Met à jour l'affichage visuel d'une étoile selon son pourcentage de déploiement
   * @param {string} acId - L'identifiant de l'AC (ex: "AC15.01")
   * @param {number} percentage - Le pourcentage entre 0 et 100
   */
  updateStarProgress(acId, percentage) {
    const stars = this.getStars();
    stars.forEach(star => {
      const starAcId = star.getAttribute('data-acs');
      if (starAcId === acId) {
        // Arrondir à la dizaine la plus proche pour correspondre aux classes CSS
        const roundedPercentage = Math.round(percentage / 10) * 10;
        star.setAttribute('data-percentage', roundedPercentage);
      }
    });
  }

  /**
   * Met à jour toutes les étoiles en fonction des données utilisateur
   * @param {Object} userData - Les données utilisateur contenant les acquisitions
   */
  updateAllStarsProgress(userData) {
    if (!userData || !userData.acquisitions) return;
    
    Object.keys(userData.acquisitions).forEach(acId => {
      const acquisition = userData.acquisitions[acId];
      this.updateStarProgress(acId, acquisition.percentage || 0);
    });
  }

  /**
   * Met à jour l'affichage visuel d'une planète de niveau selon le pourcentage moyen des AC du niveau
   * @param {string} levelId - L'identifiant de la planète de niveau (ex: "skill-entreprendre-level1-center")
   * @param {number} percentage - Le pourcentage moyen entre 0 et 100
   */
  updateLevelPlanetProgress(levelId, percentage) {
    const planet = this.root.querySelector(`#${levelId}`);
    if (planet) {
      const roundedPercentage = Math.round(percentage / 10) * 10;
      planet.setAttribute('data-level-percentage', roundedPercentage);
    }
  }

  /**
   * Calcule et met à jour toutes les planètes de niveau en fonction des données utilisateur
   */
  updateAllLevelPlanetsProgress(userData) {
    if (!userData || !userData.acquisitions) return;

    // Trouver toutes les planètes de niveau
    const levelPlanets = this.root.querySelectorAll('[id$="-center"]');
    
    levelPlanets.forEach(planet => {
      const planetId = planet.id;
      
      // Extraire l'info du niveau (ex: "skill-entreprendre-level1-center" -> "skill-entreprendre-level1")
      const levelPrefix = planetId.replace('-center', '');
      
      // Trouver toutes les étoiles AC de ce niveau
      const levelStars = this.root.querySelectorAll(`[id^="${levelPrefix}-ac"]`);
      
      if (levelStars.length === 0) return;
      
      // Calculer le pourcentage moyen des AC de ce niveau
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

  /**
   * Met à jour les planètes principales des skills avec le pourcentage moyen de tous leurs niveaux
   */
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