var transformHelper = require("./helpers/transformHelper");

describe("setup/teardown in module declaration", function () {
    beforeEach(function (done) {
        transformHelper("./spec/fixtures/setup_teardown.js", function (err, result) {
            if (err) throw err;
            this.result = result.body[0].expression.arguments[1];
            done();
        }.bind(this));
    });

    it("should transform setup to beforeEach", function () {
        expect(this.result.properties[0].key.name).toBe("beforeEach");
    });

    it("should add assert argument to beforeEach", function () {
        expect(this.result.properties[0].value.type).toBe("FunctionExpression");
        expect(this.result.properties[0].value.params.length).toBe(1);
        expect(this.result.properties[1].value.params[0]).toBe("assert");
    });

    it("should transform teardown to afterEach", function () {
        expect(this.result.properties[1].key.name).toBe("afterEach");
    });

    it("should add assert argument to afterEach", function () {
        expect(this.result.properties[1].value.type).toBe("FunctionExpression");
        expect(this.result.properties[1].value.params.length).toBe(1);
        expect(this.result.properties[1].value.params[0]).toBe("assert");
    });
});

describe("setup with async calls", function () {
    beforeEach(function (done) {
        transformHelper("./spec/fixtures/setup_async.js", function (err, result) {
            if (err) throw err;
            this.result = result.body[0].expression.arguments[1];
            done();
        }.bind(this));
    });

    it("should transform stop() into assert.async() declaration", function () {
        var declaration = this.result.properties[0].value.body.body[0];
        expect(declaration.type).toBe("VariableDeclaration");
        expect(declaration.kind).toBe("var");
        expect(declaration.declarations.length).toBe(1);
        expect(declaration.declarations[0].id).toBeDefined();
        expect(declaration.declarations[0].id.type).toBe("Identifier");
        expect(declaration.declarations[0].id.name).toBe("done");
        expect(declaration.declarations[0].init).not.toEqual(null);
        expect(declaration.declarations[0].init.type).toBe("CallExpression");
        expect(declaration.declarations[0].init.callee).not.toEqual(null);
        expect(declaration.declarations[0].init.callee.type).toBe("MemberExpression");
        expect(declaration.declarations[0].init.callee.object.type).toBe("Identifier");
        expect(declaration.declarations[0].init.callee.object.name).toBe("assert");
        expect(declaration.declarations[0].init.callee.property.type).toBe("Identifier");
        expect(declaration.declarations[0].init.callee.property.name).toBe("async");
        expect(declaration.declarations[0].init.arguments.length).toBe(0);
    });

    it("should transform start() into async callback invocation", function () {
        var expression = this.result.properties[0].value.body.body[1];
        expect(expression.type).toBe("ExpressionStatement");
        expect(expression.expression.type).toBe("CallExpression");
        expect(expression.expression.callee).not.toEqual(null);
        expect(expression.expression.callee.type).toBe("Identifier");
        expect(expression.expression.callee.name).toBe("done");
        expect(expression.expression.arguments.length).toBe(0);
    });
});

describe("teardown with async calls", function () {
    beforeEach(function (done) {
        transformHelper("./spec/fixtures/teardown_async.js", function (err, result) {
            if (err) throw err;
            this.result = result.body[0].expression.arguments[1];
            done();
        }.bind(this));
    });

    it("should transform stop() into assert.async() declaration", function () {
        var declaration = this.result.properties[0].value.body.body[0];
        expect(declaration.type).toBe("VariableDeclaration");
        expect(declaration.kind).toBe("var");
        expect(declaration.declarations.length).toBe(1);
        expect(declaration.declarations[0].id).toBeDefined();
        expect(declaration.declarations[0].id.type).toBe("Identifier");
        expect(declaration.declarations[0].id.name).toBe("done");
        expect(declaration.declarations[0].init).not.toEqual(null);
        expect(declaration.declarations[0].init.type).toBe("CallExpression");
        expect(declaration.declarations[0].init.callee).not.toEqual(null);
        expect(declaration.declarations[0].init.callee.type).toBe("MemberExpression");
        expect(declaration.declarations[0].init.callee.object.type).toBe("Identifier");
        expect(declaration.declarations[0].init.callee.object.name).toBe("assert");
        expect(declaration.declarations[0].init.callee.property.type).toBe("Identifier");
        expect(declaration.declarations[0].init.callee.property.name).toBe("async");
        expect(declaration.declarations[0].init.arguments.length).toBe(0);
    });

    it("should transform start() into async callback invocation", function () {
        var expression = this.result.properties[0].value.body.body[1];
        expect(expression.type).toBe("ExpressionStatement");
        expect(expression.expression.type).toBe("CallExpression");
        expect(expression.expression.callee).not.toEqual(null);
        expect(expression.expression.callee.type).toBe("Identifier");
        expect(expression.expression.callee.name).toBe("done");
        expect(expression.expression.arguments.length).toBe(0);
    });
});

