var transformHelper = require("./helpers/transformHelper");
var countStops = require("../src/helpers/countStops");

describe("countAsync utility", function () {
    beforeEach(function (done) {
        transformHelper("./spec/fixtures/countStopsFixture.js", function (err, result) {
            if (err) throw err;
            this.result = result;
            done();
        }.bind(this));
    });

    it("should count total async calls correctly", function () {
        expect(countStops(this.result)).toBe(7);
    });
});
