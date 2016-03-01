{ScrollView, SelectListView, TextEditorView, $$} = require 'atom-space-pen-views'
{View} = require 'space-pen'
{_} = require 'lodash'

Utils = require './latex-friend-utils'

class exports.LatexFriendNavigationView extends View
  constructor: ->
    super
    console.log("navigavion view constructor")
    @panel ?= atom.workspace.addModalPanel(item: this)
    @panel.show()

  @content: (params) ->
    console.log('starting content')
    @div class: 'navigation', =>
      @div class: 'select-list', =>
        @ol class: 'list-group', =>
          for section in params.structure
              @li class: "level#{section.level}", start: section.start, click: 'selectSection', section.name

  selectSection: (event, element) ->
    start = parseInt( element.attr('start'), 10 )
    editor = Utils.getActiveTextEditor()
    editor.setCursorBufferPosition([start, 0], {autoscroll : true})
    @panel.hide()

class exports.LatexFriendsNavigationSubView extends ScrollView
  constructor: (structure) ->
    super
    @setItems(structure)
    @focusFilterEditor()
    console.log("Starting [nav sub view]")
    console.log("Got #{structure.length} structures")

  viewForItem: (item) ->
   "<li>#{item.name}</li>"

  confirmed: (item) ->
    editor = Utils.getActiveTextEditor()
    editor.setCursorBufferPosition([item.start, 0], {autoscroll : true})
    @cancel()

class exports.LatexFriendReferencesView extends SelectListView
  constructor: (references) ->
    super
    @references = references
    @addClass('from-top')
    @setItems(@references)
    @panel ?= atom.workspace.addModalPanel(item: this)
    @panel.show()
    @focusFilterEditor()
    console.log("Starting view")

  viewForItem: (item) ->
   "<li class='level#{item.level}'>#{item}</li>"

  confirmed: (item) ->
    console.log("Confirming item #{item}")
    editor = Utils.getActiveTextEditor()
    editor.insertText("\\ref{#{item}}")
    @cancel()

  cancel: ->
    super
    console.log("Cancelling")
    @panel.hide()

class exports.LatextFriendsTodoView extends SelectListView
  constructor: (structure) ->
    super
    @structure = structure
    @addClass('from-top')
    names = _.map(structure, 'name')
    console.log(names)
    @setItems(names)
    @panel ?= atom.workspace.addModalPanel(item: this)
    @panel.show()
    @focusFilterEditor()

  viewForItem: (item) ->
   "<li><span class='icon icon-checklist'>#{item}</span></li>"

  confirmed: (item) ->
    editor = Utils.getActiveTextEditor()
    selected = _.find(@structure, ['name', item])
    editor.setCursorBufferPosition([selected.start, 0], {autoscroll : true})
    @cancel()

  cancel: ->
    super
    console.log("Cancelling")
    @panel.hide()

class exports.MatrixBuilderView extends View
  initialize: ->
    console.log("Matrix builder constructor")

    @panel ?= atom.workspace.addModalPanel(item: this)
    @panel.show()

  @content: (params) ->
    console.log('starting matrix builder content')

    @div class: 'navigation block', =>
      @div =>
        @div class: 'smallInput inline-block', =>
          @label 'Rows'
          @subview 'rows', new TextEditorView(mini: true)
        @div class: 'smallInput inline-block', =>
          @label 'Columns'
          @subview 'columns', new TextEditorView(mini: true)
      @div =>
        @button class: 'btn', click: 'do', 'Insert'

  do: (event, element) ->
    console.log('Button pressed')
    columns = parseInt(@panel.item.columns.getModel().buffer.lines[0], 10)
    rows = parseInt(@panel.item.rows.getModel().buffer.lines[0], 10)
    console.log("Creating matrix with [#{rows}x#{columns}]")
    row = [0 for n in [0...columns]].map((i) -> i.toString()).join(',')
    console.log(row)
    m = (row for n in [0...rows])
    matrix = "\\begin{bmatrix} #{m.join('\\\\')} \\end{bmatrix}"
    editor = Utils.getActiveTextEditor()
    editor.insertText(matrix)
    @panel.hide()
