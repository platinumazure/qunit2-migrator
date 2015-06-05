var extend = require("extend");

module.exports = {
    matches: function (context) {
        var node = context.node;

        var isTest = node.type === "CallExpression" &&
            node.callee &&
            node.callee.type === "Identifier" &&
            node.callee.name === "test";

        var isQUnitTest = node.type === "CallExpression" &&
            node.callee &&
            node.callee.type === "MemberExpression" &&
            node.callee.object &&
            node.callee.object.type === "Identifier" &&
            node.callee.object.name === "QUnit" &&
            node.callee.property &&
            node.callee.property.type === "Identifier" &&
            node.callee.property.name === "test";

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

        var isTestCall = isTest || isQUnitTest || isAsyncTest || isQUnitAsyncTest;

        return isTestCall &&
            node.arguments &&
            node.arguments.length === 3 &&
            node.arguments[1].type === "Literal" &&
            typeof node.arguments[1].value === "number";
    },
    onMatch: function (context) {
        var expectCount = context.node.arguments[1].value;

        context.node.arguments[2].body.body.unshift({
            type: "ExpressionStatement",
            expression: {
                type: "CallExpression",
                callee: {
                    type: "MemberExpression",
                    object: {
                        type: "Identifier",
                        name: "assert"
                    },
                    property: {
                        type: "Identifier",
                        name: "expect"
                    }
                },
                arguments: [
                    {
                        type: "Literal",
                        value: expectCount
                    }
                ]
            }
        });

        var updatedValue = extend({}, context.node, {
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

