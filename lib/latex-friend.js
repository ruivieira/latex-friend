"use strict";
var utils = require('./latex-friend-utils');
var event_kit_1 = require("event-kit");
var parser = require('./parser');
var subprocess = require('child_process');
var latex_friend_view_1 = require("./latex-friend-view");
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
        'latex-friend:syncpdf': this.syncpdf
    }));
    this.subscriptions.add(atom.commands.add('atom-workspace', {
        'latex-friend:showNavigation': this.showNavigation
    }));
    this.subscriptions.add(atom.commands.add('atom-workspace', {
        'latex-friend:showNavigationPane': this.toggleNavigationPane
    }));
    this.subscriptions.add(atom.commands.add('atom-workspace', {
        'latex-friend:insertReference': this.insertReference
    }));
    this.subscriptions.add(atom.commands.add('atom-workspace', {
        'latex-friend:showTodos': this.showTodos
    }));
    this.subscriptions.add(atom.commands.add('atom-workspace', {
        'latex-friend:matrixBuilder': this.matrixBuilder
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
        var navigationView = new latex_friend_view_1.LatexFriendNavigationView({ structure: structure });
    }
}
exports.showNavigation = showNavigation;
function toggleNavigationPane() {
    console.log('started navigation pane');
    var editor = utils.getActiveTextEditor();
    if (utils.isLaTeXFile(editor)) {
        var structure = new parser.StructureParser().parse();
        if (this.navigationTreeView == null) {
            this.navigationTreeView = new NavigationTreeView();
            this.navigationTreeView.showView();
        }
        else {
            if (this.navigationTreeView.isVisible()) {
                this.navigationTreeView.hideView();
            }
            else {
                this.navigationTreeView.showView();
            }
        }
    }
}
exports.toggleNavigationPane = toggleNavigationPane;
function showTodos() {
    console.log('called [show todos]');
    var editor = utils.getActiveTextEditor();
    if (utils.isLaTeXFile(editor)) {
        var structure = new parser.TodoParser().parse();
        var view = new latex_friend_view_1.LatextFriendsTodoView(structure);
    }
}
exports.showTodos = showTodos;
function insertReference() {
    console.log('called [insert reference]');
    var editor = utils.getActiveTextEditor();
    if (utils.isLaTeXFile(editor)) {
        var references = new parser.ReferenceParser().parse();
        var referenceView = new latex_friend_view_1.ReferencesPopupView(references);
    }
}
exports.insertReference = insertReference;
function getBufferRow(editor) {
    return editor.getCursorBufferPosition()['row'] + 1;
}
exports.getBufferRow = getBufferRow;
function notifyPDFReader(editor, line_number) {
    var command = atom.config.get('latex-friend.command');
    var source = editor.getPath();
    var pdf = source.replace('.tex', '.pdf');
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
        var view = new latex_friend_view_1.MatrixBuilderView();
    }
}
exports.matrixBuilder = matrixBuilder;
