function doClick() {
  chrome.tabs.getSelected(null, function(tab) {
    var projectRoot = localStorage["project-root"];
    if(!projectRoot || projectRoot == "") { alert("Please set the project root on the options page."); return; }
    var command = localStorage["open-with-command"];
    if(!command || command == "") { alert("Please set the open with command on the options page."); return; }

    var parserfunctions = JSON.parse(localStorage["parser-functions"]);
    var found = false;
    for(var i = 0; i < parserfunctions.length; i++) {
      if(tab.url.indexOf(parserfunctions[i].domain) == 0) {
        // Found a match
        found = true;
        var sandboxframe = document.getElementById('sandbox');
        var message = { url: tab.url, functiontext: parserfunctions[i].myfunction };
        sandboxframe.contentWindow.postMessage(message, '*');
      }
    }

    if(!found) {
      alert("Unable to find a suitable relative path for this site.\nPlease check your parsers and try again.");
    }
  });
}

window.addEventListener('message', function(event) {
  var relativepath = event.data.relativepath || '';
  if(relativepath != '') {
    $.post('http://localhost:1337/', { 'request': relativepath});
  } else {
    alert("Unable to find a suitable relative path for this site.\nPlease check your parsers and try again.");
  }
});

$(document).ready(function() {
  chrome.browserAction.onClicked.addListener(doClick);
  chrome.extension.onRequest.addListener(
    function(request, sender, sendResponse) {
      if (request.activate) {
        doClick();
      }
    });
});
