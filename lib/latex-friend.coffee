LatexFriendViews = require './latex-friend-view'
NavigationTreeView = require './navigation-tree-view'
Utils = require './latex-friend-utils'
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
  navigationPanel: null
  referencePanel: null
  subscriptions: null
  compiledCommandString: null

  activate: (state) ->
    editor = Utils.getActiveTextEditor()
    @navigationTreeView = new NavigationTreeView(state.navigationTreeViewState)

    @subscriptions = new CompositeDisposable

    @subscriptions.add atom.commands.add 'atom-workspace', 'latex-friend:syncpdf': => @syncpdf()
    @subscriptions.add atom.commands.add 'atom-workspace', 'latex-friend:showNavigation': => @showNavigation()
    @subscriptions.add atom.commands.add 'atom-workspace', 'latex-friend:showNavigationPane': => @showNavigationPane()
    @subscriptions.add atom.commands.add 'atom-workspace', 'latex-friend:insertReference': => @insertReference()
    @subscriptions.add atom.commands.add 'atom-workspace', 'latex-friend:showTodos': => @showTodos()
    @subscriptions.add atom.commands.add 'atom-workspace', 'latex-friend:matrixBuilder': => @matrixBuilder()
    @subscriptions.add editor.onDidChangeCursorPosition =>
      if atom.config.get('latex-friend.syncpdf')
        @syncpdf()

  deactivate: ->
    @subscriptions.dispose()

  serialize: ->

  syncpdf: ->
    console.log 'Getting PDF reader in sync.'
    editor = Utils.getActiveTextEditor()
    if Utils.isLaTeXFile(editor)
      line = @getBufferRow(editor)
      @notifyPDFReader(editor, line)

  showNavigation: ->
    console.log('called [show navigation]')
    editor = Utils.getActiveTextEditor()
    if Utils.isLaTeXFile(editor)
      structure = Utils.parseStructure()
      navigationView = new LatexFriendViews.LatexFriendNavigationView(structure: structure)

  showNavigationPane: ->
    console.log('started navigation pane')
    editor = Utils.getActiveTextEditor()
    if Utils.isLaTeXFile(editor)
      structure = Utils.parseStructure()
      @navigationTreeView.showView()

  showTodos: ->
    console.log('called [show todos]')
    editor = Utils.getActiveTextEditor()
    if Utils.isLaTeXFile(editor)
      structure = Utils.parseTodos()
      view = new LatexFriendViews.LatextFriendsTodoView(structure)

  insertReference: ->
    console.log('called [insert reference]')
    editor = Utils.getActiveTextEditor()
    if Utils.isLaTeXFile(editor)
      references = Utils.parseReferences()
      referenceView = new LatexFriendViews.LatexFriendReferencesView(references)

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

  matrixBuilder: ->
    console.log('called [matrix builder]')
    editor = Utils.getActiveTextEditor()
    if Utils.isLaTeXFile(editor)
      view = new LatexFriendViews.MatrixBuilderView()
