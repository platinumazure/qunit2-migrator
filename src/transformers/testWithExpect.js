var extend = require("extend");
var traverse = require('traverse');

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

    isExpectNeed: function(node){
        var isExpect, isExpectFoundInBody = false;

        traverse(node).forEach(function (subNode) {
            isExpect = subNode &&
                subNode.type &&
                subNode.type === "ExpressionStatement" &&
                subNode.expression &&
                subNode.expression.type === "CallExpression" &&
                subNode.expression.callee &&
                subNode.expression.callee.type &&
                subNode.expression.callee.type === "Identifier" &&
                subNode.expression.callee.name &&
                subNode.expression.callee.name === "expect" &&
                subNode.expression.arguments &&
                subNode.expression.arguments.length &&
                subNode.expression.arguments.length === 1 &&
                subNode.expression.arguments[0].type &&
                subNode.expression.arguments[0].type === "Literal";
            if (isExpect) {
                isExpectFoundInBody = true;
            }
        });

        return isExpectFoundInBody;
    },

    removeCountArgumentFromTestParameters: function(node){
        var expectCount = node.arguments[1].value;
        node.arguments.splice(1, 1);

        return expectCount;
    },

    addExpectInBody: function(node, expectCount){
        node.arguments[1].body.body.unshift({
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
    },

    onMatch: function (context) {
        var isExpectFoundInBody, expectCount;
        expectCount = this.removeCountArgumentFromTestParameters(context.node);
        isExpectFoundInBody = this.isExpectNeed(context.node);

        if(!isExpectFoundInBody){
            this.addExpectInBody(context.node, expectCount);
        }

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

