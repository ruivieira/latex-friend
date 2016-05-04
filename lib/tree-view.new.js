"use strict";
var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
var AtomSpacePenViews = require('atom-space-pen-views');
var SpacePen = require('space-pen');
var event_kit_1 = require('event-kit');
var utils = require('./latex-friend-utils');
var parser = require('./parser');
var models = require('./models');
var TreeNode = (function (_super) {
    __extends(TreeNode, _super);
    function TreeNode(item) {
        _super.call(this, item);
        this.setSelected = function () {
            return this.addClass('selected');
        };
        this.onDblClick = function (callback) {
            var child, i, len, ref1, results;
            this.emitter.on('on-dbl-click', callback);
            if (this.item.children) {
                ref1 = this.item.children;
                results = [];
                for (i = 0, len = ref1.length; i < len; i++) {
                    child = ref1[i];
                    results.push(child.view.onDblClick(callback));
                }
                return results;
            }
        };
    }
    TreeNode.content = function (arg) {
        var children, icon, label;
        label = arg.label, icon = arg.icon, children = arg.children;
        if (children) {
            return this.li({
                "class": 'list-nested-item list-selectable-item'
            }, (function (_this) {
                return function () {
                    _this.div({
                        "class": 'list-item'
                    }, function () {
                        return _this.span({
                            "class": "icon " + icon
                        }, label);
                    });
                    return _this.ul({
                        "class": 'list-tree'
                    }, function () {
                        var child, i, len, results;
                        for (i = 0, len = children.length; i < len; i++) {
                            child = children[i];
                            _this.subview('child', new TreeNode(child));
                        }
                        return results;
                    });
                };
            })(this));
        }
        else {
            return this.li({
                "class": 'list-item list-selectable-item'
            }, (function (_this) {
                return function () {
                    return _this.span({
                        "class": "icon " + icon
                    }, label);
                };
            })(this));
        }
    };
    TreeNode.prototype.initialize = function (item) {
        this.emitter = new event_kit_1.Emitter();
        this.item = item;
        this.item.view = this;
        SpacePen.$(this).on('dblclick', this.dblClickItem);
        SpacePen.$(this).on('click', this.clickItem);
    };
    ;
    TreeNode.prototype.setCollapsed = function () {
        if (this.item.children) {
            SpacePen.$(this).toggleClass('collapsed');
        }
    };
    ;
    TreeNode.prototype.onSelect = function (callback) {
        var child, i, len, ref1, results;
        this.emitter.on('on-select', callback);
        if (this.item.children) {
            ref1 = this.item.children;
            results = [];
            for (i = 0, len = ref1.length; i < len; i++) {
                child = ref1[i];
                results.push(child.view.onSelect(callback));
            }
            return results;
        }
    };
    ;
    TreeNode.prototype.clickItem = function (event) {
        var $target, left, right, selected, width;
        if (this.item.children) {
            selected = SpacePen.$(this).hasClass('selected');
            SpacePen.$(this).removeClass('selected');
            $target = SpacePen.$(this).find('.list-item:first');
            left = $target.position().left;
            right = $target.children('span').position().left;
            width = right - left;
            if (event.offsetX <= width) {
                SpacePen.$(this).toggleClass('collapsed');
            }
            if (selected) {
                SpacePen.$(this).addClass('selected');
            }
            if (event.offsetX <= width) {
                return false;
            }
        }
        this.emitter.emit('on-select', {
            node: this,
            item: this.item
        });
        return false;
    };
    ;
    TreeNode.prototype.dblClickItem = function (event) {
        this.emitter.emit('on-dbl-click', {
            node: this,
            item: this.item
        });
        return false;
    };
    ;
    return TreeNode;
}(SpacePen.View));
exports.TreeNode = TreeNode;
var RootView = (function (_super) {
    __extends(RootView, _super);
    function RootView(root, ignoreRoot) {
        _super.call(this, root);
        this.ignoreRoot;
    }
    RootView.content = function (root) {
        var _this = this;
        console.log("Creating sub-views");
        this.div({}, function () {
            var child, i, len, ref1, results;
            if (true) {
                ref1 = root.item.children;
                for (i = 0, len = ref1.length; i < len; i++) {
                    child = ref1[i];
                    console.log(child);
                    _this.subview('child', child.view);
                }
            }
        });
    };
    return RootView;
}(SpacePen.View));
var TreeView = (function (_super) {
    __extends(TreeView, _super);
    function TreeView(item) {
        if (item) {
            _super.call(this, item);
        }
        else {
            _super.call(this);
        }
    }
    TreeView.content = function (item) {
        var _this = this;
        this.div({
            "class": '-tree-view-'
        }, function () {
            _this.ul({
                "class": 'list-tree has-collapsable-children',
                outlet: 'root'
            });
        });
    };
    ;
    TreeView.prototype.initialize = function () {
        _super.prototype.initialize.call(this);
        this.emitter = new event_kit_1.Emitter();
        return true;
    };
    ;
    TreeView.prototype.deactivate = function () {
        SpacePen.$(this).remove();
    };
    ;
    TreeView.prototype.onSelect = function (callback) {
        return this.emitter.on('on-select', callback);
    };
    ;
    TreeView.prototype.setRoot = function (root, ignoreRoot) {
        var _this = this;
        if (ignoreRoot == null) {
            ignoreRoot = true;
        }
        this.rootNode = root;
        this.rootNode.onDblClick(function (arg) {
            var node = arg.node;
            var item = arg.item;
            return node.setCollapsed();
        });
        this.rootNode.onSelect(function (arg) {
            var item, node;
            var node = arg.node;
            var item = arg.item;
            _this.clearSelect();
            node.setSelected();
            _this.emitter.emit('on-select', {
                node: node,
                item: item
            });
        });
        console.log(this.root);
        SpacePen.$(this.root).empty();
        var tv = new RootView(this.root, ignoreRoot);
    };
    ;
    TreeView.prototype.traversal = function (root, doing) {
        var child, i, len, ref1, results;
        doing(root.item);
        if (root.item.children) {
            ref1 = root.item.children;
            results = [];
            for (i = 0, len = ref1.length; i < len; i++) {
                child = ref1[i];
                results.push(this.traversal(child.view, doing));
            }
            return results;
        }
    };
    ;
    TreeView.prototype.toggleTypeVisible = function (type) {
        return this.traversal(this.rootNode, (function (_this) {
            return function (item) {
                if (item.type === type) {
                    return item.view.toggle();
                }
            };
        })(this));
    };
    ;
    TreeView.prototype.sortByName = function (ascending) {
        if (ascending == null) {
            ascending = true;
        }
        this.traversal(this.rootNode, (function (_this) {
            return function (item) {
                var ref1;
                return (ref1 = item.children) != null ? ref1.sort(function (a, b) {
                    if (ascending) {
                        return a.name.localeCompare(b.name);
                    }
                    else {
                        return b.name.localeCompare(a.name);
                    }
                }) : void 0;
            };
        })(this));
        return this.setRoot(this.rootNode, null);
    };
    ;
    TreeView.prototype.sortByRow = function (ascending) {
        if (ascending == null) {
            ascending = true;
        }
        this.traversal(this.rootNode, (function (_this) {
            return function (item) {
                var ref1;
                return (ref1 = item.children) != null ? ref1.sort(function (a, b) {
                    if (ascending) {
                        return a.position.row - b.position.row;
                    }
                    else {
                        return b.position.row - a.position.row;
                    }
                }) : void 0;
            };
        })(this));
        return this.setRoot(this.rootNode, null);
    };
    ;
    TreeView.prototype.clearSelect = function () {
        SpacePen.$('.list-selectable-item').removeClass('selected');
    };
    ;
    TreeView.prototype.select = function (item) {
        this.clearSelect();
        return item != null ? item.view.setSelected() : void 0;
    };
    ;
    return TreeView;
}(AtomSpacePenViews.ScrollView));
exports.TreeView = TreeView;
//# sourceMappingURL=tree-view.new.js.map