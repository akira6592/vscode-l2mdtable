import * as assert from 'assert';
import * as ext from "../extension";


suite("empty Test", function () {

    test("true cases (1 line)", function() {
        assert.equal(true, ext.checkEmpty(""));
        assert.equal(true, ext.checkEmpty(" "));
        assert.equal(true, ext.checkEmpty("  "));

        // LF
        assert.equal(true, ext.checkEmpty("\n"));
        assert.equal(true, ext.checkEmpty(" \n"));
        assert.equal(true, ext.checkEmpty("  \n"));
        assert.equal(true, ext.checkEmpty("- \n"));  // no childs
        // CRLF
        assert.equal(true, ext.checkEmpty("\r\n"));
        assert.equal(true, ext.checkEmpty(" \r\n"));
        assert.equal(true, ext.checkEmpty("  \r\n"));
        assert.equal(true, ext.checkEmpty("- \r\n"));  // no childs
    });

    test("true cases (multi lines)", function() {
        // LF
        assert.equal(true, ext.checkEmpty("\n  \n"));
        assert.equal(true, ext.checkEmpty(" \n  \n"));
        assert.equal(true, ext.checkEmpty("  \n  \n"));
        assert.equal(true, ext.checkEmpty(" \n  \n  "));
        assert.equal(true, ext.checkEmpty("  \n  \n  "));
        assert.equal(true, ext.checkEmpty("- \n \n"));  // no childs
        assert.equal(true, ext.checkEmpty("  \n- \n \n"));  // no childs
        // CRLF
        assert.equal(true, ext.checkEmpty("\r\n  \r\n"));
        assert.equal(true, ext.checkEmpty(" \r\n  \r\n"));
        assert.equal(true, ext.checkEmpty("  \r\n  \r\n"));
        assert.equal(true, ext.checkEmpty(" \r\n  \r\n  "));
        assert.equal(true, ext.checkEmpty("  \r\n  \r\n  "));
        assert.equal(true, ext.checkEmpty("- \r\n \r\n"));  // no childs
        assert.equal(true, ext.checkEmpty("  \r\n- \r\n \r\n"));  // no childs
    });

    test("false cases (1 line)", function() {
        assert.equal(false, ext.checkEmpty("a"));
        assert.equal(false, ext.checkEmpty("ab"));
        // LF
        assert.equal(false, ext.checkEmpty("a\n"));
        assert.equal(false, ext.checkEmpty("ab\n"));        
        // CRLF
        assert.equal(false, ext.checkEmpty("a\r\n"));
        assert.equal(false, ext.checkEmpty("ab\r\n"));
    });

    test("false cases (multi lines)", function() {
        // LF
        assert.equal(false, ext.checkEmpty(" \na"));
        assert.equal(false, ext.checkEmpty("  \nab"));        
        assert.equal(false, ext.checkEmpty("a\na"));
        assert.equal(false, ext.checkEmpty("ab\nab"));        
        // CRLF
        assert.equal(false, ext.checkEmpty(" \r\na"));
        assert.equal(false, ext.checkEmpty("  \r\nab"));
        assert.equal(false, ext.checkEmpty("a\r\na"));
        assert.equal(false, ext.checkEmpty("ab\r\nab"));
    });

});

suite("validation Tests", function () {

    test("normal cases", function() {
        // space at first "-" 
        assert.deepStrictEqual([], ext.validateMarkdown([
                                                            {line: 1, text:"- "},
                                                            {line: 2, text:" - a"}
                                                        ]));
        assert.deepStrictEqual([], ext.validateMarkdown([
                                                            {line: 1, text:"- a"},
                                                            {line: 2, text:" - a"},
                                                            {line: 3, text:" -  a"}
                                                        ]));
        // no space at first "-" 
        assert.deepStrictEqual([], ext.validateMarkdown([
                                                            {line: 1, text:"-"},
                                                            {line: 2, text:" - a"}
                                                        ]));
        assert.deepStrictEqual([], ext.validateMarkdown([
                                                            {line: 1, text:"-a"},
                                                            {line: 2, text:" - a"},
                                                            {line: 3, text:" -  a"}
                                                        ]));
        // empty (ignore)
        assert.deepStrictEqual([], ext.validateMarkdown([
                                                            {line: 1, text:""},
                                                            {line: 2, text:" "},
                                                            {line: 3, text:"  "}
                                                        ]));
    });

    test("error cases", function() {
        assert.deepStrictEqual([2, 3], ext.validateMarkdown([
                                                            {line: 1, text:"- a"},
                                                            {line: 2, text:" -a"},
                                                            {line: 3, text:" -"},
                                                        ]));
    });                                              
});

suite("String to Array Tests (1 row LF)", function () {

    test("1 row, 2 cols", function() {
        assert.deepStrictEqual([["th1","th2"],
                                [":------",":------"],
                               ], ext.getNetedArray("- \n - th1\n - th2"));
    });

    test("1 row, 2 cols", function() {
        assert.deepStrictEqual([["th1","th2"],
                                [":------",":------"],
                               ], ext.getNetedArray("-\n - th1\n - th2"));
    });

    // needs trim
    test("1 row, 2 cols", function() {
        assert.deepStrictEqual([["th1","th2"],
                                [":------",":------"],
                               ], ext.getNetedArray("-\n - th1\n -   th2"));
    });
});

suite("String to Array Tests (1 row CRLF)", function () {

    test("1 row, 2 cols", function() {
        assert.deepStrictEqual([["th1","th2"],
                                [":------",":------"],
                               ], ext.getNetedArray("- \r\n - th1\r\n - th2"));
    });

    test("1 row, 2 cols", function() {
        assert.deepStrictEqual([["th1","th2"],
                                [":------",":------"],
                               ], ext.getNetedArray("-\r\n - th1\r\n - th2"));
    });
});

suite("String to Array Tests (2 row LF)", function () {

    test("2 rows, 2 cols", function() {
        assert.deepStrictEqual([["th1","th2"],
                                [":------",":------"],
                                ["td1","td2"]
                               ], ext.getNetedArray("- \n - th1\n - th2\n- \n - td1\n - td2"));
    });

    test("2 rows, 2 cols", function() {
        assert.deepStrictEqual([["th1","th2"],
                                [":------",":------"],
                                ["td1","td2"]
                               ], ext.getNetedArray("-\n - th1\n - th2\n-\n - td1\n - td2"));
    });

});

suite("String to Array Tests (2 row CRLF)", function () {

    test("2 rows, 2 cols", function() {
        assert.deepStrictEqual([["th1","th2"],
                                [":------",":------"],
                                ["td1","td2"]
                                ], ext.getNetedArray("- \r\n - th1\r\n - th2\r\n- \r\n - td1\r\n - td2"));
    });

    test("2 rows, 2 cols", function() {
        assert.deepStrictEqual([["th1","th2"],
                                [":------",":------"],
                                ["td1","td2"]
                                ], ext.getNetedArray("-\r\n - th1\r\n - th2\r\n-\r\n - td1\r\n - td2"));
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
