{ScrollView, SelectListView, $$} = require 'atom-space-pen-views'
{View} = require 'space-pen'

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
