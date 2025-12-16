import { gsap } from "gsap";
import DrawSVGPlugin from "gsap/DrawSVGPlugin";
import { Draggable } from "gsap/draggable";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
gsap.registerPlugin(DrawSVGPlugin, Draggable, MotionPathPlugin);

let Animation = {};

Animation.rotateElement = function (element, duration = 1) {
  gsap.to(element, {
    rotation: "+=360",
    transformOrigin: "50% 50%",
    repeat: -1,
    ease: "linear",
    duration: duration,
  });
};

Animation.colorTransition = function (
  element,
  fromColor,
  toColor,
  duration = 1,
) {
  gsap.fromTo(
    element,
    { fill: fromColor },
    {
      fill: toColor,
      duration: duration,
      repeat: -1,
      yoyo: true,
      ease: "linear",
    },
  );
};

Animation.stretchElement = function (
  element,
  direction = "x",
  scale = 2,
  duration = 1,
) {
  const props = direction === "x" ? { scaleX: scale } : { scaleY: scale };
  gsap.to(element, {
    ...props,
    duration: duration,
    yoyo: true,
    repeat: -1,
    ease: "power1.inOut",
    transformOrigin: "50% 50%",
  });
};

Animation.drawLine = function (paths, fills, duration = 1) {
  gsap
    .timeline()
    .from(paths, {
      drawSVG: 0,
      duration: duration,
      ease: "power1.inOut",
      stagger: 0.1,
    })
    .from(
      fills,
      {
        opacity: 0,
        scale: 1.5,
        transformOrigin: "center center",
        duration: 0.8,
        ease: "elastic.out(2, 0.3)",
      },
      "-=1",
    );
};

Animation.bounce = function (element, duration = 1, height = 100) {
  gsap.to(element, {
    y: -height,
    duration: duration / 2,
    ease: "power1.out",
    yoyo: true,
    repeat: 1,
    transformOrigin: "50% 100%",
  });
};

Animation.rotateStars = function(planets, animationState) {
    planets.forEach(systemSkill => {
        let systemSkillLevels = systemSkill.querySelectorAll('[id$="-level1"], [id$="-level2"], [id$="-level3"]');
        systemSkillLevels.forEach( (level) => {
            let planetLevels = level.querySelector('[id$="-activities"]');
            let pathAcOrbit = level.querySelector('[id$="-center-orbit"]');

            let stars = planetLevels.querySelectorAll('[id$="-ac1"], [id$="-ac2"], [id$="-ac3"], [id$="-ac4"], [id$="-ac5"], [id$="-ac6"], [id$="-ac7"]');

            const makeOffsets = (count, minGap = 0.05) => {
                const baseGap = 1 / count;
                const jitter = Math.max(0, (baseGap - minGap) / 2);
                let arr = Array.from({ length: count }, (_, i) => {
                    const noise = (Math.random() * 2 - 1) * jitter;
                    const v = i * baseGap + noise;
                    return ((v % 1) + 1) % 1;
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
                animationState.animations.push(anim);
            });
        } );
    });
}

Animation.rotateLevels = function(planets, animationState) {
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
            animationState.animations.push(anim);
        }
    });
}

Animation.rotateSolarSystem = function(solarSystem, animationState) {
    let systemSolar = solarSystem.getMainPath();
    let planets = solarSystem.getElements();
    
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
        animationState.animations.push(anim);
    } );
    
    Animation.rotateLevels(planets, animationState);
    Animation.rotateStars(planets, animationState);
}


Animation.animusReveal = function(element, duration = 0.8) {
  const timeline = gsap.timeline();

  // 1. L'élément s'ouvre verticalement comme une projection
  timeline.fromTo(element, 
    {
      clipPath: "polygon(0 50%, 100% 50%, 100% 50%, 0 50%)",
      opacity: 0,
      scale: 0.95,
      filter: "blur(10px) brightness(1.5)" // Commence flou et très lumineux
    },
    {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)", // S'ouvre complètement
      opacity: 1,
      scale: 1,
      filter: "blur(0px) brightness(1)",
      duration: duration,
      ease: "power3.out" // Effet rapide au début, lent à la fin
    }
  );

  // 2. Petit effet de "rebond" lumineux sur la bordure après l'ouverture
  timeline.fromTo(element,
    { boxShadow: "0 0 0px rgba(0, 212, 255, 0)" },
    { 
      boxShadow: "0 0 30px rgba(0, 212, 255, 0.3)", 
      duration: 0.3, 
      yoyo: true, 
      repeat: 1,
      ease: "sine.inOut"
    },
    "-=0.2" // Commence légèrement avant la fin de l'animation précédente
  );
};

Animation.animusHide = function(element, duration = 0.5, onComplete) {
  const timeline = gsap.timeline({ onComplete });

  // Animation pour cacher l'élément, inverse de animusReveal
  timeline.to(element, {
    clipPath: "polygon(0 50%, 100% 50%, 100% 50%, 0 50%)",
    opacity: 0,
    scale: 0.95,
    filter: "blur(10px) brightness(1.5)",
    duration: duration,
    ease: "power3.in"
  });
};

// Animation.draggable = function (element, bounds) {
//   console.log("Making element draggable:", element, "with bounds:", bounds);
//     Draggable.create(element, {
//     type: 'y',
//     bounds: bounds,
//     inertia: true,
//     onClick: function () {
//       console.log('clicked');
//     },
//     onDragEnd: function () {
//       console.log('drag ended');
//     }
//   });
// };





export { Animation };
