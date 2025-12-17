let defaultUserData = {
  acquisitions: {},
  history: []
};

let UserData = {};


UserData.load = function() {
  let data = localStorage.getItem('studentData');
  if (data) {
    return JSON.parse(data);
  }return { ...defaultUserData, acquisitions: {}, history: [] };
};


UserData.save = function(userData) {
  localStorage.setItem('studentData', JSON.stringify(userData));
};


UserData.updateAcquisition = function(acId, percentage) {
  let userData = UserData.load();

  let newPercentage = Math.max(0, Math.min(100, percentage));

  userData.acquisitions[acId] = { 
    percentage: newPercentage,
    validated: newPercentage === 100
  };

  userData.history.push({
    ac: acId,
    percentage: newPercentage,
    date: new Date().toISOString()
  });

  UserData.save(userData);
  window.dispatchEvent(new CustomEvent('userDataChanged', { detail: userData }));
};


UserData.export = function() {
  let userData = UserData.load();
  let dataStr = JSON.stringify(userData, null, 2);
  let dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
  
  let exportFileDefaultName = `progression-data-${new Date().toISOString().slice(0, 10)}.json`;
  
  let linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileDefaultName);
  linkElement.click();
};


UserData.import = function(importedData) {
  let parsedData = JSON.parse(importedData);
  UserData.save(parsedData);
  
  // Notifier l'application du changement
  window.dispatchEvent(new CustomEvent('userDataChanged', { detail: parsedData }));
};

export { UserData };
