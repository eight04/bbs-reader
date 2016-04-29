var fs = require("fs"),
	bbsReader = require("../bbs-reader"),
	uao = require("uao-js");
	
fs.readFile("example.ans", "binary", function(err, data) {
	if (err) {
		throw err;
	}
	data = bbsReader(data);
	data = "<html><head><meta charset='utf-8'><link rel='stylesheet' href='../bbs-reader.css'></head><body>" + data.html + "</body></html>"
	data = uao.decode(data);
	fs.writeFile("example.html", data, "utf-8");
});