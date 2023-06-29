let apiKey = "";

loadConfig().then(config => {
  apiKey = config.apiKey; // Utilisation de la clé API chargée depuis le fichier de configuration
});

document.addEventListener('DOMContentLoaded', function() {
  let scrapButton = document.getElementById('summarizeButton');
  scrapButton.addEventListener('click', function() {
    getConversationFromDom
    .then(conversation => {
      let prompt = `Ton rôle est de fournir un résumé de la conversation Facebook Messenger donnée entre six guillemets. Résume cette conversation sous forme de bullet point pour faire rendre compte des sujets de discussion, des débats, des idées. Ne rentre pas dans les détails.\nConversation :\n"""${conversation}"""\nFin de la conversation.`;
      let model = "gpt-3.5-turbo";
      
      let url = "https://api.openai.com/v1/chat/completions";
      fetch(url, {
        'method': 'POST',
        'headers': {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        'body' : JSON.stringify({
          "model": model,
          "messages": [{"role" : "system", "content" : prompt}]
        })
      })
      .then(response => response.json())
      .then(data => {
        let summary = data.choices[0].message.content; 
        document.getElementById('summaryTextArea').value = summary;
      })
      .catch(error => {
        document.getElementById('summaryTextArea').value = "An error occured.";
      });
    });
  });
});

function loadConfig() {
  return fetch(browser.runtime.getURL('config.json'))
    .then(response => response.json())
    .catch(error => {
      console.error('Error loading config:', error);
    });
}

const getConversationFromDom = new Promise((resolve, reject) => {
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
      resolve(conversation.join("\n"))
    });
  })
})