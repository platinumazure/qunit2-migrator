var transformHelper = require("./helpers/transformHelper");

describe("module()", function () {
    beforeEach(function (done) {
        transformHelper("./spec/fixtures/module.js", function (err, result) {
            if (err) throw err;
            this.result = result.body[0].expression;
            done();
        }.bind(this));
    });

    it("blah", function () {
        expect(this.result).toBeDefined();
    });

    it("should transform callee to QUnit.module", function () {
        expect(this.result.callee.type).toBe("MemberExpression");
        expect(this.result.callee.object).toEqual({
            type: "Identifier",
            name: "QUnit"
        });
        expect(this.result.callee.property).toEqual({
            type: "Identifier",
            name: "module"
        });
    });

    it("should not modify arguments", function () {
        expect(this.result.arguments.length).toBe(1);
        expect(this.result.arguments[0].type).toBe("Literal");
        expect(this.result.arguments[0].value).toBe("A module");
    });
});
