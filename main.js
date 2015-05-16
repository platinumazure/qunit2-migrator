var fs = require("fs");
var minimist = require("minimist");
var recast = require("recast");

var transform = require("./transform");

var outputFile;

function writeOutput (contents) {
    if (outputFile) {
        fs.writeFile(outputFile, contents, "utf8", function (err, contents) {
            if (err) throw err;
        });
    } else {
        console.log(contents);
    }
}

function processFile (argv) {
    var inputFile = argv._[0];
    outputFile = argv.outputFile;

    if (inputFile) {
        fs.readFile(inputFile, "utf8", function (err, contents) {
            if (err) throw err;

            var syntax = recast.parse(contents);

            switch (argv.outputMode) {
                case "syntaxTreePreTransform":
                    writeOutput(JSON.stringify(syntax, null, 4));
                    break;

                case "syntaxTreePostTransform":
                    syntax = transform(syntax);
                    writeOutput(JSON.stringify(syntax, null, 4));
                    break;

                case "transformedFile":
                    syntax = transform(syntax);
                    writeOutput(recast.print(syntax).code);
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
            outputMode: "transformedFile",
            outputFile: null
        }
    });

    processFile(argv);
}
