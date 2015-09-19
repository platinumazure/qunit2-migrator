var assert = require("assert");
var extend = require("extend");

module.exports = {
    matches: function (context) {
        return context &&
            context.node &&
            context.node.type === "FunctionExpression" &&
            isTestOrModuleHook(context);
    },
    onMatch: function (context) {
        var asyncResolveStatements = [];
        var assertContextVar = context.node.params[0].name;
        var statements = context.node.body.body;
        var callbackNames = [];
        var i;

        for (i = 0; i < statements.length; ++i) {
            if (isAsyncResolution(statements[i], callbackNames)) {
                asyncResolveStatements.push.apply(asyncResolveStatements, statements.splice(i, 1));

                // Avoid skipping next statement
                --i;
            } else if (isAsyncCall(statements[i], assertContextVar)) {
                callbackNames.push.apply(callbackNames, getAsyncCallbackNames(statements[i], assertContextVar));
            }
        }

        for (i = 0; i < asyncResolveStatements.length; ++i) {
            statements.push(asyncResolveStatements[i]);
        }

        var newNode = extend({}, context.node);
        newNode.body.body = statements;

        context.after(function () {
            this.update(newNode);
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
        context.parent.node &&
        context.parent.node.type === "Property" &&
        context.parent.node.key &&
        context.parent.node.key.type === "Identifier" &&
        moduleHookKeys.indexOf(context.parent.node.key.name) !== -1 &&
        context.parent.parent &&
        context.parent.parent.parent &&
        context.parent.parent.parent.node &&
        context.parent.parent.parent.node.type === "ObjectExpression" &&
        context.parent.parent.parent.parent &&
        context.parent.parent.parent.parent.parent &&
        context.parent.parent.parent.parent.parent.node &&
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

function isAsyncResolution (statement, callbackNames) {
    return statement &&
        statement.type === "ExpressionStatement" &&
        statement.expression &&
        statement.expression.type === "CallExpression" &&
        statement.expression.callee &&
        statement.expression.callee.type === "Identifier" &&
        callbackNames.indexOf(statement.expression.callee.name) !== -1;
}

function isAsyncCall (statement, assertContextVar) {
    if (!assertContextVar) {
        assertContextVar = "assert";
    }

    return isAsyncCallDeclaration(statement, assertContextVar) ||
        isAsyncCallAssignment(statement, assertContextVar);
}

function isAsyncCallDeclaration(statement, assertContextVar) {
    return statement &&
        statement.type === "VariableDeclaration" &&
        statement.declarations &&
        statement.declarations.filter(function (decl) {
            return isAsyncCallExpression(decl.init, assertContextVar);
        }).length;
}

function isAsyncCallAssignment(statement, assertContextVar) {
    return statement &&
        statement.type === "ExpressionStatement" &&
        statement.expression &&
        statement.expression.type === "AssignmentExpression" &&
        statement.expression.right &&
        isAsyncCallExpression(statement.expression.right, assertContextVar);
}

function isAsyncCallExpression (callExpressionNode, assertContextVar) {
    return callExpressionNode &&
        callExpressionNode.type === "CallExpression" &&
        callExpressionNode.callee &&
        callExpressionNode.callee.type === "MemberExpression" &&
        callExpressionNode.callee.object &&
        callExpressionNode.callee.object.type === "Identifier" &&
        callExpressionNode.callee.object.name === assertContextVar &&
        callExpressionNode.callee.property.type === "Identifier" &&
        callExpressionNode.callee.property.name === "async";
}

function getAsyncCallbackNames (statement, assertContextVar) {
    assert(statement.type === "VariableDeclaration" ||
        (statement.type === "ExpressionStatement" &&
            statement.expression.type === "AssignmentExpression")
    );

    if (statement.type === "ExpressionStatement") {
        return statement.expression.left.name;
    } else {
        return statement.declarations.filter(function (decl) {
            return isAsyncCallExpression(decl.init, assertContextVar);
        }).map(function (decl) {
            return decl.id.name;
        });
    }
}
