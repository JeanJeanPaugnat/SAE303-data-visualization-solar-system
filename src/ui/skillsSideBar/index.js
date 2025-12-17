import { htmlToDOM } from "../../lib/utils.js";
import template from "./template.html?raw";
import { UserData } from '@/data/userData.js';

class HeadeskillsSideBarView {
  constructor() {
    this.root = htmlToDOM(template);
    this.totalACsByCompetence = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    window.addEventListener('userDataChanged', () => {
      this.updateSkillsPercentages();
    });
  }

  static getTotalACsByCompetence(rootPage) {
    let totalACs = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    let svgContainer = rootPage.querySelector('#svgContainer');
    
    if (!svgContainer) return totalACs;
    
    let allAcStars = svgContainer.querySelectorAll('.acStar[data-acs]');
    
    allAcStars.forEach(star => {
      let acCode = star.getAttribute('data-acs');
      if (acCode) {
        let competenceNumber = parseInt(acCode.charAt(3), 10);
        if (competenceNumber >= 1 && competenceNumber <= 5) {
          totalACs[competenceNumber]++;
        }
      }
    });
    
    return totalACs;
  }

  calculateCompetencesPercentages() {
    let userData = UserData.load();
    let competenceSums = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    for (let [acCode, acquisition] of Object.entries(userData.acquisitions)) {
      if (acCode.length >= 4) {
        let competenceNumber = parseInt(acCode.charAt(3), 10);
        if (competenceNumber >= 1 && competenceNumber <= 5) {
          competenceSums[competenceNumber] += acquisition.percentage;
        }
      }
    }

    let competencesAverages = {};
    for (let i = 1; i <= 5; i++) {
      let totalACs = this.totalACsByCompetence[i] || 0;
      let average = totalACs > 0 ? Math.round(competenceSums[i] / totalACs) : 0;
      competencesAverages[i] = average;
    }

    return competencesAverages;
  }

  updateSkillsPercentages() {
    let averages = this.calculateCompetencesPercentages();
    
    for (let i = 1; i <= 5; i++) {
      let skillCard = this.root.querySelector(`.skill-card[data-id="${i}"]`);
      if (skillCard) {
        let percentageElement = skillCard.querySelector('.percentage');
        if (percentageElement) {
          percentageElement.textContent = `${averages[i] || 0}%`;
        }
      }
    }
  }

  html() {
    return template;
  }
  
  dom(rootPage) {
    if (rootPage) {
      this.totalACsByCompetence = HeadeskillsSideBarView.getTotalACsByCompetence(rootPage);
    }
    
    this.updateSkillsPercentages();
    
    return this.root;
  }
}

export { HeadeskillsSideBarView };


