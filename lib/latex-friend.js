"use strict";
var utils = require('./latex-friend-utils');
var event_kit_1 = require("event-kit");
var parser = require('./parser');
var v = require('./latex-friend-view');
var subprocess = require('child_process');
var NavigationTreeView = require('./navigation-tree-view');
exports.config = {
    commandString: {
        type: 'string',
        default: "-g $line_number $pdf $source"
    },
    command: {
        type: 'string',
        default: "displayline"
    },
    syncpdf: {
        type: 'boolean',
        default: true
    },
    useeqref: {
        title: 'Use \\eqref',
        description: 'If inserting a reference to \\label{eq:} use \\eqref (requires amsmath)',
        type: 'boolean',
        default: false
    }
};
exports.latexFriendView = null;
exports.LatexFriendNavigationView = null;
exports.navigationPanel = null;
exports.referencePanel = null;
exports.compiledCommandString = null;
exports.navigationTreeView = null;
exports.subscriptions = null;
function activate(state) {
    var _this = this;
    var editor = utils.getActiveTextEditor();
    this.navigationTreeView = new NavigationTreeView(state.navigationTreeViewState);
    this.subscriptions = new event_kit_1.CompositeDisposable();
    this.subscriptions.add(atom.commands.add('atom-workspace', {
        'latex-friend:syncpdf': function () {
            _this.syncpdf();
        }
    }));
    this.subscriptions.add(atom.commands.add('atom-workspace', {
        'latex-friend:showNavigation': function () {
            _this.showNavigation();
        }
    }));
    this.subscriptions.add(atom.commands.add('atom-workspace', {
        'latex-friend:showNavigationPane': function () {
            _this.showNavigationPane();
        }
    }));
    this.subscriptions.add(atom.commands.add('atom-workspace', {
        'latex-friend:insertReference': function () {
            _this.insertReference();
        }
    }));
    this.subscriptions.add(atom.commands.add('atom-workspace', {
        'latex-friend:showTodos': function () {
            _this.showTodos();
        }
    }));
    this.subscriptions.add(atom.commands.add('atom-workspace', {
        'latex-friend:matrixBuilder': function () {
            _this.matrixBuilder();
        }
    }));
    this.subscriptions.add(editor.onDidChangeCursorPosition(function () {
        if (atom.config.get('latex-friend.syncpdf')) {
            return _this.syncpdf();
        }
    }));
}
exports.activate = activate;
function deactivate() {
    this.subscriptions.dispose();
}
exports.deactivate = deactivate;
function serialize() {
}
exports.serialize = serialize;
function syncpdf() {
    console.log('Getting PDF reader in sync.');
    var editor = utils.getActiveTextEditor();
    if (utils.isLaTeXFile(editor)) {
        var line = this.getBufferRow(editor);
        this.notifyPDFReader(editor, line);
    }
}
exports.syncpdf = syncpdf;
function showNavigation() {
    console.log('called [show navigation]');
    var editor = utils.getActiveTextEditor();
    if (utils.isLaTeXFile(editor)) {
        var structure = new parser.StructureParser().parse();
        var navigationView = new v.LatexFriendNavigationView({ structure: structure });
    }
}
exports.showNavigation = showNavigation;
function showNavigationPane() {
    console.log('started navigation pane');
    var editor = utils.getActiveTextEditor();
    if (utils.isLaTeXFile(editor)) {
        var structure = new parser.StructureParser().parse();
        this.navigationTreeView.showView();
    }
}
exports.showNavigationPane = showNavigationPane;
function showTodos() {
    console.log('called [show todos]');
    var editor = utils.getActiveTextEditor();
    if (utils.isLaTeXFile(editor)) {
        var structure = new parser.TodoParser().parse();
        var view = new v.LatextFriendsTodoView(structure);
    }
}
exports.showTodos = showTodos;
function insertReference() {
    console.log('called [insert reference]');
    var editor = utils.getActiveTextEditor();
    if (utils.isLaTeXFile(editor)) {
        var references = new parser.ReferenceParser().parse();
        var referenceView = new v.LatexFriendReferencesView(references);
    }
}
exports.insertReference = insertReference;
function getBufferRow(editor) {
    return editor.getCursorBufferPosition()['row'] + 1;
}
exports.getBufferRow = getBufferRow;
function notifyPDFReader(editor, line_number) {
    var command, pdf, source;
    command = atom.config.get('latex-friend.command');
    source = editor.getPath();
    pdf = source.replace('.tex', '.pdf');
    command = command + " " + (this.compileCmdString(editor, line_number, pdf, source));
    console.log(command);
    subprocess.exec(command, {}, function (error, stdout, stderr) {
        if (error) {
            console.error(error);
        }
        if (stderr) {
            console.error(stderr);
        }
        if (stdout) {
            return console.log(stdout);
        }
    });
}
exports.notifyPDFReader = notifyPDFReader;
function compileCmdString(editor, line_number, pdf, source) {
    var template = atom.config.get('latex-friend.commandString');
    template = template.replace(/\$line_number/, line_number);
    template = template.replace(/\$pdf/, pdf);
    template = template.replace(/\$source/, source);
    console.log(template);
    return template;
}
exports.compileCmdString = compileCmdString;
function matrixBuilder() {
    console.log('called [matrix builder]');
    var editor = utils.getActiveTextEditor();
    if (utils.isLaTeXFile(editor)) {
        var view = new v.MatrixBuilderView();
    }
}
exports.matrixBuilder = matrixBuilder;
