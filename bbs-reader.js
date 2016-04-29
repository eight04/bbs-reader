// Remove label before colon.
function stripColon(text) {
    var i = text.indexOf(":");
    if (i >= 0) {
        text = text.substr(i).trim();
        if (text[1] == " ") {
            text = text.substr(1).trim();
        }
    }
    return text;
}

// Split right label
function splitLabel(text) {
    var label = "", right = "";
    var i = text.lastIndexOf(":");
    if (i >= 0) {
        right = text.substr(i + 1).trim();
        if (right) {
            text = text.substr(0, i);
            
            i = text.lastIndexOf(" ");
            if (i >= 0) {
                label = text.substr(i + 1);
                if (label) {
                    text = text.substr(0, i);
                }
            }
        }
    }
    return [text, label, right];
}

// create span tag with color
function makeSpan(span) {
    if (!span.text) {
        return "";
    }
    var cls = "f" + span.f + " b" + span.b,
        w = span.text.length;
        
    if (span.l) {
        cls += " l";
    }
    if (span.flash) {
        cls += " flash";
    }
    if (span.halfStart) {
        cls += " half-start";
        w--;
    }
    if (span.halfEnd) {
        cls += " half-end";
        w--;
    }
    cls += " w" + w;
    return "<span class='" + cls + "'>" + escape(span.text) + "</span>";
}

// create head line
function makeHead(lLabel, lText, rLabel, rText) {
    if (!lText) {
        return "";
    }
    
    var fillSpace = 78, result = "<div class='line'>";
    
    fillSpace -= 2 + lLabel.length + 1 + lText.length;
    
    if (rText) {
        fillSpace -= 2 + rLabel.length + 2 + rText.length;
    }
    
    if (fillSpace < 0) {
        fillSpace = 0;
    }
    
    result += makeSpan({f:4,b:7,text:" "+lLabel+" "}) + makeSpan({f:7,b:4,text:" "+lText+" ".repeat(fillSpace)});
    
    if (rText) {
        result += makeSpan({f:4,b:7,text:" "+rLabel+" "}) + makeSpan({f:7,b:4,text:" "+rText+" "});
    }
    
    result += "</div>";
    
    return result;
}

// extract text to color
function extractColor(text, i, color) {
    var re = /\033\[([\d;]*)m/g;
    re.lastIndex = i;
    var match = re.exec(text);
    if (!match || match.index != i) {
        return null;
    }
    var span = {
        l: color.l,
        f: color.f,
        b: color.b,
        flash: color.flash,
        text: "",
        halfStart: false,
        halfEnd: false,
        i: re.lastIndex
    };
    var tokens = match[1].split(";");
    var code;
    for (i = 0; i < tokens.length; i++) {
        code = +tokens[i];
        if (code == 0) {
            span.l = 0;
            span.f = 7;
            span.b = 0;
            span.flash = false;
        } else if (code == 1) {
            span.l = 1;
        } else if (code == 5) {
            span.flash = true;
        } else if (code == 7) {
            var t = span.f;
            span.f = span.b;
            span.b = t;
        } else if (code < 40) {
            span.f = code - 30;
        } else if (code < 50) {
            span.b = code - 40;
        }
    }
    return span;
}

var escapeTable = {
    "<": "&lt",
    "&": "&amp;"
};

// escape character to html entity
function escape(s) {
    var s2 = "", i;
    
    for (i = 0; i < s.length; i++) {
        if (s.charCodeAt(i) & 0x80) {
            // ignore cjk
            s2 += s.substr(i, 2);
            i++;
            continue;
        } else if (escapeTable[s[i]]) {
            s2 += escapeTable[s[i]];
        } else {
            s2 += s[i];
        }
    }
    
    return s2;
}

// convert ansi string into html    
function bbsReader(data) {
    var i = 0, match, result = "";
        
    var author, title, time, label, board;
    
    if ((match = /^(\xa7@\xaa\xcc:.*)\n(.*)\n(.*)\n/.exec(data))) {
        // draw header    
        author = stripColon(match[1]);
        title = stripColon(match[2]);
        time = stripColon(match[3]);
        
        // find board
        var t = splitLabel(author);
        author = t[0];
        label = t[1];
        board = t[2];
        
        // 作者
        result += makeHead("\xa7@\xaa\xcc", author, label, board);
        // 標題
        result += makeHead("\xbc\xd0\xc3D", title);
        // 時間
        result += makeHead("\xae\xc9\xb6\xa1", time);
        
        // ─
        result += "<div class='line'><span class='f6'>" + "\xa2w".repeat(39) + "</span></div>";
        
        i += match[0].length;
    }
    
    var span = {
        l: 0,
        f: 7,
        b: 0,
        flash: false,
        text: "",
        halfStart: false,
        halfEnd: false
    }, pos = 0, cleanLine = false, cjk = false;
    
    result += "<div class='line'>";
    
    for (; i < data.length; i++) {
        // Special color
        if (pos == 0) {
            var ch = data.substr(i, 2);
            if (ch == "\xa1\xb0") {
                // ※
                cleanLine = true;
                span.f = 2;
                span.b = 0;
                span.l = 0;
            } else if (ch == ": ") {
                // : 
                cleanLine = true;
                span.f = 6;
                span.b = 0;
                span.l = 0;
            }
        }
        if (data[i] == "\x1b") {
            // ESC
            var span2 = extractColor(data, i, span);
            if (!span2) {
                span.text += data[i];
                pos++;
            } else if (cjk) {
                span.text += data[span2.i];
                span.halfEnd = true;
                
                result += makeSpan(span);
                
                span2.text += span.text.substring(span.text.length - 2);
                span2.halfStart = true;
                
                pos++;
                i = span2.i;
                span = span2;
                cjk = false;
            } else {
                result += makeSpan(span);
                i = span2.i - 1;
                span = span2;
            }
        } else if (data[i] == "\r") {
            continue;
        } else if (data[i] == "\n") {
            result += makeSpan(span) + "</div><div class='line'>";
            span.text = "";
            span.halfStart = false;
            span.halfEnd = false;
            cjk = false;
            
            if (cleanLine) {
                span.f = 7;
                span.b = 0;
                span.l = 0;
                span.flash = false;
                cleanLine = false;
            }
            
            pos = 0;
        } else {
            if (cjk) {
                cjk = false;
            } else if (data.charCodeAt(i) & 0x80) {
                cjk = true;
            }
            span.text += data[i];
            pos++;
        }
    }
    
    result += makeSpan(span) + "</div>";
    
    return {
        html: result,
        title: title,
        author: author,
        time: time
    };
}

module.exports = bbsReader;
