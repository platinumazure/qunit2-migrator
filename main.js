var fs = require("fs");
var minimist = require("minimist");
var recast = require("recast");

var transform = require("./transform");

var outputFile;

function writeOutput (contents, callback) {
    if (outputFile) {
        fs.writeFile(outputFile, contents, "utf8", callback);
    } else {
        console.log(contents);
        callback();
    }
}

function onOutput (err) {
    if (err) throw err;
    process.exit(0);
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
                    writeOutput(JSON.stringify(syntax, null, 4), onOutput);
                    break;

                case "syntaxTreePostTransform":
                    syntax = transform(syntax);
                    writeOutput(JSON.stringify(syntax, null, 4), onOutput);
                    break;

                case "transformedFile":
                    syntax = transform(syntax);
                    writeOutput(recast.print(syntax).code, onOutput);
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

    // Ensure stdout flushes
    process.on("exit", function (exitCode) {
        process.exit(exitCode);
    });
}
