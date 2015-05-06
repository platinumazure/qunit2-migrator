var extend = require("extend");
var traverse = require("traverse");

var transformers = [
    {
        matches: function (node) {
            return node.type === "CallExpression" &&
                node.callee &&
                node.callee.type === "Identifier" &&
                node.callee.name === "module";
        },
        onMatch: function (node, context) {
            var updatedValue = extend({}, node, {
                callee: {
                    type: "MemberExpression",
                    computed: false,
                    object: {
                        type: "Identifier",
                        name: "QUnit"
                    },
                    property: {
                        type: "Identifier",
                        name: "module"
                    }
                }
            });

            context.update(updatedValue);
        }
    },
    {
        matches: function (node) {
            return node.type === "CallExpression" &&
                node.callee &&
                node.callee.type === "Identifier" &&
                node.callee.name === "test";
        },
        onMatch: function (node, context) {
            var shouldAddAssert = node.arguments &&
                node.arguments[1] &&
                node.arguments[1].params &&
                node.arguments[1].params.length === 0;

            if (shouldAddAssert) {
                node.arguments[1].params.push({
                    type: "Identifier",
                    name: "assert"
                });
            }

            var updatedValue = extend({}, node, {
                callee: {
                    type: "MemberExpression",
                    computed: false,
                    object: {
                        type: "Identifier",
                        name: "QUnit"
                    },
                    property: {
                        type: "Identifier",
                        name: "test"
                    }
                }
            });

            context.update(updatedValue);
        }
    }
];

module.exports = function transform(syntax) {
    traverse(syntax).forEach(function (node) {
        var context = this;
        if (node) {
            transformers.forEach(function (transformer) {
                if (transformer.matches(node)) {
                    transformer.onMatch(node, context);
                }
            });
        }
    });

    return syntax;
}
