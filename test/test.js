var bbsReader = require("../bbs-reader");

    text = "\xa2\x1b[m\x1b[m\x67",
    result = bbsReader(text);
    
function getTextContent(html) {
    return html.replace(/<.+?>/g, "");
}

console.assert(getTextContent(result.html) == "\xa2\x67\xa2\x67");
