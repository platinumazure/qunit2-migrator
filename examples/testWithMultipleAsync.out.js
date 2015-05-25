QUnit.test("A test", function (assert) {
    // arrange
    var done1 = assert.async();
    var done2 = assert.async();

    // assert
    done1();
    done2();
});
