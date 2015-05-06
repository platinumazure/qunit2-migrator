QUnit.module("Simple module");

QUnit.test("Simple test", function (assert) {
    assert.ok(true);
    assert.ok(true, "No problems here");
    assert.strictEqual(2+2, 4, "Addition is cool");
});
