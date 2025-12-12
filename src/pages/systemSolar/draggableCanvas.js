import gsap from "gsap";

let panzoom = {
    state: { x: 0, y: 0, scale: 1 },
    viewport: null,
    svg: null,
    dragging: false,
    start: { x: 0, y: 0 }
};

// Pan & zoom on the viewport - Ne bloque pas les clicks
let setupPanZoom = function(rootPage, solarSystem) {
    panzoom.viewport = rootPage;
    panzoom.svg = solarSystem.dom();

    Object.assign(panzoom.viewport.style, {
        width: "100vw",
        height: "100vh",
        overflow: "hidden",
        position: "relative",
        touchAction: "none"
    });
    Object.assign(panzoom.svg.style, {
        width: "100%",
        height: "100%",
        userSelect: "none",
        touchAction: "none",
        transformOrigin: "0 0",
        pointerEvents: "auto" // Important: permet les clicks sur les éléments SVG
    });

    const apply = () => {
        gsap.set(panzoom.svg, {
            x: panzoom.state.x,
            y: panzoom.state.y,
            scale: panzoom.state.scale,
            transformOrigin: "0 0"
        });
    };

    const clamp = gsap.utils.clamp;
    const minScale = 0.2;
    const maxScale = 3;

    const onPointerDown = (e) => {
        // Ne drag que si c'est sur le conteneur, pas sur un élément interactif
        if (e.target === panzoom.svg || e.target.closest('svg') === panzoom.svg) {
            if (e.target.tagName !== 'circle' && e.target.tagName !== 'path' && !e.target.id?.includes('-ac')) {
                panzoom.dragging = true;
                panzoom.start = { x: e.clientX - panzoom.state.x, y: e.clientY - panzoom.state.y };
                panzoom.viewport.setPointerCapture(e.pointerId);
            }
        }
    };

    const onPointerMove = (e) => {
        if (!panzoom.dragging) return;
        panzoom.state.x = e.clientX - panzoom.start.x;
        panzoom.state.y = e.clientY - panzoom.start.y;
        apply();
    };

    const onPointerUp = (e) => {
        panzoom.dragging = false;
        panzoom.viewport.releasePointerCapture(e.pointerId);
    };

    const onWheel = (e) => {
        e.preventDefault();
        const rect = panzoom.viewport.getBoundingClientRect();
        const cx = e.clientX - rect.left;
        const cy = e.clientY - rect.top;
        const delta = e.deltaY < 0 ? 1.1 : 0.9;
        const newScale = clamp(minScale, maxScale, panzoom.state.scale * delta);
        const k = newScale / panzoom.state.scale;
        panzoom.state.x = cx - k * (cx - panzoom.state.x);
        panzoom.state.y = cy - k * (cy - panzoom.state.y);
        panzoom.state.scale = newScale;
        apply();
    };

    panzoom.viewport.addEventListener('pointerdown', onPointerDown);
    panzoom.viewport.addEventListener('pointermove', onPointerMove);
    panzoom.viewport.addEventListener('pointerup', onPointerUp);
    panzoom.viewport.addEventListener('pointercancel', onPointerUp);
    panzoom.viewport.addEventListener('wheel', onWheel, { passive: false });

    apply();
};

export { setupPanZoom };
