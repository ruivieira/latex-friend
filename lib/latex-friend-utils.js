"use strict";
/**
 * @author Rui Vieira
 */
function getActiveTextEditor() {
    return atom.workspace.getActiveTextEditor();
}
exports.getActiveTextEditor = getActiveTextEditor;
function isLaTeXFile(editor) {
    return editor.getBuffer().getBaseName().split('.').pop() == 'tex';
}
exports.isLaTeXFile = isLaTeXFile;
