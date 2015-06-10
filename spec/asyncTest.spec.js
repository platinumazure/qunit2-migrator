var transformHelper = require("./helpers/transformHelper");

describe("asyncTest() with no function argument", function () {
    beforeEach(function (done) {
        transformHelper("./spec/fixtures/asyncTest_no_argument.js", function (err, result) {
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

    it("should not add or remove arguments to asyncTest()", function () {
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

describe("asyncTest() with function argument", function () {
    beforeEach(function (done) {
        transformHelper("./spec/fixtures/asyncTest_with_argument.js", function (err, result) {
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

    it("should not add or remove arguments to asyncTest()", function () {
        expect(this.result.arguments.length).toBe(2);
    });

    it("should not modify test name", function () {
        expect(this.result.arguments[0].type).toBe("Literal");
        expect(this.result.arguments[0].value).toBe("A test");
    });

    it("should still have a test callback function", function () {
        expect(this.result.arguments[1].type).toBe("FunctionExpression");
    });

    it("should not modify first parameter to test callback", function () {
        expect(this.result.arguments[1].params.length).toBe(2);
        expect(this.result.arguments[1].params[0].type).toBe("Identifier");
        expect(this.result.arguments[1].params[0].name).toBe("stuff");
    });

    it("should add assert as second parameter to test callback", function () {
        expect(this.result.arguments[1].params.length).toBe(2);
        expect(this.result.arguments[1].params[1].type).toBe("Identifier");
        expect(this.result.arguments[1].params[1].name).toBe("assert");
    });
});

describe("asyncTest() with three function argument", function () {
    beforeEach(function (done) {
        transformHelper("./spec/fixtures/asyncTest_with_three_arguments.js", function (err, result) {
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

    it("should remove one argument from asyncTest()", function () {
        expect(this.result.arguments.length).toBe(2);
    });

    it("should not modify test name", function () {
        expect(this.result.arguments[0].type).toBe("Literal");
        expect(this.result.arguments[0].value).toBe("Create errors are handled correctly");
    });

    it("should still have a test callback function", function () {
        expect(this.result.arguments[1].type).toBe("FunctionExpression");
    });

    it("should add assert parameter to test callback", function () {
        expect(this.result.arguments[1].params.length).toBe(1);
        expect(this.result.arguments[1].params[0].type).toBe("Identifier");
        expect(this.result.arguments[1].params[0].name).toBe("assert");
    });
});
