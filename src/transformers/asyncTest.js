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

    isArgumentFunction: function(argument){
        var isFunction = false;
        if(argument.type === "FunctionExpression" && argument.params){
            isFunction = true;
        }

        return isFunction;
    },

    /**
     * Three parameters in asyncTest function.
     * asyncTest: function (testName, expected, callback)
     */
    addAssert: function(node){
        var i;
        if(node.arguments && node.arguments.length && node.arguments.length > 1){
            for(i = 1; i < node.arguments.length; i++){
                if(this.isArgumentFunction(node.arguments[i])){
                    node.arguments[i].params.push({
                        type: "Identifier",
                        name: "assert"
                    });
                }
            }
        }
    },

    onMatch: function (context) {
        var node = context.node;

        this.addAssert(node);

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
