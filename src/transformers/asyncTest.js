var extend = require("extend");

module.exports = {
    matches: function (context) {
        var node = context.node;

        var isAsyncTest = node.type === "CallExpression" &&
            node.callee &&
            node.callee.type === "Identifier" &&
            node.callee.name === "asyncTest";

        var isQUnitAsyncTest = node.type === "CallExpression" &&
            node.callee &&
            node.callee.type === "MemberExpression" &&
            node.callee.object &&
            node.callee.object.type === "Identifier" &&
            node.callee.object.name === "QUnit" &&
            node.callee.property &&
            node.callee.property.type === "Identifier" &&
            node.callee.property.name === "asyncTest";

        return isAsyncTest || isQUnitAsyncTest;
    },
    onMatch: function (context) {
        var node = context.node;
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

        context.after(function () {
            this.update(updatedValue);
        });
    }
};
