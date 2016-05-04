"use strict";
var TreeItem = (function () {
    function TreeItem(label, icon, level, row) {
        this.children = [];
        this.position = {
            row: null
        };
        this.label = label;
        this.icon = icon;
        this.level = level;
        this.position.row = row;
    }
    TreeItem.prototype.hasChildren = function () {
        return this.children.length > 0;
    };
    return TreeItem;
}());
exports.TreeItem = TreeItem;
//# sourceMappingURL=models.js.map