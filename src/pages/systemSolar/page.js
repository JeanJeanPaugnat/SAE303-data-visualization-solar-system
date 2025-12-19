
//template
import template from "./template.html?raw";

//lib
import { setupPanZoom } from "@/lib/draggableCanvas.js";
import { Animation } from "@/lib/animation.js";
import { htmlToDOM } from "@/lib/utils.js";

//ui
import { SolarSystemView } from "@/ui/solar-system";

import { ModalView } from "@/ui/modal";
import { featuresView } from "@/ui/features/index.js";
import { pausePlayBtnView } from "@/ui/playPauseBtn/index.js";
import { hoverTextView } from "@/ui/hoverText/index.js";
import { HistoriqueItemView } from "@/ui/historiqueItem/index.js";
import { HeadeskillsSideBarView } from "@/ui/skillsSideBar";

//data
import { Star } from "@/data/searchingStar.js";
import { UserData } from '@/data/userData.js';





let C = {};

let animationState = {
    isPlaying: true,
    animations: [] // Stocke les animations motionPath
};

let tooltipInstance = null; // Garder une seule instance du tooltip

C.init = function() {
  return V.init();
}

C.togglePausePlay = function() {
    if (animationState.isPlaying) {
        animationState.animations.forEach(anim => {
            anim.pause();
        });
        animationState.isPlaying = false;
    } else {
        animationState.animations.forEach(anim => {
            anim.play();
        });
        animationState.isPlaying = true;
    }
    C.updateButtonIcon();
}

C.hoverOnStar = async function(event) {
    let starElement = event.currentTarget;

    let starData = await Star.getStarDataById(starElement.dataset.acs);
    
    let userData = UserData.user;
    let acquisition = userData.acquisitions[starData.code];
    let percentage = acquisition ? acquisition.percentage : 0;
    let tooltipContainer = document.getElementById('tooltip-container');
    
    if (!tooltipInstance) {
        tooltipInstance = new hoverTextView();
        tooltipContainer.appendChild(tooltipInstance.dom(starData.code, `${percentage}%`));
    } else {
        let codeACText = tooltipContainer.querySelector(".codeACText");
        let percentageAcquisition = tooltipContainer.querySelector(".percentageAcquisition");
        if(codeACText) codeACText.textContent = starData.code;
        if(percentageAcquisition) percentageAcquisition.textContent = `${percentage}%`;
    }
    
    tooltipContainer.style.display = 'block';

    let updateTooltipPosition = (e) => {
        tooltipContainer.style.left = `${e.clientX + 10}px`;
        tooltipContainer.style.top = `${e.clientY + 10}px`;
    };

    starElement._updateTooltipPosition = updateTooltipPosition;
    document.addEventListener('mousemove', starElement._updateTooltipPosition);
}

C.hoverOutStar = function(event) {
    let starElement = event.currentTarget;
    let tooltipContainer = document.getElementById('tooltip-container');
    tooltipContainer.style.display = 'none';

    if (starElement._updateTooltipPosition) {
        document.removeEventListener('mousemove', starElement._updateTooltipPosition);
    }
}

C.updateButtonIcon = function() {
    let pauseIcon = document.getElementById('pauseIcon');
    let playIcon = document.getElementById('playIcon');
    
    if (animationState.isPlaying) {
        pauseIcon.style.display = 'block';
        playIcon.style.display = 'none';
    } else {
        pauseIcon.style.display = 'none';
        playIcon.style.display = 'block';
    }
}


