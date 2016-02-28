LatexFriendViews = require './latex-friend-view'
{CompositeDisposable} = require 'atom'
subprocess = require 'child_process'

module.exports =
  config:
    commandString:
      type: "string"
      default: "-g $line_number $pdf $source"
    command:
      type: "string"
      default: "displayline"

  latexFriendView: null
  LatexFriendNavigationView: null
  modalPanel: null
  subscriptions: null
  compiledCommandString: null

  activate: (state) ->
    editor = atom.workspace.getActiveTextEditor()

    @subscriptions = new CompositeDisposable

    @subscriptions.add atom.commands.add 'atom-workspace', 'latex-friend:syncpdf': => @syncpdf()
    @subscriptions.add atom.commands.add 'atom-workspace', 'latex-friend:showNavigation': => @showNavigation()
    @subscriptions.add editor.onDidChangeCursorPosition => @syncpdf()

  deactivate: ->
    @subscriptions.dispose()

  serialize: ->

  syncpdf: ->
    console.log 'Getting PDF reader in sync.'
    editor = @_getActiveTextEditor()
    if @isLaTeXFile(editor)
      line = @getBufferRow(editor)
      @notifyPDFReader(editor, line)

  showNavigation: ->
    console.log('called show navigation')
    editor = @_getActiveTextEditor()
    if @isLaTeXFile(editor)
      structure = @parseStructure()
      navigationView = new LatexFriendViews.LatexFriendNavigationView(structure)
      @modalPanel = atom.workspace.addModalPanel(className: 'modalNavigation', item : navigationView.getElement())
      @modalPanel.show()

  getBufferRow: (editor) ->
    return editor.getCursorBufferPosition()['row'] + 1

  notifyPDFReader: (editor, line_number) ->
    command = atom.config.get('latex-friend.command')
    source = editor.getPath()
    pdf = source.replace('.tex', '.pdf')
    command = "#{command} #{@compileCmdString(editor, line_number, pdf, source)}"
    console.log(command)
    subprocess.exec(command, {}, (error, stdout, stderr) ->
      console.error(error) if error
      console.error(stderr) if stderr
      console.log(stdout) if stdout
    )

  compileCmdString: (editor, line_number, pdf, source) ->
    template = atom.config.get('latex-friend.commandString')
    template = template.replace /\$line_number/, line_number
    template = template.replace /\$pdf/, pdf
    template = template.replace /\$source/, source
    console.log(template)
    return template

  isLaTeXFile: (editor) ->
    return editor.getBuffer().getBaseName().split('.').pop() == 'tex'

  parseStructure: ->
    editor = @_getActiveTextEditor()
    levels =
      '\\part{' : 1
      '\\section{' : 2
      '\\subsection{' : 3
      '\\subsubsection{' : 4
    points = []

    editor.getBuffer().scan /\\(sub)*section\{(.*)\}/g, (match) =>
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
    console.log(points)

    return points

  _getActiveTextEditor: ->
    return atom.workspace.getActiveTextEditor()
