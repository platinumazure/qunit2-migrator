var esprima = require("esprima");
var fs = require("fs");
var transform = require("../../transform");

module.exports = function (filePath, callback) {
    fs.readFile(filePath, "utf8", function (err, fileContents) {
        if (err) return callback(err);

        var syntax = esprima.parse(fileContents);
        callback(null, transform(syntax));
    });
}
