import { SolarSystemView } from "@/ui/solar-system";
import { htmlToDOM } from "@/lib/utils.js";
import template from "./template.html?raw";
import { setupPanZoom } from "./draggableCanvas.js";
import { ModalView } from "@/ui/modal";
import { Star } from "../../data/searchingStar.js";
import { HeadeskillsSideBarView } from "@/ui/skillsSideBar";
import { Animation } from "@/lib/animation.js";
import { featuresView } from "../../ui/features/index.js";
import { loadUserData, updateAcquisition } from '@/data/userData.js';
import { pausePlayBtnView } from "@/ui/playPauseBtn/index.js";
import { hoverTextView } from "@/ui/hoverText/index.js";




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
    const starElement = event.currentTarget;

    let starData = await Star.getStarDataById(starElement.dataset.acs);
    
    const userData = loadUserData();
    const acquisition = userData.acquisitions[starData.code];
    const percentage = acquisition ? acquisition.percentage : 0;
    console.log(percentage);
    const tooltipContainer = document.getElementById('tooltip-container');
    
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

    const updateTooltipPosition = (e) => {
        tooltipContainer.style.left = `${e.clientX + 10}px`;
        tooltipContainer.style.top = `${e.clientY + 10}px`;
    };

    starElement._updateTooltipPosition = updateTooltipPosition;
    document.addEventListener('mousemove', starElement._updateTooltipPosition);
}

C.hoverOutStar = function(event) {
    const starElement = event.currentTarget;
    const tooltipContainer = document.getElementById('tooltip-container');
    tooltipContainer.style.display = 'none';

    if (starElement._updateTooltipPosition) {
        document.removeEventListener('mousemove', starElement._updateTooltipPosition);
    }
}

C.updateButtonIcon = function() {
    const pauseIcon = document.getElementById('pauseIcon');
    const playIcon = document.getElementById('playIcon');
    
    if (animationState.isPlaying) {
        pauseIcon.style.display = 'block';
        playIcon.style.display = 'none';
    } else {
        pauseIcon.style.display = 'none';
        playIcon.style.display = 'block';
    }
}


C.handler_clickStar = async function(event) {
    const starData = await Star.getStarDataById(event.currentTarget.dataset.acs);
    const acId = starData.code;

    const modal = new ModalView();
    const mainContainer = document.querySelector('#mainContainer');
    
    // Supprime old modal si il existe
    const existingModal = mainContainer.querySelector('.modal-overlay');
    if (existingModal) {
        existingModal.remove();
    }

    // Créer et ajouter newmodal
    const modalElement = modal.dom(starData);
    console.log(modalElement);
    document.body.appendChild(modalElement);
    
    // Charger les données utilisateur et mettre à jour l'UI
    const userData = loadUserData();
    const currentAcquisition = userData.acquisitions[acId];
    const percentage = currentAcquisition ? currentAcquisition.percentage : 0;
    modal.setProgress(percentage);

    // Appliquer la couleur
    if (modal.cardElement && starData.color) {
        modal.cardElement.style.setProperty('--primary-color', starData.color);
    }
    
    // Écouteur d'événement pour le bouton de sauvegarde
    const saveButton = modal.cardElement.querySelector('.actions .btn-primary');
    if (saveButton) {
        saveButton.addEventListener('click', () => {
            const progressSlider = modal.cardElement.querySelector('.custom-slider');
            const newPercentage = parseInt(progressSlider.value, 10);
            updateAcquisition(acId, newPercentage);
        });
    }
}
        

let V = {
  rootPage: null,
  solarSystem: null
};

V.init = function() {
  Star.loadStarsData();
  V.rootPage = htmlToDOM(template);
  V.solarSystem = new SolarSystemView();

  V.rootPage.querySelector('slot[name="svg"]').replaceWith( V.solarSystem.dom() );
  V.rootPage.appendChild( new HeadeskillsSideBarView().dom() );
    V.rootPage.appendChild( new featuresView().dom() );
    V.rootPage.appendChild( new pausePlayBtnView().dom() );
  V.attachEvents(V.rootPage, V.solarSystem);
  return V.rootPage;
};



V.attachEvents = function(rootPage, solarSystem) {
    
    Animation.rotateSolarSystem(solarSystem, animationState);

    // Setup pause/play button
    const pausePlayBtn = rootPage.querySelector('#pausePlayBtn');
    pausePlayBtn.addEventListener('click', C.togglePausePlay);

    solarSystem.addAllStarsClickListener(C.handler_clickStar);
    solarSystem.addAllStarsHoverListener(C.hoverOnStar, C.hoverOutStar);
    
    setupPanZoom(rootPage, solarSystem);
}


export function systemSolar() {
  return C.init();
}