{Point, Range} = require 'atom'
{$, jQuery, View} = require 'atom-space-pen-views'
{TreeView} = require './tree-view'
utils = require './latex-friend-utils'
{_} = require 'lodash'
{TreeItem} = require './models'
{CompositeDisposable} = require 'atom'
parser = require './parser'

module.exports =
  class NavigationTreeView extends View
    @content: ->
      console.log('Populating navigation pane')
      @div class: 'navigation-tree-view tool-panel focusable-panel'

    initialize: ->
      @nodes = []
      @subscriptions = new CompositeDisposable
      @treeView = new TreeView
      @append(@treeView)

      @cachedStatus = {}

      @treeView.onSelect ({node, item}) =>
        if item.position.row >= 0 and editor = atom.workspace.getActiveTextEditor()
          screenPosition = editor.screenPositionForBufferPosition(item.position)
          screenRange = new Range(screenPosition, screenPosition)
          {top, left, height, width} = editor.pixelRectForScreenRange(screenRange)
          bottom = top + height
          desiredScrollCenter = top + height / 2
          unless editor.getScrollTop() < desiredScrollCenter < editor.getScrollBottom()
            desiredScrollTop =  desiredScrollCenter - editor.getHeight() / 2

          from = {top: editor.getScrollTop()}
          to = {top: desiredScrollTop}

          step = (now) ->
            editor.setScrollTop(now)

          done = ->
            editor.scrollToBufferPosition(item.position, center: true)
            editor.setCursorBufferPosition(item.position)
            editor.moveToFirstCharacterOfLine()

          jQuery(from).animate(to, duration: @animationDuration, step: step, done: done)

      atom.config.observe 'navigation-tree-view.scrollAnimation', (enabled) =>
        @animationDuration = if enabled then 300 else 0

      @minimalWidth = 5
      @originalWidth = 200
      atom.config.observe 'navigation-tree-view.autoHide', (autoHide) =>
        unless autoHide
          @width(@originalWidth)
        else
          @width(@minimalWidth)

    populate: ->
      unless editor = utils.getActiveTextEditor()
        @hide()
      else
        @generateNodes()
        @show()

        # TODO: change to subscription
        @onEditorSave = editor.onDidSave (state) =>
          filePath = editor.getPath()
          @generateNodes()

        @subscriptions.add editor.onDidChangeCursorPosition ({oldBufferPosition, newBufferPosition}) =>
          if oldBufferPosition.row != newBufferPosition.row
            @focusCurrentCursorTag()

    focusCurrentCursorTag: ->
      # select on tree based on text
      if editor = utils.getActiveTextEditor()
        row = editor.getCursorBufferPosition().row
        node = @nearestNode(row)
        @treeView.select(node)

    nearestNode: (row) ->
      # TODO: Change hardcoded value
      distance = 1000000
      closest = null
      for node in @nodes
        d = Math.abs(node.position.row - row)
        if d < distance
          closest = node
          distance = d
      return closest


    focusClickedTag: (editor, text) ->
      console.log "clicked: #{text}"
      if editor = utils.getActiveTextEditor()
        tag =  (t for t in @parser.tags when t.name is text)[0]
        @treeView.select(tag)
        jQuery('.list-item.list-selectable-item.selected').click()

    generateNodes: ->
      # parse the file for navigation tags
      console.log('Generating nodes')
      sections = new parser.StructureParser().parse()
      root = new TreeItem('root', null, 0, 0)
      currentLevel = 0
      @nodes = [root]
      for section in sections
        level = section.level
        parent = _.findLast(@nodes, (n) -> n.level < level)
        node = new TreeItem(section.name, null, section.level, section.start)
        if parent == undefined
          root.children.push(node)
        else
          parent.children.push(node)
        @nodes.push(node)

      # assign icons
      _.map @nodes, (node) ->
        if node.children.length !=0
          node.icon = 'icon-file-directory'
      @treeView.setRoot(root)
      return root

    # Returns an object that can be retrieved when package is activated
    serialize: ->

    # Tear down any state and detach
    destroy: ->
      @element.remove()

    attach: ->
      if atom.config.get('tree-view.showOnRightSide')
        @panel = atom.workspace.addLeftPanel(item: this)
      else
        @panel = atom.workspace.addRightPanel(item: this)

    attached: ->
      @onChangeEditor = atom.workspace.onDidChangeActivePaneItem (editor) =>
        @removeEventForEditor()
        @populate()

      @onChangeAutoHide = atom.config.observe 'navigation-tree-view.autoHide', (autoHide) =>
        unless autoHide
          @off('mouseenter mouseleave')
        else
          @mouseenter (event) =>
            @stop()
            @animate({width: @originalWidth}, duration: @animationDuration)

          @mouseleave (event) =>
            @stop()
            if atom.config.get('tree-view.showOnRightSide')
              @animate({width: @minimalWidth}, duration: @animationDuration) if event.offsetX > 0
            else
              @animate({width: @minimalWidth}, duration: @animationDuration) if event.offsetX <= 0

    removeEventForEditor: ->
      @onEditorSave?.dispose()
      # @onChangeRow?.dispose()
      @subscriptions.dispose()

    detached: ->
      @onChangeEditor?.dispose()
      @onChangeAutoHide?.dispose()
      @removeEventForEditor()
      @off "contextmenu"

    remove: ->
      super
      @panel.destroy()

    # Toggle the visibility of this view
    toggle: ->
      if @hasParent()
        @remove()
      else
        @populate()
        @attach()

    # Show view if hidden
    showView: ->
      if not @hasParent()
        @populate()
        @attach()

    # Hide view if visisble
    hideView: ->
      if @hasParent()
        @remove()
