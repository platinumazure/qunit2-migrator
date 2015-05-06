var fs = require("fs");
var esprima = require("esprima");

var transform = require("./transform");

function processFile (file) {
    fs.readFile(file, "utf8", function (err, contents) {
        if (err) throw err;

        var syntax = esprima.parse(contents);
        transform(syntax);

        console.log(syntax);
    });
}

module.exports = processFile;

if (require.main === module) {
    processFile(process.argv[2]);
}
