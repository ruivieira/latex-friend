{SelectListView, $$} = require 'atom-space-pen-views'
Utils = require './latex-friend-utils'

class exports.LatexFriendNavigationView
  constructor: (structure) ->
    @structure = structure
    @element = document.createElement('div')
    @element.classList.add('navigation')

    structureElement = document.createElement('div')
    for point in @structure
      pointRow = @_createLink(point)
      @element.appendChild(pointRow)

  serialize: ->

  destroy: ->
    @element.remove()

  getElement: ->
    @element

  processClick: (id) ->
    console.log(id)

  _createLink: (point) ->
    pointRow = document.createElement('div')
    pointRow.classList.add("level#{point.level}")

    pointLink = document.createElement('a')
    text = document.createTextNode(point.name)
    pointLink.appendChild(text)

    # add event listener
    pointLink.addEventListener 'click', =>
      # go to specific location
      editor = atom.workspace.getActiveTextEditor()
      editor.setCursorBufferPosition([point.start, 0], {autoscroll : true})
      panel = atom.workspace.panelForItem(@element)
      console.log(panel)
      panel.hide()

    pointLink.href = '#'
    pointRow.appendChild(pointLink)

    return pointRow

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
   "<li>#{item}</li>"

  confirmed: (item) ->
    console.log("Confirming item #{item}")
    editor = Utils.getActiveTextEditor()
    editor.insertText("\\ref{#{item}}")
    @cancel()

  cancel: ->
    super
    console.log("Cancelling")
    @panel.hide()
