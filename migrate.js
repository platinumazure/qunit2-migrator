var escodegen = require("escodegen");
var esprima = require("esprima");
var fs = require("fs");

var transform = require("./transform");

function processFile (file) {
    fs.readFile(file, "utf8", function (err, contents) {
        if (err) throw err;

        var syntax = esprima.parse(contents);
        syntax = transform(syntax);

        console.log(JSON.stringify(syntax, null, 2));

        console.log(escodegen.generate(syntax));
    });
}

module.exports = processFile;

if (require.main === module) {
    processFile(process.argv[2]);
}
