{_} = require 'lodash'

class Promise
  constructor: ->
    @promises = []
  update: ->
    console.log('Called into execution!')
    console.log(@promises)
    f() for f in @promises
  addCallback: (cb) ->
    console.log('Added callback:')
    console.log(cb)
    @promises.push => cb.call(@)
    console.log(@promises)

module.exports =
  editor:
    onDidChangeCursorPosition : new Promise()
