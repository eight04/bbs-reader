var bbsReader = require("../bbs-reader");

function getTextContent(html) {
    return html.replace(/<.+?>/g, "");
}

console.assert(
    getTextContent(bbsReader("\xa2\x1b[m\x1b[m\x67").html)
    == "\xa2\x67\xa2\x67"
);

console.assert(
    bbsReader("\x1b[1m\x1b[33mA\x1b[m\x1b[33mB").html
    == "<div class='line'><span class='f3 b0 l' style='width:0.5em'>A</span><span class='f3 b0' style='width:0.5em'>B</span></div>"
);

console.assert(
    bbsReader("\x1b[1mA\x1b[33mB\x1b[;33;40mC").html
    == "<div class='line'><span class='f7 b0 l' style='width:0.5em'>A</span><span class='f3 b0 l' style='width:0.5em'>B</span><span class='f3 b0' style='width:0.5em'>C</span></div>"
)
