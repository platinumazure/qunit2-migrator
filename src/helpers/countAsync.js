var traverse = require("traverse");

module.exports = function countAsync (outerNode) {
    return traverse(outerNode).reduce(function (accum, node) {
        if (node && isStopCall(node)) {
            var count = node.arguments.length ? node.arguments[0].value : 1;
            return accum + count;
        }

        return accum;
    }, 0);
};

function isStopCall(node) {
    return node.type === "CallExpression" &&
        node.callee &&
        isStopCallee(node.callee);
}

function isStopCallee(calleeNode) {
    var isStop = calleeNode.type === "Identifier" &&
        calleeNode.name === "stop";

    var isQUnitStop = calleeNode.type === "MemberExpression" &&
        calleeNode.object &&
        calleeNode.object.type === "Identifier" &&
        calleeNode.object.name === "QUnit" &&
        calleeNode.property &&
        calleeNode.property.type === "Identifier" &&
        calleeNode.property.name === "stop";

    return isStop || isQUnitStop;
}
