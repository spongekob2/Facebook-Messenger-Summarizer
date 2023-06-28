
// content-script.js
"use strict";

var messages = [];

browser.runtime.onMessage.addListener((request) => {
    scrapeMessages();
  return Promise.resolve({ response: "Hi from content script" });
});


function scrapeMessages() {
  // Votre code de scrapping ici
    console.log("ca part.")
    var regex = /reply/i;
    var messageElements = document.querySelectorAll('[role="row"]');
    var filteredElements = Array.from(messageElements).filter(function(element) {
        return regex.test(element.getAttribute('style'));
    });
    filteredElements.forEach(function(element) {
        getLastDescendantWithoutChild(element);
        
    });
    console.log(messages)

}

function getLastDescendantWithoutChild(element) {
    if (element.nodeType === Node.TEXT_NODE) {
        if (element.textContent !== undefined) {
            var message = element.textContent.trim();
            messages.push(message);
            return;
    }
    }
    for (var i = 0; i < element.childNodes.length; i++) {
        var childNode = element.childNodes[i];
        getLastDescendantWithoutChild(childNode);
    }
}
