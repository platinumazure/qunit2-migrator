var recast = require("recast");
var fs = require("fs");
var transform = require("../../src/transform");

module.exports = function (filePath, callback) {
    fs.readFile(filePath, "utf8", function (err, fileContents) {
        if (err) return callback(err);

        var syntax = recast.parse(fileContents);
        callback(null, transform(syntax).program);
    });
};
