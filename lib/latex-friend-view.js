"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var atom_space_pen_views_1 = require('atom-space-pen-views');
require("lodash");
var SpacePen = require('space-pen');
var utils = require('./latex-friend-utils');
var LatexFriendNavigationView = (function (_super) {
    __extends(LatexFriendNavigationView, _super);
    function LatexFriendNavigationView(params) {
        _super.call(this, params);
        this.panel = null;
        this.params = params;
        console.log("Structure navigavion view started.");
        if (this.panel == null) {
            this.panel = atom.workspace.addModalPanel({ item: this });
        }
        this.panel.show();
    }
    LatexFriendNavigationView.content = function (params) {
        var _this = this;
        this.div({ class: 'navigation' }, function () {
            _this.div({ class: 'select-list' }, function () {
                _this.ol({ class: 'list-group' }, function () {
                    for (var i = 0; i < params.structure.length; i++) {
                        var section = params.structure[i];
                        _this.li({
                            class: 'level' + section.level.toString(),
                            start: section.start,
                            click: 'selectSection'
                        }, section.name);
                    }
                });
            });
        });
    };
    LatexFriendNavigationView.prototype.selectSection = function (event, element) {
        var start = parseInt(element.attr('start'), 10);
        var editor = utils.getActiveTextEditor();
        editor.setCursorBufferPosition([start, 0], { autoscroll: true });
        this.panel.hide();
    };
    return LatexFriendNavigationView;
}(SpacePen.View));
exports.LatexFriendNavigationView = LatexFriendNavigationView;
var ReferencesPopupView = (function (_super) {
    __extends(ReferencesPopupView, _super);
    function ReferencesPopupView(references) {
        _super.call(this, references);
        this.panel = null;
        this.structure = references;
        this.setItems(this.structure);
        this.panel = atom.workspace.addModalPanel({ item: this });
        this.panel.show();
        this.focusFilterEditor();
    }
    ReferencesPopupView.prototype.getFilterKey = function () {
        return 'name';
    };
    ReferencesPopupView.prototype.viewForItem = function (item) {
        return "<li class='level#{item.level}'>" + item.name + "</li>";
    };
    ReferencesPopupView.prototype.confirmed = function (item) {
        console.log("Confirming item " + item);
        var ref = null;
        if (item.name.slice(0, 3) == 'eq:' && atom.config.get('latex-friend.useeqref')) {
            ref = "\\eqref{" + item.name + "}";
        }
        else {
            ref = "\\ref{" + item.name + "}";
        }
        var editor = utils.getActiveTextEditor();
        editor.insertText(ref);
        this.cancel();
        return null;
    };
    ReferencesPopupView.prototype.cancel = function () {
        _super.prototype.cancel.call(this);
        console.log('Cancelling');
        this.panel.hide();
    };
    return ReferencesPopupView;
}(atom_space_pen_views_1.SelectListView));
exports.ReferencesPopupView = ReferencesPopupView;
var LatextFriendsTodoView = (function (_super) {
    __extends(LatextFriendsTodoView, _super);
    function LatextFriendsTodoView(structure) {
        _super.call(this, structure);
        this.setItems(structure);
        this.structure = structure;
        this.panel = atom.workspace.addModalPanel({ item: this });
        this.panel.show();
        this.focusFilterEditor();
    }
    LatextFriendsTodoView.prototype.viewForItem = function (item) {
        return "<li><span class='icon icon-checklist'>" + item.name + "</span></li>";
    };
    LatextFriendsTodoView.prototype.confirmed = function (item) {
        var editor = utils.getActiveTextEditor();
        var selected = _.find(this.structure, ['name', item.name]);
        editor.setCursorBufferPosition([selected.start, 0], { autoscroll: true });
        this.cancel();
        return null;
    };
    LatextFriendsTodoView.prototype.getFilterKey = function () {
        return 'name';
    };
    LatextFriendsTodoView.prototype.cancel = function () {
        _super.prototype.cancel.call(this);
        console.log('Cancelling');
        this.panel.hide();
    };
    return LatextFriendsTodoView;
}(atom_space_pen_views_1.SelectListView));
exports.LatextFriendsTodoView = LatextFriendsTodoView;
var MatrixBuilderView = (function (_super) {
    __extends(MatrixBuilderView, _super);
    function MatrixBuilderView() {
        _super.apply(this, arguments);
    }
    MatrixBuilderView.prototype.initialize = function () {
        console.log("Matrix builder constructor");
        this.panel = atom.workspace.addModalPanel({ item: this });
        this.panel.show();
    };
    MatrixBuilderView.content = function (params) {
        var _this = this;
        console.log('starting matrix builder content');
        this.div({ class: 'navigation block' }, function () {
            _this.div(function () {
                _this.div({ class: 'smallInput inline-block' }, function () {
                    _this.label('Rows');
                    _this.subview('rows', new atom_space_pen_views_1.TextEditorView({ mini: true }));
                });
                _this.div({ class: 'smallInput inline-block' }, function () {
                    _this.label('Columns');
                    _this.subview('columns', new atom_space_pen_views_1.TextEditorView({ mini: true }));
                });
            });
            _this.div(function () {
                _this.button({ class: 'btn', click: 'do' }, 'Insert');
            });
        });
    };
    MatrixBuilderView.prototype.do = function (event, element) {
        console.log('Button pressed');
        var columns = parseInt(this.panel.getItem().columns.getModel().buffer.lines[0], 10);
        var rows = parseInt(this.panel.getItem().rows.getModel().buffer.lines[0], 10);
        console.log("Creating matrix with [#{rows}x#{columns}]");
        var row = Array(columns).map(_.constant('0')).join(',');
        var m = Array(rows).map(_.constant('0')).join('\\\\');
        var matrix = "\\begin{bmatrix} " + m + " \\end{bmatrix}";
        var editor = utils.getActiveTextEditor();
        editor.insertText(matrix);
        this.panel.hide();
    };
    return MatrixBuilderView;
}(SpacePen.View));
exports.MatrixBuilderView = MatrixBuilderView;
//# sourceMappingURL=latex-friend-view.js.map