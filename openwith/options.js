var parserSectionCount = 1;
function createParserSection(index, elem) {
  index = index || parserSectionCount;
  elem = elem || { domain: '', myfunction: '' };
  $("#parser-div").append(
    $('<div class="parser-section" id="parser-section-' + index + '"> \
        <table>\
          <tr>\
            <td class="label-column">Domain:</td>\
            <td><input type="text" class="domain" value="' + elem.domain + '" /></td>\
          </tr>\
          <tr>\
            <td class="label-column">Parser Function:</td>\
            <td>\
            <tt>function(url) { </tt><br />\
              <div style="float: left; width:1.5em">&nbsp;</div><textarea class="parser-function">' + elem.myfunction + '</textarea><br />\
              <tt>} //Should return a relative path to the file you wish to open</tt>\
            </td>\
          </tr>\
        </table>\
      </div>'));
  parserSectionCount++;
}

function restore() {
  $("#open-with-proxy-port").val(localStorage["open-with-proxy-port"] || "");
  var parserfunc = JSON.parse(localStorage["parser-functions"] || "[]");
  $(parserfunc).each(function(index, elem) {
    createParserSection(index, elem);
  });
}

function save() {
  localStorage["open-with-proxy-port"] = $("#open-with-proxy-port").val();
  var parserFunctions = [];
  $(".domain").each(function(index, elem) {
    var newEntry = { domain: elem.value };
    parserFunctions.push(newEntry);
  });
  $(".parser-function").each(function(index, elem) {
    parserFunctions[index].myfunction = elem.value;
  });
  localStorage["parser-functions"] = JSON.stringify(parserFunctions);
}

$(document).ready(function() {
  restore();
  $("#add-parser-section").click(function() { createParserSection(); });
  $('#save-button').click(function() { save(); });
  if(parserSectionCount == 1) {
    createParserSection();
  }
});
