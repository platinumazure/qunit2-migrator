var extend = require("extend");

var assertions = ["ok", "notOk", "equal", "notEqual", "strictEqual",
    "notStrictEqual", "deepEqual", "notDeepEqual", "propEqual", "notPropEqual",
    "throws", "raises", "expect"];

module.exports = {
    matches: function (context) {
        var node = context.node;

        return node.type === "CallExpression" &&
            node.callee &&
            node.callee.type === "Identifier" &&
            assertions.indexOf(node.callee.name) !== -1;
    },
    onMatch: function (context) {
        var node = context.node;
        var memberName = node.callee.name;

        var updatedValue = extend({}, node, {
            callee: {
                type: "MemberExpression",
                computed: false,
                object: {
                    type: "Identifier",
                    name: "assert"
                },
                property: {
                    type: "Identifier",
                    name: memberName
                }
            }
        });

        context.update(updatedValue);
    }
};
