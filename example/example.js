var fs = require("fs"),
	bbsReader = require("../bbs-reader"),
	uao = require("uao-js");
	
var data = fs.readFileSync("example.ans", "binary"),
	result = bbsReader(data),
	html =`<html><head><meta charset='utf-8'><link rel='stylesheet' href='../bbs-reader.css'></head><body class='bbs'>${result.html}</body></html>`;

fs.writeFileSync("example.html", uao.decodeSync(html), "utf-8");
