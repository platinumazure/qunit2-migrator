module("Simple module");

test("Simple test", function () {
    ok(true);
    ok(true, "No problems here");
    strictEqual(2+2, 4, "Addition is cool");
});
