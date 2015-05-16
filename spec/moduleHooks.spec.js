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

    it("should transform teardown to afterEach", function () {
        expect(this.result.properties[1].key.name).toBe("afterEach");
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
