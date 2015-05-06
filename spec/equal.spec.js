var transformHelper = require("./helpers/transformHelper");

describe("equal() without message", function () {
    beforeEach(function (done) {
        transformHelper("./spec/fixtures/equal_no_message.js", function (err, result) {
            if (err) throw err;
            this.result = result.body[0].expression;
            done();
        }.bind(this));
    });

    it("should transform callee into assert.equal()", function () {
        expect(this.result.callee.type).toBe("MemberExpression");
        expect(this.result.callee.object).toEqual({
            type: "Identifier",
            name: "assert"
        });
        expect(this.result.callee.property).toEqual({
            type: "Identifier",
            name: "equal"
        });
    });

    it("should not add or remove arguments", function () {
        expect(this.result.arguments.length).toBe(2);
    });

    it("should not modify actual", function () {
        expect(this.result.arguments[0].type).toBe("Identifier");
        expect(this.result.arguments[0].name).toBe("foo");
    });

    it("should not modify expected", function () {
        expect(this.result.arguments[1].type).toBe("Literal");
        expect(this.result.arguments[1].value).toBe(4);
    });
});

describe("equal() with message", function () {
    beforeEach(function (done) {
        transformHelper("./spec/fixtures/equal_with_message.js", function (err, result) {
            if (err) throw err;
            this.result = result.body[0].expression;
            done();
        }.bind(this));
    });

    it("should transform callee into assert.equal()", function () {
        expect(this.result.callee.type).toBe("MemberExpression");
        expect(this.result.callee.object).toEqual({
            type: "Identifier",
            name: "assert"
        });
        expect(this.result.callee.property).toEqual({
            type: "Identifier",
            name: "equal"
        });
    });

    it("should not add or remove arguments", function () {
        expect(this.result.arguments.length).toBe(3);
    });

    it("should not modify actual", function () {
        expect(this.result.arguments[0].type).toBe("Identifier");
        expect(this.result.arguments[0].name).toBe("foo");
    });

    it("should not modify expected", function () {
        expect(this.result.arguments[1].type).toBe("Literal");
        expect(this.result.arguments[1].value).toBe(4);
    });

    it("should not modify message", function () {
        expect(this.result.arguments[2].type).toBe("Literal");
        expect(this.result.arguments[2].value).toBe("Message");
    });
});
