var extend = require("extend");
var traverse = require("traverse");

var transformers = [
    require("./transformers/module"),
    require("./transformers/test"),
    require("./transformers/assertions")
];

module.exports = function transform(syntax) {
    traverse(syntax).forEach(function (node) {
        var context = this;
        if (node) {
            transformers.forEach(function (transformer) {
                if (transformer.matches(node, context)) {
                    transformer.onMatch(node, context);
                }
            });
        }
    });

    return syntax;
}
