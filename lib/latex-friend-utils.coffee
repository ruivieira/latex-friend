exports.getActiveTextEditor = ->
  return atom.workspace.getActiveTextEditor()

exports.isLaTeXFile = (editor) ->
  return editor.getBuffer().getBaseName().split('.').pop() == 'tex'

exports.parseStructure = ->
  editor = exports.getActiveTextEditor()
  levels =
    '\\part{' : 1
    '\\section{' : 2
    '\\subsection{' : 3
    '\\subsubsection{' : 4
  points = []

  editor.getBuffer().scan /\\(sub)*section\{([^}]+)\}/g, (match) =>
    start = match.range.start.row
    matchStr = match.matchText
    name = matchStr.substring(matchStr.indexOf('{') + 1, matchStr.length - 1)
    sub = matchStr.substring(0, matchStr.indexOf('{') + 1)
    console.log(sub)
    points.push
      matchStr : matchStr
      name : name
      level : levels[sub]
      start : start

  return points

exports.parseReferences = ->
  editor = exports.getActiveTextEditor()
  references = []
  editor.getBuffer().scan /\\(?:th)?label{([^}]+)}/g, (match) =>
    matchStr = match.matchText
    ref = matchStr.substring(matchStr.indexOf('{') + 1, matchStr.length - 1)
    references.push(ref)
  console.log(references)
  return references
