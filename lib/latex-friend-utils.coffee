exports.getActiveTextEditor = ->
  return atom.workspace.getActiveTextEditor()

exports.isLaTeXFile = (editor) ->
  return editor.getBuffer().getBaseName().split('.').pop() == 'tex'
