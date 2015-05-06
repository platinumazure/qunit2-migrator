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
