# latex-friend package

A set of extra utilities for your LaTeX workflow.

## Insert references

Use `ctrl-alt-r` to browse, select and insert references to a `\label`.
References to formulas can be inserted as `\eqref` (enable in settings) but amsmath is required.

![latex-friend references](http://i.imgur.com/smSgjkO.gif)

## Matrix builder
Creates a matrix by specifying the number of rows and columns (`ctrl-alt-m`).
Uses the [amsmath](http://ctan.org/pkg/amsmath) package notation. At the moment,
only `\bmatrix` supported. Further customization in future releases!

## Navigation pane

Provides a navigable tree with the document's sections.
`ctrl-alt-p` or `Latex Friend:showNavigationPane` from the palette (press it again to close it).

![navigation pane](http://i.imgur.com/ijJPDm3.png)

The `TreeView` component is based on the [symbols-tree-view](https://atom.io/packages/symbols-tree-view) project.

## Navigate section

Use `ctrl-alt-n` for a navigational menu to quickly jump between sections.

![latex-friend navigation](http://i.imgur.com/yDHQ2KO.gif)

## Sync PDF

Provide the PDF Reader's path and sync argument in the package settings (a default for Skim on OS X is provided).

![latex-friend sync](http://i.imgur.com/pOXOpYy.gif)

## Search TODOs

Search TODO notes and jump to selected. TODOs are identified by the command `\todo` (as in the [todonotes](http://ctan.org/pkg/todonotes) package). Shortcuts are `ctrl-alt-t` or `Latex Friend:Show TODOs` from the palette.

![latex-friend sync](http://i.imgur.com/Yf9XAZi.gif)
