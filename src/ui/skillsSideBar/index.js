import { htmlToDOM  } from "../../lib/utils.js";
import template from "./template.html?raw";
import { UserData } from '@/data/userData.js';

// HeaderView est un composant statique
// on ne fait que charger le template HTML
// en donnant la possibilité de l'avoir sous forme html ou bien de dom
class HeadeskillsSideBarView {
  constructor() {
    this.root = htmlToDOM(template);
    this.totalACsByCompetence = this.countTotalACsByCompetence();
    
    // Écouter les changements de données utilisateur
    window.addEventListener('userDataChanged', () => {
      this.updateSkillsPercentages();
    });
  }

  /**
   * Méthode statique pour compter les AC par compétence depuis le DOM
   * Retourne un objet avec le total d'AC pour chaque compétence
   * Ex: { 1: 7, 2: 6, 3: 4, 4: 8, 5: 6 }
   */
  static getTotalACsByCompetence(rootPage) {
    const totalACs = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    
    const svgContainer = rootPage.querySelector('#svgContainer');
    if (!svgContainer) {
      console.warn('SVG container not found');
      return totalACs;
    }
    
    const allAcStars = svgContainer.querySelectorAll('.acStar[data-acs]');
    
    allAcStars.forEach(star => {
      const acCode = star.getAttribute('data-acs');
      // Extraire le numéro de compétence (position 3 dans le code AC)
      // Ex: AC15.01 → charAt(3) = '5'
      if (acCode && acCode.length >= 4) {
        const competenceNumber = parseInt(acCode.charAt(3), 10);
        if (competenceNumber >= 1 && competenceNumber <= 5) {
          totalACs[competenceNumber]++;
        }
      }
    });
    
    console.log('Total ACs par compétence:', totalACs);
    return totalACs;
  } 

  /**
   * Compte le nombre total d'AC existants pour chaque compétence dans le SVG
   * en comptant tous les éléments .acStar avec data-acs
   */
  countTotalACsByCompetence() {
    const totalACs = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    
    // Récupérer tous les éléments AC depuis le document
    const svgContainer = document.querySelector('#svgContainer');
    console.log(document.querySelectorAll('.acStar'));
    if (!svgContainer) {
      // Si le SVG n'est pas encore chargé, retourner des valeurs par défaut
      return totalACs;
    }
    
    const allAcStars = svgContainer.querySelectorAll('.acStar[data-acs]');
    console.log(allAcStars);
    allAcStars.forEach(star => {
      const acCode = star.getAttribute('data-acs');
      const competenceNumber = this.extractCompetenceNumber(acCode);
      
      if (competenceNumber !== null && totalACs[competenceNumber] !== undefined) {
        totalACs[competenceNumber]++;
      }
    });
    
    return totalACs;
  }

  /**
   * Extrait le numéro de compétence depuis le code AC
   * Ex: AC1305 → 3, AC1201 → 2, AC2405 → 4
   */
  extractCompetenceNumber(acCode) {
    // Le format est ACXYZZ où Y est le numéro de la compétence
    // AC1305 → position 3 = '3'
    if (acCode && acCode.length >= 4) {
      return parseInt(acCode.charAt(3), 10);
    }
    return null;
  }

  /**
   * Calcule les pourcentages moyens d'acquisition pour chaque compétence
   * basé sur TOUS les AC de la compétence (pas seulement ceux avec un pourcentage)
   */
  calculateCompetencesPercentages() {
    const userData = UserData.load();
    const competencesData = {}; // { 1: [75, 80, 60, 0, 0], 2: [50, 70, 0, 0], ... }

    // Initialiser les tableaux pour chaque compétence avec des 0 pour tous les AC
    for (let i = 1; i <= 5; i++) {
      const totalACs = this.totalACsByCompetence[i] || 0;
      competencesData[i] = new Array(totalACs).fill(0);
    }

    // Parcourir toutes les acquisitions et mettre à jour les valeurs
    for (const [acCode, acquisition] of Object.entries(userData.acquisitions)) {
      const competenceNumber = this.extractCompetenceNumber(acCode);
      
      if (competenceNumber !== null && competencesData[competenceNumber]) {
        // On ajoute le pourcentage dans le tableau (remplace un 0 par la vraie valeur)
        // Pour simplifier, on met à jour progressivement le tableau
        const currentData = competencesData[competenceNumber];
        const indexOfZero = currentData.findIndex(val => val === 0);
        if (indexOfZero !== -1) {
          currentData[indexOfZero] = acquisition.percentage;
        } else {
          currentData.push(acquisition.percentage);
        }
      }
    }

    // Calculer les moyennes en incluant les AC sans pourcentage (0%)
    const competencesAverages = {};
    for (const [competenceNumber, percentages] of Object.entries(competencesData)) {
      const totalACs = this.totalACsByCompetence[competenceNumber] || percentages.length;
      const sum = percentages.reduce((acc, val) => acc + val, 0);
      const average = totalACs > 0 ? Math.round(sum / totalACs) : 0;
      competencesAverages[competenceNumber] = average;
    }

    return competencesAverages;
  }

  /**
   * Met à jour visuellement les pourcentages dans la sidebar
   */
  updateSkillsPercentages() {
    const averages = this.calculateCompetencesPercentages();
    
    // Mettre à jour chaque carte de compétence
    for (let i = 1; i <= 5; i++) {
      const skillCard = this.root.querySelector(`.skill-card[data-id="${i}"]`);
      if (skillCard) {
        const percentageElement = skillCard.querySelector('.percentage');
        if (percentageElement) {
          const percentage = averages[i] || 0;
          percentageElement.textContent = `${percentage}%`;
        }
      }
    }
  }
  

  html() {
    return template;
  } 
  
  dom(data, rootPage) {
    // Compter le nombre total d'AC par compétence depuis le rootPage
    if (rootPage) {
      this.totalACsByCompetence = HeadeskillsSideBarView.getTotalACsByCompetence(rootPage);
      console.log('Nombre d\'ACs par compétence:', this.totalACsByCompetence);
    }
    
    // Mettre à jour les pourcentages initiaux
    this.updateSkillsPercentages();
    
    return this.root;
  }

};

export { HeadeskillsSideBarView };


