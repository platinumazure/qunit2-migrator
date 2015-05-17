var extend = require("extend");

module.exports = {
    matches: function (context) {
        var node = context.node;

        return node.type === "CallExpression" &&
            node.callee &&
            node.callee.type === "Identifier" &&
            node.callee.name === "module";
    },
    onMatch: function (context) {
        var node = context.node;

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
};
