var fs = require("fs");
var recast = require("recast");

var transform = require("./transform");

function processFile (file) {
    fs.readFile(file, "utf8", function (err, contents) {
        if (err) throw err;

        var syntax = recast.parse(contents);
        syntax = transform(syntax);

        console.log(JSON.stringify(syntax, null, 2));

        console.log(recast.print(syntax).code);
    });
}

module.exports = processFile;

if (require.main === module) {
    processFile(process.argv[2]);
}
