QUnit.test("An async test", function(assert) {
    var done = assert.async();
    done();
});

