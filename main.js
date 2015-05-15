var fs = require("fs");
var minimist = require("minimist");
var recast = require("recast");

var transform = require("./transform");

function processFile (argv) {
    var file = argv._[0];
    var output = argv.output || "transformedFile";

    if (file) {
        fs.readFile(file, "utf8", function (err, contents) {
            if (err) throw err;

            var syntax = recast.parse(contents);

            switch (output) {
                case "syntaxTreePreTransform":
                    console.log(JSON.stringify(syntax, null, 4));
                    break;

                case "syntaxTreePostTransform":
                    syntax = transform(syntax);
                    console.log(JSON.stringify(syntax, null, 4));
                    break;

                case "transformedFile":
                    syntax = transform(syntax);
                    console.log(recast.print(syntax).code);
                    break;

                default:
                    throw new Error("Invalid output mode");
            }
        });
    } else {
        throw new Error("No file supplied");
    }
}

module.exports = processFile;

if (require.main === module) {
    var argv = minimist(process.argv.slice(2), {
        default: {
            output: null
        }
    });

    processFile(argv);
}
