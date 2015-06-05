var extend = require("extend");
var traverse = require("traverse");

var transformers = [
    require("./transformers/module"),
    require("./transformers/test"),
    require("./transformers/asyncTest"),
    require("./transformers/assertions"),
    require("./transformers/moduleHooks"),
    require("./transformers/moduleHooksAssert"),
    require("./transformers/testWithExpect"),
    require("./transformers/executionFunctionAsync")
];

module.exports = function transform(syntax) {
    traverse(syntax).forEach(function (node) {
        var context = this;
        if (node) {
            transformers.forEach(function (transformer) {
                if (transformer.matches(context)) {
                    transformer.onMatch(context);
                }
            });
        }
    });

    return syntax;
}
