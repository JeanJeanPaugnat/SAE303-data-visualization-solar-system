//fonctions to load the json, search infos into the json to add to the stars

let Star = {};

let customKeys = {
        1: "comprendre",
        2: "concevoir",
        3: "exprimer",
        4: "developper",
        5: "entreprendre"
    };

Star.loadStarsData = async function() {
    let response = await fetch('/src/data/butmmi.json');
    const originalData = await response.json();
    const newData = {};

    for (const key in originalData) {
        if (Object.hasOwnProperty.call(originalData, key)) {
            const competence = originalData[key];
            const newKey = customKeys[competence.numero];
            if (newKey) {
                newData[newKey] = competence;
            } else {
                newData[key] = competence;
            }
        }
    }
    Star.starsData = newData;
    console.log("Stars data loaded and transformed:", Star.starsData);
    
    return Star.starsData;
}

Star.starsData = await Star.loadStarsData();

Star.getStarDataById = function(starId) {
    if (!Star.starsData) {
        console.error("Stars data not loaded.");
        return null;
    }
    console.log("Searching for star data with ID:", starId);


    const acPart = starId.split('-')[0]; // e.g., "AC12.03"
    const match = acPart.match(/AC(\d)(\d)\.\d+/); // Extracts competence and niveau numbers

    if (!match) {
        console.error(`Invalid starId format: ${starId}`);
        return null;
    }

    const competenceNum = parseInt(match[2], 10);
    const niveauNum = parseInt(match[1], 10);

    const competenceKey = customKeys[competenceNum];
    const competence = Star.starsData[competenceKey];
    const niveau = competence.niveaux.find(n => n.ordre === niveauNum);
    const ac = niveau.acs.find(a => a.code === acPart);
    console.log( competence, niveau, ac);
    let color = "";
    switch (competence.numero) {
        case 1: color = "#FF0000"; break;
        case 2: color = "#FFEA00"; break;
        case 3: color = "#00D0FF"; break;
        case 4: color = "#FB00FF"; break;
        case 5: color = "#77FF00"; break;
    }
    const starData = {
        code: ac.code,
        libelle: ac.libelle,
        niveau: niveau.ordre,
        competence: competence.nom_court,
        color: color
    };
    
    console.log("Found star data:", starData);
    return starData;
}

export { Star };