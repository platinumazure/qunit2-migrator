var transformHelper = require("./helpers/transformHelper");

describe("Resolving async at the beginning", function () {
    beforeEach(function (done) {
        transformHelper("./spec/fixtures/resolve_async_at_beginning.js", function (err, result) {
            if (err) throw err;
            this.statements = result.body[0].expression.arguments[1].body.body;
            done();
        }.bind(this));
    });

    it("should have moved the done() call to the end", function () {
        var lastStatement = this.statements[this.statements.length - 1];

        expect(lastStatement).toBeDefined();
        expect(lastStatement.type).toBe("ExpressionStatement");
        expect(lastStatement.expression).toBeDefined();
        expect(lastStatement.expression.type).toBe("CallExpression");
        expect(lastStatement.expression.callee).toBeDefined();
        expect(lastStatement.expression.callee.type).toBe("Identifier");
        expect(lastStatement.expression.callee.name).toBe("done");
        expect(lastStatement.expression.arguments).toBeDefined();
        expect(lastStatement.expression.arguments.length).toBe(0);
    });
});

describe("Resolving start at the beginning", function () {
    beforeEach(function (done) {
        transformHelper("./spec/fixtures/resolve_start_at_beginning.js", function (err, result) {
            if (err) throw err;
            this.statements = result.body[0].expression.arguments[1].body.body;
            done();
        }.bind(this));
    });

    it("should have transformed and moved the done() call to the end", function () {
        var lastStatement = this.statements[this.statements.length - 1];

        expect(lastStatement).toBeDefined();
        expect(lastStatement.type).toBe("ExpressionStatement");
        expect(lastStatement.expression).toBeDefined();
        expect(lastStatement.expression.type).toBe("CallExpression");
        expect(lastStatement.expression.callee).toBeDefined();
        expect(lastStatement.expression.callee.type).toBe("Identifier");
        expect(lastStatement.expression.callee.name).toBe("done");
        expect(lastStatement.expression.arguments).toBeDefined();
        expect(lastStatement.expression.arguments.length).toBe(0);
    });
});
