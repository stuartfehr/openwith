function doClick() {
  chrome.tabs.getSelected(null, function(tab) {
    chrome.tabs.sendMessage(tab.id, { getHtml: true }, function(response) {
      var parserfunctions = JSON.parse(localStorage["parser-functions"]);
      var found = false;
      for(var i = 0; i < parserfunctions.length; i++) {
        if(tab.url.indexOf(parserfunctions[i].domain) == 0) {
          // Found a match
          found = true;
          var sandboxframe = document.getElementById('sandbox');
          var message = { url: tab.url, html: response.html, functiontext: parserfunctions[i].myfunction };
          sandboxframe.contentWindow.postMessage(message, '*');
        }
      }

      if(!found) {
        alert("Unable to find a suitable relative path for this site.\nPlease check your parsers and try again.");
      }
    });
  });
}

window.addEventListener('message', function(event) {
  var port = localStorage["open-with-proxy-port"];
  if(!port || port == "") { alert("Please set the open with proxy port on the options page."); return; }

  var relativepath = event.data.relativepath || '';
  if(relativepath != '') {
    $.post('http://localhost:' + port + '/', { 'request': relativepath});
  } else {
    alert("Unable to find a suitable relative path for this site.\nPlease check your parsers and try again.");
  }
});

$(document).ready(function() {
  chrome.browserAction.onClicked.addListener(doClick);
  chrome.extension.onMessage.addListener(
    function(request, sender, sendResponse) {
      if (request.activate) {
        doClick();
      }
    });
});
