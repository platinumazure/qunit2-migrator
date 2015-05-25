QUnit.test("A test", function(assert) {
    var done1 = assert.async();
    var done2 = assert.async();
    var done3 = assert.async();
    done1();
    done2();
    done3();
});

