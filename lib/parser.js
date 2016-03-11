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
            points.push({
                matchStr: matchStr,
                name: name,
                level: levels[sub],
                start: start
            });
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
function parseStructure() {
    var editor = utils.getActiveTextEditor();
    var points = [];
    editor.getBuffer().scan(/\\(sub)*section\{([^}]+)\}/g, (function (_this) {
        return function (match) {
            var matchStr, name, start, sub;
            start = match.range.start.row;
            matchStr = match.matchText;
            name = matchStr.substring(matchStr.indexOf('{') + 1, matchStr.length - 1);
            sub = matchStr.substring(0, matchStr.indexOf('{') + 1);
            return points.push({
                matchStr: matchStr,
                name: name,
                level: levels[sub],
                start: start
            });
        };
    })(this));
    return points;
}
exports.parseStructure = parseStructure;
function parseTodosfunction() {
    var editor, points;
    editor = utils.getActiveTextEditor();
    points = [];
    editor.getBuffer().scan(/\\todo\{([^}]+)\}/g, (function (_this) {
        return function (match) {
            var matchStr, name, start, sub;
            start = match.range.start.row;
            matchStr = match.matchText;
            name = matchStr.substring(matchStr.indexOf('{') + 1, matchStr.length - 1);
            sub = matchStr.substring(0, matchStr.indexOf('{') + 1);
            return points.push({
                name: name,
                start: start
            });
        };
    })(this));
    return points;
}
exports.parseTodosfunction = parseTodosfunction;
function parseReferences() {
    var editor, references;
    editor = utils.getActiveTextEditor();
    references = [];
    editor.getBuffer().scan(/\\(?:th)?label{([^}]+)}/g, (function (_this) {
        return function (match) {
            var matchStr, ref;
            matchStr = match.matchText;
            ref = matchStr.substring(matchStr.indexOf('{') + 1, matchStr.length - 1);
            return references.push(ref);
        };
    })(this));
    console.log(references);
    return references;
}
exports.parseReferences = parseReferences;
function parsePackages() {
    var editor, packages;
    editor = utils.getActiveTextEditor();
    packages = [];
    editor.getBuffer().scan(/\\(?:th)?usepackage{([^}]+)}/g, (function (_this) {
        return function (match) {
            var matchStr, p;
            matchStr = match.matchText;
            p = matchStr.substring(matchStr.indexOf('{') + 1, matchStr.length - 1);
            return packages.push(p);
        };
    })(this));
    console.log(packages);
    return packages;
}
exports.parsePackages = parsePackages;
