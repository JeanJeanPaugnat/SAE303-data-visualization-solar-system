import { SolarSystemView } from "@/ui/solar-system";
import { htmlToDOM } from "@/lib/utils.js";
import template from "./template.html?raw";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
gsap.registerPlugin(MotionPathPlugin);


let C = {};


C.init = function() {
  return V.init();
}

C.rotateStars = function(planets) {
    planets.forEach(systemSkill => {
        let systemSkillLevels = systemSkill.querySelectorAll('[id$="-level1"], [id$="-level2"], [id$="-level3"]');
        systemSkillLevels.forEach( (level) => {
            let planetLevels = level.querySelector('[id$="-activities"]');
            let pathAcOrbit = level.querySelector('[id$="-center-orbit"]');

            let stars = planetLevels.querySelectorAll('[id$="-ac1"], [id$="-ac2"], [id$="-ac3"]');


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
                gsap.to(star, {
                    duration: 10,
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
            gsap.to(systemSkillLevels[i], {
                duration: 20,
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
        }
    });

}



C.rotateSolarSystem = function() {
    let systemSolar = V.solarSystem.getMainPath();

    let planets = V.solarSystem.getElements();
    
    planets.forEach( (planet, index) => {
        let offset = (1 / planets.length) * index;
        gsap.to(planet, { 
            duration: 60, 
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

  V.attachEvents();
  return V.rootPage;
};

V.attachEvents = function() {
    C.rotateSolarSystem();

//   V.rootPage.addEventListener('click', C.handler_clickStar);
}


export function SvgDemo6Page() {
  return C.init();
}