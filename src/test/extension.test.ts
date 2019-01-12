import * as assert from 'assert';
import * as ext from "../extension";

suite("validation Tests", function () {

    test("normal cases", function() {
        assert.strictEqual(true, ext.validateMarkdown("- \n - a"));
        assert.strictEqual(true, ext.validateMarkdown("- \n  - a"));
        assert.strictEqual(true, ext.validateMarkdown("- a\n - a"));
        assert.strictEqual(true, ext.validateMarkdown("- a\n - a\n"));
        assert.strictEqual(true, ext.validateMarkdown("- a\n  - a"));
        assert.strictEqual(true, ext.validateMarkdown("- \r\n - a"));
        assert.strictEqual(true, ext.validateMarkdown("- \r\n  - a"));
        assert.strictEqual(true, ext.validateMarkdown("- a\r\n - a"));
        assert.strictEqual(true, ext.validateMarkdown("- a\r\n - a\n"));
        assert.strictEqual(true, ext.validateMarkdown("- a\r\n  - a"));
    });

    test("error cases(1 row)", function() {
        assert.strictEqual(false, ext.validateMarkdown(""));
        assert.strictEqual(false, ext.validateMarkdown(" "));
        assert.strictEqual(false, ext.validateMarkdown("\n"));
        assert.strictEqual(false, ext.validateMarkdown("-"));
        assert.strictEqual(false, ext.validateMarkdown("- "));
        assert.strictEqual(false, ext.validateMarkdown("-a"));
        assert.strictEqual(false, ext.validateMarkdown("- a"));
        assert.strictEqual(false, ext.validateMarkdown(" - a"));
        assert.strictEqual(false, ext.validateMarkdown(" -a"));
        assert.strictEqual(false, ext.validateMarkdown("\r\n"));
    });

    test("error cases(2rows)", function() {
        // LF
        assert.strictEqual(false, ext.validateMarkdown("-\n - a"));
        assert.strictEqual(false, ext.validateMarkdown("-\n  - a"));
        assert.strictEqual(false, ext.validateMarkdown("-a\n - a"));
        assert.strictEqual(false, ext.validateMarkdown("-a\n  - a"));
        assert.strictEqual(false, ext.validateMarkdown("- \n -a"));
        assert.strictEqual(false, ext.validateMarkdown("- \n  -a"));
        assert.strictEqual(false, ext.validateMarkdown("- a\n -a"));
        assert.strictEqual(false, ext.validateMarkdown("- a\n  -a"));
        // CRLF
        assert.strictEqual(false, ext.validateMarkdown("-\r\n - a"));
        assert.strictEqual(false, ext.validateMarkdown("-\r\n  - a"));
        assert.strictEqual(false, ext.validateMarkdown("-a\r\n - a"));
        assert.strictEqual(false, ext.validateMarkdown("-a\r\n  - a"));
        assert.strictEqual(false, ext.validateMarkdown("- \r\n -a"));
        assert.strictEqual(false, ext.validateMarkdown("- \r\n  -a"));
        assert.strictEqual(false, ext.validateMarkdown("- a\r\n -a"));
        assert.strictEqual(false, ext.validateMarkdown("- a\r\n  -a"));
    });

});


suite("String to Array Tests", function () {

    test("1 row, 2 cols", function() {
        assert.deepStrictEqual([["th1","th2"],
                                [":------",":------"],
                               ], ext.getNetedArray("- \n - th1\n - th2"));
    });

    test("1 row, 2 cols", function() {
        assert.deepStrictEqual([["th1","th2"],
                                [":------",":------"],
                               ], ext.getNetedArray("- \r\n - th1\r\n - th2"));
    });

    test("2 rows, 2 cols", function() {
        assert.deepStrictEqual([["th1","th2"],
                                [":------",":------"],
                                ["td1","td2"]
                               ], ext.getNetedArray("- \n - th1\n - th2\n- \n - td1\n - td2"));
    });
});

suite("Array to Markdown Table Tests", function () {

    test("1 row, 2 cols (LF)", function() {
        assert.equal("|th1|th2|\n|:------|:------|\n",
                               ext.getTableString([["th1","th2"],
                                                      [":------",":------"]]
                                                      , 1)
                               );
    });

    test("2 rows, 2 cols (LF)", function() {
        assert.equal("|th1|th2|\n|:------|:------|\n|td1|td2|\n",
                               ext.getTableString([["th1","th2"],
                                                      [":------",":------"],
                                                      ["td1","td2"]]
                                                      , 1)
                               );
    });

    test("1 row, 2 cols (CRLF)", function() {
        assert.equal("|th1|th2|\r\n|:------|:------|\r\n",
                               ext.getTableString([["th1","th2"],
                                                      [":------",":------"]]
                                                      , 2)
                               );
    });

    test("2 rows, 2 cols (CRLF)", function() {
        assert.equal("|th1|th2|\r\n|:------|:------|\r\n|td1|td2|\r\n",
                               ext.getTableString([["th1","th2"],
                                                      [":------",":------"],
                                                      ["td1","td2"]]
                                                    , 2)
                               );
    });
});