C.handler_clickStar = async function(event) {
    let starData = await Star.getStarDataById(event.currentTarget.dataset.acs);
    let acId = starData.code;

    let modal = new ModalView();
    let mainContainer = document.querySelector('#mainContainer');
    
    // Supprime old modal si il existe
    let existingModal = mainContainer.querySelector('.modal-overlay');
    if (existingModal) {
        existingModal.remove();
    }

    // Créer et ajouter newmodal
    let modalElement = modal.dom(starData);
    document.body.appendChild(modalElement);
    
    // Charger les données utilisateur
    let userData = UserData.user;

    // Gérer l'affichage de l'historique
    let historyForAc = userData.history.filter(item => item.ac === acId);
    let historySection = modalElement.querySelector('.history-section');

    if (historyForAc.length > 0) {
        historySection.style.display = 'block';
        let historyList = historySection.querySelector('.history-list');
        historyList.innerHTML = ''; // Clear previous items
        historyForAc.forEach(historyItemData => {
            let historiqueItem = new HistoriqueItemView();
            historyList.appendChild(historiqueItem.dom(historyItemData));
        });
    } else {
        historySection.style.display = 'none';
    }
    
    let currentAcquisition = userData.acquisitions[acId];
    let percentage = currentAcquisition ? currentAcquisition.percentage : 0;
    modal.setProgress(percentage);

    // Appliquer la couleur
    if (modal.cardElement && starData.color) {
        modal.cardElement.style.setProperty('--primary-color', starData.color);
    }
    
    // Écouteur d'événement pour le bouton de sauvegarde
    let saveButton = modal.cardElement.querySelector('.actions .btn-primary');
    if (saveButton) {
        saveButton.addEventListener('click', () => {
            let progressSlider = modal.cardElement.querySelector('.custom-slider');
            let newPercentage = parseInt(progressSlider.value, 10);
            UserData.updateAcquisition(acId, newPercentage);
            // Mettre à jour l'affichage visuel de l'étoile et de la planète de niveau
            V.solarSystem.updateStarProgress(acId, newPercentage);
            let userData = UserData.load();
            V.solarSystem.updateAllLevelPlanetsProgress(userData);
        });
    }
}

C.resetLocalStorage = function() {
    localStorage.removeItem('studentData');
    console.log("Local storage cleared.");
    window.location.reload();
}

C.clickExportData = function() {
    UserData.export();
}

C.importData = function() {
    let inputElement = document.createElement('input');
    inputElement.type = 'file';
    inputElement.accept = '.json,application/json';
    
    inputElement.addEventListener('change', (event) => {
        let file = event.target.files[0];
        if (!file) {
            console.log('Aucun fichier sélectionné');
            return;
        }
        
        let reader = new FileReader();
        
        reader.onload = (e) => {
            try {
                let fileContent = e.target.result;
                UserData.import(fileContent);
                console.log('Données importées avec succès');
                // Recharger la page pour afficher les nouvelles données
                window.location.reload();
            } catch (error) {
                console.error('Erreur lors de l\'import:', error);
                alert('Erreur lors de l\'import du fichier. Vérifiez le format JSON.');
            }
        };
        
        reader.onerror = () => {
            console.error('Erreur lors de la lecture du fichier');
            alert('Erreur lors de la lecture du fichier');
        };
        
        reader.readAsText(file);
    });
    
    inputElement.click();
}


        

let V = {
  rootPage: null,
    solarSystem: null
};

V.init = function() {

  V.rootPage = htmlToDOM(template);
  V.solarSystem = new SolarSystemView();

  V.rootPage.querySelector('slot[name="svg"]').replaceWith( V.solarSystem.dom() );
  V.rootPage.appendChild( new HeadeskillsSideBarView().dom(V.rootPage) );
            
    V.rootPage.appendChild( new featuresView().dom() );
    V.rootPage.appendChild( new pausePlayBtnView().dom() );
  
  // Mettre à jour l'affichage visuel des étoiles et planètes selon les données utilisateur
  let userData = UserData.load();
  V.solarSystem.updateAllStarsProgress(userData);
  V.solarSystem.updateAllLevelPlanetsProgress(userData);
  
  V.attachEvents(V.rootPage, V.solarSystem);
  return V.rootPage;
};



V.attachEvents = function(rootPage, solarSystem) {
    
    Animation.rotateSolarSystem(solarSystem, animationState);
    let resetStorageBtn = rootPage.querySelector('#resetStorageBtn');
    resetStorageBtn.addEventListener('click', C.resetLocalStorage);
    // Setup pause/play button
    let pausePlayBtn = rootPage.querySelector('#pausePlayBtn');
    pausePlayBtn.addEventListener('click', C.togglePausePlay);
    let btnExportData = rootPage.querySelector('#exportDataBtn');
    btnExportData.addEventListener('click', C.clickExportData);
    let btnImportData = rootPage.querySelector('#importDataBtn');
    btnImportData.addEventListener('click', C.importData);
    solarSystem.addAllStarsClickListener(C.handler_clickStar);
    solarSystem.addAllStarsHoverListener(C.hoverOnStar, C.hoverOutStar);
    
    // Écouter les changements de données utilisateur pour mettre à jour l'affichage
    window.addEventListener('userDataChanged', (event) => {
        solarSystem.updateAllStarsProgress(event.detail);
        solarSystem.updateAllLevelPlanetsProgress(event.detail);
    });
    
    setupPanZoom(rootPage, solarSystem);
}


export function systemSolar() {
  return C.init();
}