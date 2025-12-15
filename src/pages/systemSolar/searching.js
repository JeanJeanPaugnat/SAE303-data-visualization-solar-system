//fonctions to load the json, search infos into the json to add to the stars

let D = {};

D.loadStarsData = async function() {
    let response = await fetch('/src/data/butmmi.json');
    D.starsData = await response.json();
    console.log("Stars data loaded:", D.starsData);
    return D.starsData;
}

D.getStarDataByInfo = async function(starId) {
    console.log( starId);
    if (!D.starsData) {
        await D.loadStarsData();
    }
    
    for (let competenceId in D.starsData) {
        const competence = D.starsData[competenceId];
        if (competence.niveaux) {
            for (let niveau of competence.niveaux) {

                if (niveau.acs) {
                    for (let ac of niveau.acs) {
                        
                        if (ac.code === starId) {
                            console.log("Found AC:", ac);
                            console.log(competence.numero);
                            let color = "";
                            if (competence.numero === 1){
                                    color = "#FF0000";
                                }else if (competence.numero === 2){
                                    color = "#FFEA00";
                                }else if (competence.numero === 3){
                                    color = "#00D0FF";
                                }else if (competence.numero === 4){
                                    color = "#FB00FF";
                                }else if (competence.numero === 5){
                                    color = "#77FF00";
                                }   
                            console.log("Determined color:", color);
                            D.oneStarData = {
                                code: ac.code,
                                libelle: ac.libelle,
                                niveau: niveau.ordre,
                                competence: competence.nom_court,
                                color: color
                            };
                            console.log("oneStarData set to:", D.oneStarData);
                            return D.oneStarData;
                        }
                    }
                }
            }
        }

    }
    
    console.log("No data found for star ID:", starId);
    return null;
}



export { D };