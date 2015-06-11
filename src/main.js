var fs = require("fs");
var minimist = require("minimist");
var recast = require("recast");
var recursive = require('recursive-readdir');
var deepCopy = require('deepcopy');
var transform = require("./transform");

var VALID_OUTPUT_MODES = ["syntaxTreePreTransform", "syntaxTreePostTransform", "transformedFile"];

function OptionValidationError (message) { this.message = message; }
OptionValidationError.prototype = new Error();

function printUsageAndExit (errorMessage) {
    if (errorMessage) {
        console.log(errorMessage);
        console.log("");
    }

    console.log("Usage: " +
        "node main.js " +
        " [--outputMode=MODE] [--outputFile=FILE | --inPlace] INPUTPATH"
    );

    console.log("");
    console.log("Valid output modes are " +
        VALID_OUTPUT_MODES.map(function (m) { return '"' + m + '"' }).join(", ")
    );
}

function writeOutput (outputFile, contents, callback) {
    if (outputFile) {
        fs.writeFile(outputFile, contents, "utf8", callback);
    } else {
        console.log(contents);
        callback();
    }
}

function onOutput (err) {
    if (err){
        printUsageAndExit(err.message);
        throw err;
    }
}

function validateOptions (options) {
    if (!options.inputPath) {
        throw new OptionValidationError("No input file was provided");
    }

    if (VALID_OUTPUT_MODES.indexOf(options.outputMode) === -1) {
        throw new OptionValidationError("Invalid output mode");
    }

    if ((options.inPlace && options.outputFile) || (options.inPlace && options.outputDirectory)) {
        throw new OptionValidationError(
            "Cannot set inPlace option and provide an output file"
        );
    } else if (options.inPlace) {
        options.outputFile = options.inputPath;
    }
}

function processFile (options) {
    validateOptions(options);

    fs.readFile(options.inputPath, "utf8", function (err, contents) {
        if (err) throw err;

        var syntax = recast.parse(contents);

        switch (options.outputMode) {
            case "syntaxTreePreTransform":
                writeOutput(
                    options.outputFile,
                    JSON.stringify(syntax, null, 4),
                    onOutput
                );
                break;

            case "syntaxTreePostTransform":
                syntax = transform(syntax);
                writeOutput(
                    options.outputFile,
                    JSON.stringify(syntax, null, 4),
                    onOutput
                );
                break;

            case "transformedFile":
                syntax = transform(syntax);
                writeOutput(
                    options.outputFile,
                    recast.print(syntax, { useTabs: true }).code,
                    onOutput
                );
                break;
        }
    });
}

var processDirectory = function(options) {
    var optionsCopy;
    recursive(options.inputPath, ['*.cs', '*.html'], function (error, files) {
        if (error) {
            printUsageAndExit(err && err.message);
            throw err;
        }
        else {
            files.forEach(function (fileName) {
                options.inputPath = fileName;
                optionsCopy = deepCopy(options);
                processFile(optionsCopy);
            });
        }
    });
};

module.exports = processFile;

if (require.main === module) {
    var argv = minimist(process.argv.slice(2), {
        default: {
            outputMode: "transformedFile",
            outputFile: null,
            outputDirectory: null
        },
        boolean: ["inPlace"]
    });

    var options = {
        inputPath: argv._[0],
        outputFile: argv.outputFile,
        outputDirectory: argv.outputDirectory,
        outputMode: argv.outputMode,
        inPlace: argv.inPlace
    };

    try {
        if(fs.lstatSync(options.inputPath).isDirectory()){
            processDirectory(options);
        }
        else{
            processFile(options);
        }
    } catch (err) {
        if (err instanceof OptionValidationError) {
            printUsageAndExit(err && err.message);
        } else {
            throw err;
        }
    }

    // Ensure stdout flushes
    process.on("exit", function (exitCode) {
        process.exit(exitCode);
    });
}
