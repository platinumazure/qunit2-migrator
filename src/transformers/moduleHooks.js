var extend = require("extend");

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

var propertyNameMappings = {
    setup: "beforeEach",
    teardown: "afterEach"
};

module.exports = {
    matches: function (context) {
        return context.node &&
            context.node.type === "Identifier" &&
            propertyNameMappings.hasOwnProperty(context.node.name) &&
            context.key === "key" &&
            context.parent &&
            context.parent.node &&
            context.parent.node.type === "Property" &&
            context.parent.parent &&
            context.parent.parent.parent &&
            context.parent.parent.parent.node.type === "ObjectExpression" &&
            context.parent.parent.parent.parent &&
            context.parent.parent.parent.parent.parent &&
            context.parent.parent.parent.parent.parent.node.type === "CallExpression" &&
            context.parent.parent.parent.parent.parent.node.callee &&
            isModule(context.parent.parent.parent.parent.parent.node.callee);
    },
    onMatch: function (context) {
        context.update(extend({}, context.node, {
            name: propertyNameMappings[context.node.name]
        }));
    }
};
