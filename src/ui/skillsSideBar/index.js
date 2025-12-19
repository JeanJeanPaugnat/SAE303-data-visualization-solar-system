import { htmlToDOM } from "../../lib/utils.js";
import template from "./template.html?raw";
import { UserData } from "@/data/userData.js";

class HeadeskillsSideBarView {
  constructor() {
    this.root = htmlToDOM(template);
    this.totalACsByCompetence = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    window.addEventListener('userDataChanged', () => {
      this.updateSkillsPercentages();
    });
  }

  static getTotalACsByCompetence(rootPage) {
    const totalACs = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    const svgContainer = rootPage.querySelector('#svgContainer');

    if (!svgContainer) return totalACs;

    const allAcStars = svgContainer.querySelectorAll('.acStar[data-acs]');

    allAcStars.forEach((star) => {
      const acCode = star.getAttribute('data-acs');
      if (!acCode) return;

      const competenceNumber = parseInt(acCode.charAt(3), 10);
      if (competenceNumber >= 1 && competenceNumber <= 5) {
        totalACs[competenceNumber]++;
      }
    });

    return totalACs;
  }

  calculateCompetencesPercentages() {
    const userData = UserData.load();
    const competenceSums = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

    for (const [acCode, acquisition] of Object.entries(userData.acquisitions)) {
      if (acCode.length < 4) continue;

      const competenceNumber = parseInt(acCode.charAt(3), 10);
      if (competenceNumber >= 1 && competenceNumber <= 5) {
        competenceSums[competenceNumber] += acquisition.percentage;
      }
    }

    const competencesAverages = {};
    for (let i = 1; i <= 5; i++) {
      const totalACs = this.totalACsByCompetence[i] || 0;
      const average = totalACs > 0 ? Math.round(competenceSums[i] / totalACs) : 0;
      competencesAverages[i] = average;
    }

    return competencesAverages;
  }

  updateSkillsPercentages() {
    const averages = this.calculateCompetencesPercentages();
    
    for (let i = 1; i <= 5; i++) {
      const skillCard = this.root.querySelector(`.skill-card[data-id="${i}"]`);
      if (!skillCard) continue;

      const percentageElement = skillCard.querySelector('.percentage');
      if (percentageElement) {
        percentageElement.textContent = `${averages[i] || 0}%`;
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


