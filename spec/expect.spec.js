var transformHelper = require("./helpers/transformHelper");

describe("expect()", function () {
    beforeEach(function (done) {
        transformHelper("./spec/fixtures/expect.js", function (err, result) {
            if (err) throw err;
            this.result = result.body[0].expression;
            done();
        }.bind(this));
    });

    it("should transform callee into assert.expect()", function () {
        expect(this.result.callee.type).toBe("MemberExpression");
        expect(this.result.callee.object).toEqual({
            type: "Identifier",
            name: "assert"
        });
        expect(this.result.callee.property).toEqual({
            type: "Identifier",
            name: "expect"
        });
    });

    it("should not add or remove arguments", function () {
        expect(this.result.arguments.length).toBe(1);
    });

    it("should not modify expect count", function () {
        expect(this.result.arguments[0].type).toBe("Literal");
        expect(this.result.arguments[0].value).toBe(2);
    });
});

describe("expect() in test body and in list of asyncTest() parameters", function () {
    beforeEach(function (done) {
        transformHelper("./spec/fixtures/multipleExpect.js", function (err, result) {
            if (err) throw err;
            this.result = result.body[0].expression;
            done();
        }.bind(this));
    });

    it("should transform function call to QUnit.test()", function () {
        expect(this.result.callee.type).toBe("MemberExpression");
        expect(this.result.callee.object).toEqual({
            type: "Identifier",
            name: "QUnit"
        });
        expect(this.result.callee.property).toEqual({
            type: "Identifier",
            name: "test"
        });
    });

    it("should remove expect count argument from asyncTest()", function () {
        expect(this.result.arguments.length).toBe(2);
    });

    it("should not modify test name", function () {
        expect(this.result.arguments[0].type).toBe("Literal");
        expect(this.result.arguments[0].value).toBe("A test");
    });

    it("should still have a test callback function", function () {
        expect(this.result.arguments[1].type).toBe("FunctionExpression");
    });

    it("should add an assert parameter to test callback", function () {
        expect(this.result.arguments[1].params.length).toBe(1);
        expect(this.result.arguments[1].params[0].type).toBe("Identifier");
        expect(this.result.arguments[1].params[0].name).toBe("assert");
    });

    it("should add in body done() and expect() functions", function () {
        expect(this.result.arguments[1].body.body.length).toBe(2);
        expect(this.result.arguments[1].body.body[0].declarations).toBeDefined();
        expect(this.result.arguments[1].body.body[0].declarations.length).toBe(1);
        expect(this.result.arguments[1].body.body[0].declarations[0]).toBeDefined();
        expect(this.result.arguments[1].body.body[0].declarations[0].id).toBeDefined();
        expect(this.result.arguments[1].body.body[0].declarations[0].id.type).toBe("Identifier");
        expect(this.result.arguments[1].body.body[0].declarations[0].id.name).toBe("done");
        expect(this.result.arguments[1].body.body[1].type).toBe("ExpressionStatement");
        expect(this.result.arguments[1].body.body[1].expression.type).toBe("CallExpression");
        expect(this.result.arguments[1].body.body[1].expression.callee.object.name).toBe("assert");
        expect(this.result.arguments[1].body.body[1].expression.callee.property.name).toBe("expect");
        expect(this.result.arguments[1].body.body[1].expression.arguments[0].type).toBe("Literal");
        expect(this.result.arguments[1].body.body[1].expression.arguments[0].value).toBe(1);
    });
});
