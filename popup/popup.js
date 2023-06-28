document.addEventListener('DOMContentLoaded', function() {
  var scrapButton = document.getElementById('summarizeButton');
  scrapButton.addEventListener('click', function() {
    // Envoyer un message à contentScript.js pour appeler scrapMessages()
    browser.tabs
    .query({
      currentWindow: true,
      active: true,
    }).then((tabs) => {
    var activeTab = tabs[0];
      var tabId = activeTab.id;
      browser.tabs.sendMessage(tabId, { type: 'scrapMessages' });
    })
  });
});
