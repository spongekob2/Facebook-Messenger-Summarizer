let apiUrl, apiKey, model, promptInstruction, promptInstructionEnd;

loadConfig().then(config => {
  apiUrl = config.apiUrl;
  apiKey = config.apiKey;
  model = config.model;
  promptInstruction = config.promptInstruction;
  promptInstructionEnd = config.promptInstructionEnd;
});

document.addEventListener('DOMContentLoaded', function() {
  let summarizeButton = document.getElementById('summarizeButton');
  let summaryTextArea = document.getElementById('summaryTextArea');
  summarizeButton.addEventListener('click', function() {
    summarizeButton.children[0].style.display = "none";
    summarizeButton.children[1].style.display = "inline-block";
    getConversationFromDom
    .then(conversation => {
      let prompt = promptInstruction + `\n"""${conversation}"""\n` + promptInstructionEnd;
      return fetch(apiUrl, {
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
    })
    .then(response => response.json())
    .then(data => {
      if (data.choices){
        return data.choices[0].message.content;
      }
      else if (data.error){
        return data.error.message
      }
      else {
        return "An error occured."
      }
    })
    .then(message => summaryTextArea.value = message)
    .catch(error => summaryTextArea.value = error.message)
    .finally(() => {
      summarizeButton.children[0].style.display = "inline-block";
      summarizeButton.children[1].style.display = "none";
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
    })
    .catch(error => reject(error));
  })
})