describe("setup with async calls (QUnit.module)", function () {
    beforeEach(function (done) {
        transformHelper("./spec/fixtures/setup_async_qunitmodule.js", function (err, result) {
            if (err) throw err;
            this.result = result.body[0].expression.arguments[1];
            done();
        }.bind(this));
    });

    it("should transform stop() into assert.async() declaration", function () {
        var declaration = this.result.properties[0].value.body.body[0];
        expect(declaration.type).toBe("VariableDeclaration");
        expect(declaration.kind).toBe("var");
        expect(declaration.declarations.length).toBe(1);
        expect(declaration.declarations[0].id).toBeDefined();
        expect(declaration.declarations[0].id.type).toBe("Identifier");
        expect(declaration.declarations[0].id.name).toBe("done");
        expect(declaration.declarations[0].init).not.toEqual(null);
        expect(declaration.declarations[0].init.type).toBe("CallExpression");
        expect(declaration.declarations[0].init.callee).not.toEqual(null);
        expect(declaration.declarations[0].init.callee.type).toBe("MemberExpression");
        expect(declaration.declarations[0].init.callee.object.type).toBe("Identifier");
        expect(declaration.declarations[0].init.callee.object.name).toBe("assert");
        expect(declaration.declarations[0].init.callee.property.type).toBe("Identifier");
        expect(declaration.declarations[0].init.callee.property.name).toBe("async");
        expect(declaration.declarations[0].init.arguments.length).toBe(0);
    });

    it("should transform start() into async callback invocation", function () {
        var expression = this.result.properties[0].value.body.body[1];
        expect(expression.type).toBe("ExpressionStatement");
        expect(expression.expression.type).toBe("CallExpression");
        expect(expression.expression.callee).not.toEqual(null);
        expect(expression.expression.callee.type).toBe("Identifier");
        expect(expression.expression.callee.name).toBe("done");
        expect(expression.expression.arguments.length).toBe(0);
    });
});

describe("teardown with async calls (QUnit.module)", function () {
    beforeEach(function (done) {
        transformHelper("./spec/fixtures/teardown_async_qunitmodule.js", function (err, result) {
            if (err) throw err;
            this.result = result.body[0].expression.arguments[1];
            done();
        }.bind(this));
    });

    it("should transform stop() into assert.async() declaration", function () {
        var declaration = this.result.properties[0].value.body.body[0];
        expect(declaration.type).toBe("VariableDeclaration");
        expect(declaration.kind).toBe("var");
        expect(declaration.declarations.length).toBe(1);
        expect(declaration.declarations[0].id).toBeDefined();
        expect(declaration.declarations[0].id.type).toBe("Identifier");
        expect(declaration.declarations[0].id.name).toBe("done");
        expect(declaration.declarations[0].init).not.toEqual(null);
        expect(declaration.declarations[0].init.type).toBe("CallExpression");
        expect(declaration.declarations[0].init.callee).not.toEqual(null);
        expect(declaration.declarations[0].init.callee.type).toBe("MemberExpression");
        expect(declaration.declarations[0].init.callee.object.type).toBe("Identifier");
        expect(declaration.declarations[0].init.callee.object.name).toBe("assert");
        expect(declaration.declarations[0].init.callee.property.type).toBe("Identifier");
        expect(declaration.declarations[0].init.callee.property.name).toBe("async");
        expect(declaration.declarations[0].init.arguments.length).toBe(0);
    });

    it("should transform start() into async callback invocation", function () {
        var expression = this.result.properties[0].value.body.body[1];
        expect(expression.type).toBe("ExpressionStatement");
        expect(expression.expression.type).toBe("CallExpression");
        expect(expression.expression.callee).not.toEqual(null);
        expect(expression.expression.callee.type).toBe("Identifier");
        expect(expression.expression.callee.name).toBe("done");
        expect(expression.expression.arguments.length).toBe(0);
    });
});

describe("setup/teardown outside of module declaration", function () {
    beforeEach(function (done) {
        transformHelper("./spec/fixtures/setup_teardown_not_in_module.js", function (err, result) {
            if (err) throw err;
            this.result = result.body[0].declarations[0].init;
            done();
        }.bind(this));
    });

    it("should NOT transform setup to beforeEach", function () {
        expect(this.result.properties[0].key.name).toBe("setup");
    });

    it("should NOT transform teardown to afterEach", function () {
        expect(this.result.properties[1].key.name).toBe("teardown");
    });
});
