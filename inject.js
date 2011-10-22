window.addEventListener("keydown", function(event) {
  // Bind to both command (for Mac) and control (for Win/Linux)
  if ((event.ctrlKey || event.metaKey) && event.shiftKey && event.keyCode == 69 /* 'e' */) {
    // Send message to background page to toggle tab
    chrome.extension.sendRequest({activate: true}, function(response) {});
  }
}, false);

