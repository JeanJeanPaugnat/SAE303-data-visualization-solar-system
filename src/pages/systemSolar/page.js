import { SolarSystemView } from "@/ui/solar-system";
import { htmlToDOM } from "@/lib/utils.js";
import template from "./template.html?raw";
import gsap from "gsap";
import { Draggable } from "gsap/draggable";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { setupPanZoom } from "./draggableCanvas.js";
import { ModalView } from "@/ui/modal";
gsap.registerPlugin(MotionPathPlugin, Draggable);


let C = {};

let animationState = {
    isPlaying: true,
    animations: [] // Stocke les animations motionPath
};

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


C.handler_clickStar = function(event) {
    const star = event.currentTarget;
    const starId = star.id;
    console.log("Star clicked:", starId);
    const modal = new ModalView();
    let mainContainer = document.querySelector('#mainContainer');
    console.log(mainContainer);
    let svgContainer = mainContainer.querySelector('#svgContainer');
    console.log(mainContainer.querySelector('#svgContainer'));
    mainContainer.insertBefore(modal.dom(), svgContainer);
    modal.dom().querySelector('.close-btn').addEventListener('click', () => {
        console.log("Modal closed");
        V.rootPage.removeChild(modal.dom());
    });

}



// a mettre dans animation
C.rotateStars = function(planets) {
    planets.forEach(systemSkill => {
        let systemSkillLevels = systemSkill.querySelectorAll('[id$="-level1"], [id$="-level2"], [id$="-level3"]');
        systemSkillLevels.forEach( (level) => {
            let planetLevels = level.querySelector('[id$="-activities"]');
            let pathAcOrbit = level.querySelector('[id$="-center-orbit"]');

            let stars = planetLevels.querySelectorAll('[id$="-ac1"], [id$="-ac2"], [id$="-ac3"], [id$="-ac4"], [id$="-ac5"], [id$="-ac6"], [id$="-ac7"]');


            //IA 
            // Génère des offsets espacés avec une petite part aléatoire et une distance minimale
            const makeOffsets = (count, minGap = 0.05) => {
                const baseGap = 1 / count;
                const jitter = Math.max(0, (baseGap - minGap) / 2);
                let arr = Array.from({ length: count }, (_, i) => {
                    const noise = (Math.random() * 2 - 1) * jitter;
                    const v = i * baseGap + noise;
                    return ((v % 1) + 1) % 1; // wrap 0-1
                }).sort((a, b) => a - b);
                return arr;
            };

            const offsets = makeOffsets(stars.length, 0.06);
            const phase = Math.random();

            stars.forEach((star, index) => {
                const start = (offsets[index] + phase) % 1;
                const anim = gsap.to(star, {
                    duration: 30,
                    repeat: -1,
                    ease: "linear",
                    motionPath: {
                        path: pathAcOrbit,
                        align: pathAcOrbit,
                        alignOrigin: [0.5, 0.5],
                        start,
                        end: start + 1
                    }
                });
                // Stocke l'animation pour la pause/play
                animationState.animations.push(anim);
            });
        } );
    });
}

C.rotateLevels = function(planets) {

    planets.forEach(systemSkill => {
        let systemSkillLevels = systemSkill.querySelectorAll('[id$="level1-activities"], [id$="level2-activities"], [id$="level3-activities"]');
        
        for (let i = 0; i < systemSkillLevels.length; i++) {
            let orbitLevel = systemSkill.querySelectorAll('[id$="level1-orbit"], [id$="level2-orbit"], [id$="level3-orbit"]');
            orbitLevel = orbitLevel[i];
            let offsetRandom = Math.random();
            const anim = gsap.to(systemSkillLevels[i], {
                duration: 60,
                repeat: -1,
                ease: "linear",
                motionPath: {
                    path: orbitLevel,
                    align: orbitLevel,
                    alignOrigin: [0.5, 0.5],
                    start: offsetRandom,
                    end: offsetRandom + 1
                }
            });
            // Stocke l'animation
            animationState.animations.push(anim);
        }
    });

}



C.rotateSolarSystem = function() {
    let systemSolar = V.solarSystem.getMainPath();

    let planets = V.solarSystem.getElements();
    
    planets.forEach( (planet, index) => {
        let offset = (1 / planets.length) * index;
        const anim = gsap.to(planet, { 
            duration: 100, 
            repeat: -1,
            ease: "linear",
            motionPath: { 
                path: systemSolar, 
                align: systemSolar, 
                alignOrigin: [0.5, 0.5],
                start: offset,
                end: offset + 1
            } 
        });
        // Stocke l'animation
        animationState.animations.push(anim);
        C.rotateLevels(planets);
        
    } );
    C.rotateStars(planets);
}
        

let V = {
  rootPage: null,
  solarSystem: null
};

V.init = function() {
  V.rootPage = htmlToDOM(template);
  V.solarSystem = new SolarSystemView();

  V.rootPage.querySelector('slot[name="svg"]').replaceWith( V.solarSystem.dom() );

  V.attachEvents(V.rootPage, V.solarSystem);
  return V.rootPage;
};

V.attachEvents = function(rootPage, solarSystem) {
    
    C.rotateSolarSystem();

    // Setup pause/play button
    const pausePlayBtn = rootPage.querySelector('#pausePlayBtn');
    console.log("Pause/Play button:", pausePlayBtn);
    // pausePlayBtn.addEventListener('click', C.togglePausePlay);
    if (pausePlayBtn) {
        pausePlayBtn.addEventListener('click', C.togglePausePlay);
        
        // Hover effect on button
        pausePlayBtn.addEventListener('mouseenter', function() {
            this.style.background = 'rgba(255, 255, 255, 0.2)';
            this.style.borderColor = 'rgba(255, 255, 255, 0.5)';
        });
        pausePlayBtn.addEventListener('mouseleave', function() {
            this.style.background = 'rgba(255, 255, 255, 0.1)';
            this.style.borderColor = 'rgba(255, 255, 255, 0.3)';
        });
    } else {
        console.warn('Pause/Play button not found');
    }

    let starsAC = rootPage.querySelectorAll('[id$="-ac1"], [id$="-ac2"], [id$="-ac3"], [id$="-ac4"], [id$="-ac5"], [id$="-ac6"], [id$="-ac7"]');
    solarSystem.addAllStarsClickListener(C.handler_clickStar);

    // V.rootPage.addEventListener('click', C.handler_clickStar);
    // starsAC.forEach( (star) => {
    //     star.style.cursor = 'pointer';
    //     star.addEventListener('click', function() {
    //         console.log("Star clicked:");
    //     } );
    // } );
    setupPanZoom(rootPage, solarSystem);
}


export function systemSolar() {
  return C.init();
}