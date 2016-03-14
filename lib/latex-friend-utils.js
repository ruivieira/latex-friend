"use strict";
function getActiveTextEditor() {
    return atom.workspace.getActiveTextEditor();
}
exports.getActiveTextEditor = getActiveTextEditor;
function isLaTeXFile(editor) {
    try {
        return editor.getBuffer().getBaseName().split('.').pop() == 'tex';
    }
    catch (err) {
        return false;
    }
}
exports.isLaTeXFile = isLaTeXFile;
