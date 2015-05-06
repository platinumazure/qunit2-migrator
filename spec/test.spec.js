var transformHelper = require("./helpers/transformHelper");

describe("test() with no function argument", function () {
    beforeEach(function (done) {
        transformHelper("./spec/fixtures/test.js", function (err, result) {
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

    it("should not add or remove function arguments", function () {
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
});
