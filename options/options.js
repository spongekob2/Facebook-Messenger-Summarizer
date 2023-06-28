document.addEventListener('DOMContentLoaded', function() {
  var apiKeyInput = document.getElementById('apiKeyInput');
  var messageCountInput = document.getElementById('messageCountInput');
  var summarySizeSelect = document.getElementById('summarySizeSelect');
  var saveButton = document.getElementById('saveButton');

  // Chargement des paramètres enregistrés
  browser.storage.local.get(['apiKey', 'messageCount', 'summarySize']).then(function(result) {
    apiKeyInput.value = result.apiKey;
    messageCountInput.value = result.messageCount || 10;
    summarySizeSelect.value = result.summarySize || 'normal';
  });

  // Enregistrement des paramètres
  saveButton.addEventListener('click', function() {
    var apiKey = apiKeyInput.value;
    var messageCount = messageCountInput.value;
    var summarySize = summarySizeSelect.value;

    // Enregistrer les paramètres
    browser.storage.local.set({ apiKey: apiKey, messageCount: messageCount, summarySize: summarySize }).then(function() {
      console.log('Settings saved.');
    });
  });
});
