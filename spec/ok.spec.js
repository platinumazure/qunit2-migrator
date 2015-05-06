var transformHelper = require("./helpers/transformHelper");

describe("ok() without message", function () {
    beforeEach(function (done) {
        transformHelper("./spec/fixtures/ok_no_message.js", function (err, result) {
            if (err) throw err;
            this.result = result.body[0].expression;
            done();
        }.bind(this));
    });

    it("should transform callee into assert.ok()", function () {
        expect(this.result.callee.type).toBe("MemberExpression");
        expect(this.result.callee.object).toEqual({
            type: "Identifier",
            name: "assert"
        });
        expect(this.result.callee.property).toEqual({
            type: "Identifier",
            name: "ok"
        });
    });

    it("should not add or remove arguments", function () {
        expect(this.result.arguments.length).toBe(1);
    });

    it("should not modify assertion", function () {
        expect(this.result.arguments[0].type).toBe("Literal");
        expect(this.result.arguments[0].value).toBe(true);
    });
});

describe("ok() with message", function () {
    beforeEach(function (done) {
        transformHelper("./spec/fixtures/ok_with_message.js", function (err, result) {
            if (err) throw err;
            this.result = result.body[0].expression;
            done();
        }.bind(this));
    });

    it("should transform callee into assert.ok()", function () {
        expect(this.result.callee.type).toBe("MemberExpression");
        expect(this.result.callee.object).toEqual({
            type: "Identifier",
            name: "assert"
        });
        expect(this.result.callee.property).toEqual({
            type: "Identifier",
            name: "ok"
        });
    });

    it("should not add or remove arguments", function () {
        expect(this.result.arguments.length).toBe(2);
    });

    it("should not modify assertion", function () {
        expect(this.result.arguments[0].type).toBe("Literal");
        expect(this.result.arguments[0].value).toBe(true);
    });

    it("should not modify message", function () {
        expect(this.result.arguments[1].type).toBe("Literal");
        expect(this.result.arguments[1].value).toBe("Message");
    });
});
