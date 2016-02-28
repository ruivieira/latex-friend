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
 initialize: (references) ->
   super
   @addClass('overlay from-top')
   @setItems(references)
   @panel ?= atom.workspace.addModalPanel(item: this)
   @panel.show()
   @focusFilterEditor()

 viewForItem: (item) ->
   "<li>#{item}</li>"

 confirmed: (item) ->
   editor = Utils.getActiveTextEditor()
   editor.insertText("\\ref{#{item}}")
   @panel.hide()

 cancelled: ->
   console.log("This view was cancelled")
