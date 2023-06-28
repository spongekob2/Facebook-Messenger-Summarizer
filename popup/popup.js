document.addEventListener('DOMContentLoaded', function() {
  let scrapButton = document.getElementById('summarizeButton');
  scrapButton.addEventListener('click', function() {
    getConversationFromDom().then(m => console.log(m));
  });
});


function getConversationFromDom() {
    return browser.tabs.query({
      currentWindow: true,
      active: true,
    })
    .then((tabs) => {
      let activeTab = tabs[0];
      let tabId = activeTab.id;
      browser.tabs.sendMessage(tabId, { type: 'scrapMessages' }
      )
    .then(resp => {
      let messages = resp.messages;
      let conversation = [];
      let conversationString = [];

      let currentLine = [];
      for (let msg of messages) {
        if (msg != "Entrer") {
          currentLine.push(msg)
        }
        else {
          conversation.push(currentLine.join(" : "));
          currentLine = []
        }
      }
      conversation.push(currentLine)
      return conversation
    });
  })
}