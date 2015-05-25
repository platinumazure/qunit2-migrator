var extend = require("extend");
var traverse = require("traverse");

var countStops = require("../helpers/countStops");

module.exports = {
    matches: function (context) {
        return context &&
            context.node &&
            context.node.type === "FunctionExpression" &&
            isTestOrModuleHook(context);
    },
    onMatch: function (context) {
        var stopCount = countStops(context.node);

        if (isAsyncTest(context)) {
            ++stopCount;
            context.node.body.body.unshift({
                type: "ExpressionStatement",
                expression: {
                    type: "CallExpression",
                    callee: {
                        type: "Identifier",
                        name: "stop"
                    },
                    arguments: []
                }
            });
        }

        if (!stopCount) {
            return;
        }

        var stopAsyncCallbackNames = generateAsyncCallbackNames(stopCount);
        var startAsyncCallbackNames = generateAsyncCallbackNames(stopCount);

        traverse(context.node.body.body).forEach(function () {
            if (this.node && this.node.type === "CallExpression") {
                if (isStop(this)) {
                    replaceStop(this, stopAsyncCallbackNames.shift());
                } else if (isStart(this)) {
                    replaceStart(this, startAsyncCallbackNames.shift());
                }
            }
        });
    }
};

function isTestOrModuleHook (context) {
    return isTest(context) || isAsyncTest(context) || isModuleHook(context);
}

function isTest (context) {
    var isTest = context.parent &&
        context.parent.parent &&
        context.parent.parent.node &&
        context.parent.parent.node.type === "CallExpression" &&
        context.parent.parent.node.callee &&
        context.parent.parent.node.callee.type === "Identifier" &&
        context.parent.parent.node.callee.name === "test";

    var isQUnitTest = context.parent &&
        context.parent.parent &&
        context.parent.parent.node &&
        context.parent.parent.node.type === "CallExpression" &&
        context.parent.parent.node.callee &&
        context.parent.parent.node.callee.type === "MemberExpression" &&
        context.parent.parent.node.callee.object &&
        context.parent.parent.node.callee.object.type === "Identifier" &&
        context.parent.parent.node.callee.object.name === "QUnit" &&
        context.parent.parent.node.callee.property &&
        context.parent.parent.node.callee.property.type === "Identifier" &&
        context.parent.parent.node.callee.property.name === "test";

    return isTest || isQUnitTest;
}

function isAsyncTest (context) {
    var isAsyncTest = context.parent &&
        context.parent.parent &&
        context.parent.parent.node &&
        context.parent.parent.node.type === "CallExpression" &&
        context.parent.parent.node.callee &&
        context.parent.parent.node.callee.type === "Identifier" &&
        context.parent.parent.node.callee.name === "asyncTest";

    var isQUnitAsyncTest = context.parent &&
        context.parent.parent &&
        context.parent.parent.node &&
        context.parent.parent.node.type === "CallExpression" &&
        context.parent.parent.node.callee &&
        context.parent.parent.node.callee.type === "MemberExpression" &&
        context.parent.parent.node.callee.object &&
        context.parent.parent.node.callee.object.type === "Identifier" &&
        context.parent.parent.node.callee.object.name === "QUnit" &&
        context.parent.parent.node.callee.property &&
        context.parent.parent.node.callee.property.type === "Identifier" &&
        context.parent.parent.node.callee.property.name === "asyncTest";

    return isAsyncTest || isQUnitAsyncTest;
}

function isModuleHook (context) {
    var moduleHookKeys = ["setup", "teardown", "beforeEach", "afterEach"];

    return context.key === "value" &&
        context.parent.type === "Property" &&
        context.parent.node &&
        context.parent.node.key &&
        context.parent.node.key.type === "Identifier" &&
        moduleHookKeys.indexOf(context.parent.node.key.name) !== -1 &&
        context.parent.parent &&
        context.parent.parent.parent &&
        context.parent.parent.parent.node &&
        context.parent.parent.parent.node.type === "ObjectExpression" &&
        context.parent.parent.parent.parent &&
        context.parent.parent.parent.parent.parent &&
        context.parent.parent.parent.parent.parent.node.type === "CallExpression" &&
        context.parent.parent.parent.parent.parent.node.callee &&
        isModule(context.parent.parent.parent.parent.parent.node.callee);
}

function isModule (calleeNode) {
    var isModuleIdentifier = calleeNode.type === "Identifier" &&
        calleeNode.name === "module";

    var isQUnitModuleProperty = calleeNode.type === "MemberExpression" &&
        calleeNode.object &&
        calleeNode.object.type === "Identifier" &&
        calleeNode.object.name === "QUnit" &&
        calleeNode.property &&
        calleeNode.property.type === "Identifier" &&
        calleeNode.property.name === "module";

    return isModuleIdentifier || isQUnitModuleProperty;
}

function generateAsyncCallbackNames (count) {
    if (count === 1) {
        return ["done"];
    } else if (count < 1) {
        throw new RangeError("count must be positive, was " + count);
    }

    var result = [];
    for (var i = 0; i < count; ++i) {
        result.push("done" + (i + 1));
    }

    return result;
}

function isStop (context) {
    var isStop = context.node &&
        context.node.callee &&
        context.node.callee.type === "Identifier" &&
        context.node.callee.name === "stop";

    var isQUnitStop = context.node &&
        context.node.callee &&
        context.node.callee.type === "MemberExpression" &&
        context.node.callee.object &&
        context.node.callee.object.type === "Identifier" &&
        context.node.callee.object.name === "QUnit" &&
        context.node.callee.property &&
        context.node.callee.property.type === "Identifier" &&
        context.node.callee.property.name === "stop";

    return isStop || isQUnitStop;
}

function isStart (context) {
    var isStart = context.node &&
        context.node.callee &&
        context.node.callee.type === "Identifier" &&
        context.node.callee.name === "start";

    var isQUnitStart = context.node &&
        context.node.callee &&
        context.node.callee.type === "MemberExpression" &&
        context.node.callee.object &&
        context.node.callee.object.type === "Identifier" &&
        context.node.callee.object.name === "QUnit" &&
        context.node.callee.property &&
        context.node.callee.property.type === "Identifier" &&
        context.node.callee.property.name === "start";

    return isStart || isQUnitStart;
}

function replaceStop (context, nextCallback) {
    // Preconditon: context is a CallExpression with callee in stop/QUnit.stop
    
    var newNode = {
        type: "VariableDeclaration",
        kind: "var",
        expression: void 0,
        declarations: [
            {
                type: "VariableDeclarator",
                id: nextCallback,
                init: {
                    type: "CallExpression",
                    callee: {
                        type: "MemberExpression",
                        object: {
                            type: "Identifier",
                            name: "assert"
                        },
                        property: {
                            type: "Identifier",
                            name: "async"
                        }
                    },
                    arguments: []
                }
            }
        ]
    };

    // Updating parent because parent was ExpressionStatement and needs to be
    // changed to VariableDeclaration
    context.parent.after(function () {
        this.update(extend({}, this.node, newNode));
    });
}

function replaceStart (context, nextCallback) {
    // Preconditon: context is a CallExpression with callee in start/QUnit.start

    var newNode = {
        type: "CallExpression",
        callee: {
            type: "Identifier",
            name: nextCallback
        },
        arguments: []
    };

    // No need to update parent: ExpressionStatement still works here
    context.update(newNode);
}
