document.addEventListener('DOMContentLoaded', function() {
  var apiKeyInput = document.getElementById('apiKeyInput');
  var saveButton = document.getElementById('saveButton');

  // Chargement des paramètres enregistrés
  browser.storage.local.get(['apiKey']).then(function(result) {
    apiKeyInput.value = result.apiKey || "";
  });

  // Enregistrement des paramètres
  saveButton.addEventListener('click', function() {
    var apiKey = apiKeyInput.value;

    // Enregistrer les paramètres
    browser.storage.local.set({ apiKey: apiKey }).then(function() {
      console.log('Settings saved.');
    });
  });
});
