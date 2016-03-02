class exports.TreeItem
  constructor: (options = {}) ->
    @label = options.label ? null
    @icon = options.icon ? null
    @children = []
    @level = options.level ? null
    @position =
      row : options.row ? null
