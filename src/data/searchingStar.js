let Star = {};

// let customKeys = {
//         1: "comprendre",
//         2: "concevoir",
//         3: "exprimer",
//         4: "developper",
//         5: "entreprendre"
//     };

Star.loadStarsData = async function() {
    let response = await fetch('/src/data/butmmi.json');
    const originalData = await response.json();
    // const newData = {};

    // for (const key in originalData) {
    //     if (Object.hasOwnProperty.call(originalData, key)) {
    //         const competence = originalData[key];
    //         const newKey = customKeys[competence.numero];
    //         if (newKey) {
    //             newData[newKey] = competence;
    //         } else {
    //             newData[key] = competence;
    //         }
    //     }
    // }
    Star.starsData = originalData;
    // console.log("Stars data loaded and transformed:", Star.starsData);
    
    return Star.starsData;
}

Star.starsData = await Star.loadStarsData();

// Créer un tableau simple pour accès par indices (comme pn)
Star.dataArray = [];
for (let key in Star.starsData) {
    Star.dataArray.push(Star.starsData[key]);
}

// Méthodes d'extraction simples (comme pn)
Star.getLevels = function(accode) {
    return parseInt(accode.charAt(2), 10);
};

Star.getSkillIndex = function(accode) {
    return parseInt(accode.charAt(3), 10);
};

Star.getACIndex = function(accode) {
    return parseInt(accode.charAt(6), 10);
};

Star.getStarDataById = function(starId) {
    // console.log("starId:", starId);

    let acCode = starId.split('-')[0];
    // console.log("acCode:", acCode);
    
    let level = Star.getLevels(acCode);        
    let skill = Star.getSkillIndex(acCode);    
    let acIndex = Star.getACIndex(acCode);    
    
    // console.log("level:", level, "skill:", skill, "acIndex:", acIndex);
    
    let competence = Star.dataArray[skill - 1];           
    let niveau = competence.niveaux[level - 1];           
    let ac = niveau.acs[acIndex - 1];                     
    
    // console.log("competence:", competence.nom_court, "niveau:", niveau.ordre, "ac:", ac.code);
    

    let color = "";
    switch (skill) {
        case 1: color = "#FF0000"; break;  // Comprendre
        case 2: color = "#FFEA00"; break;  // Concevoir
        case 3: color = "#00D0FF"; break;  // Exprimer
        case 4: color = "#FB00FF"; break;  // Développer
        case 5: color = "#77FF00"; break;  // Entreprendre
    }

    let starData = {
        code: ac.code,
        libelle: ac.libelle,
        niveau: niveau.ordre,
        competence: competence.nom_court,
        color: color
    };
    
    console.log("starData:", starData);
    return starData;
}

export { Star };