'use strict'

var assert = require('assert-ok')
var assertEqual = require('assert-equal')
var dot = require('dot-prop')
var toArray = require('to-array')
var last = require('array-last')
var dezalgo = require('dezalgo')
var all = require('call-all-fns')

module.exports = Lazy

function Lazy (methods, load) {
  assert(Array.isArray(methods), 'methods are required')
  assertEqual(typeof load, 'function', 'load fn is required')

  var api = null
  var error = null
  var queue = []

  load(function (err, lib) {
    error = err
    api = lib
    all(queue)(err, lib)
    queue = null
  })

  return methods.reduce(function (lazy, method) {
    dot.set(lazy, method, Deferred(method))
    return lazy
  }, {})

  function Deferred (method) {
    return function deferred () {
      var args = arguments
      onReady(function (err, api) {
        if (!err) return dot.get(api, method).apply(null, args)
        var callback = last(toArray(args))
        if (typeof callback === 'function') {
          return callback(err)
        }
      })
    }
  }

  function onReady (callback) {
    callback = dezalgo(callback)

    if (api || error) return callback(error, api)
    queue.push(callback)
  }
}
