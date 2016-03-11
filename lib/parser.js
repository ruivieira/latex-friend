/**
 * @author Rui Vieira
 */
"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var utils = require('./latex-friend-utils');
(function (LaTeXCommands) {
    LaTeXCommands[LaTeXCommands["SECTIONS"] = 0] = "SECTIONS";
    LaTeXCommands[LaTeXCommands["TODOS"] = 1] = "TODOS";
    LaTeXCommands[LaTeXCommands["LABELS"] = 2] = "LABELS";
    LaTeXCommands[LaTeXCommands["PACKAGES"] = 3] = "PACKAGES";
})(exports.LaTeXCommands || (exports.LaTeXCommands = {}));
var LaTeXCommands = exports.LaTeXCommands;
var LatexParser = (function () {
    function LatexParser(regexp) {
        this.regex = regexp;
    }
    LatexParser.prototype.parse = function () {
        var editor = utils.getActiveTextEditor();
        var points = [];
        editor.getBuffer().scan(this.regex, function (match) {
            var matchStr, name, start, sub;
            start = match.range.start.row;
            matchStr = match.matchText;
            name = matchStr.substring(matchStr.indexOf('{') + 1, matchStr.length - 1);
            sub = matchStr.substring(0, matchStr.indexOf('{') + 1);
            var result = {
                matchStr: matchStr,
                name: name,
                level: levels[sub],
                start: start
            };
            points.push(result);
        });
        return points;
    };
    return LatexParser;
}());
var StructureParser = (function (_super) {
    __extends(StructureParser, _super);
    function StructureParser() {
        _super.call(this, /\\(sub)*section\{([^}]+)\}/g);
    }
    return StructureParser;
}(LatexParser));
exports.StructureParser = StructureParser;
var levels = {
    '\\part{': 1,
    '\\section{': 2,
    '\\subsection{': 3,
    '\\subsubsection{': 4
};
var TodoParser = (function (_super) {
    __extends(TodoParser, _super);
    function TodoParser() {
        _super.call(this, /\\todo\{([^}]+)\}/g);
    }
    return TodoParser;
}(LatexParser));
exports.TodoParser = TodoParser;
var ReferenceParser = (function (_super) {
    __extends(ReferenceParser, _super);
    function ReferenceParser() {
        _super.call(this, /\\(?:th)?label{([^}]+)}/g);
    }
    return ReferenceParser;
}(LatexParser));
exports.ReferenceParser = ReferenceParser;
var PackageParser = (function (_super) {
    __extends(PackageParser, _super);
    function PackageParser() {
        _super.call(this, /\\(?:th)?usepackage{([^}]+)}/g);
    }
    return PackageParser;
}(LatexParser));
exports.PackageParser = PackageParser;
