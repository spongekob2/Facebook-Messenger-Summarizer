let apiUrl, apiKey, model, promptInstruction, promptInstructionEnd;

loadConfig().then(config => {
  apiUrl = config.apiUrl;
  apiKey = config.apiKey;
  model = config.model;
  promptInstruction = config.promptInstruction;
  promptInstructionEnd = config.promptInstructionEnd;
});

document.addEventListener('DOMContentLoaded', function() {
  let scrapButton = document.getElementById('summarizeButton');
  scrapButton.addEventListener('click', function() {
    getConversationFromDom
    .then(conversation => {
      let prompt = promptInstruction + `\nConversation :\n"""${conversation}"""\n` + promptInstructionEnd;
      
      fetch(apiUrl, {
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