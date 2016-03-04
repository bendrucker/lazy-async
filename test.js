'use strict'

var test = require('tape')
var Lazy = require('./')

test('success', function (t) {
  t.plan(6)

  var triggerLoad
  var lazy = Lazy(['foo.get'], load)

  t.equal(typeof lazy.foo.get, 'function', 'defines interface')

  lazy.foo.get('bar', function (err, data) {
    if (err) return t.end(err)
    t.equal(data, 'data')
  })

  triggerLoad(null, {
    foo: {
      get: function (input, callback) {
        t.equal(input, 'bar', 'redirects input')
        callback(null, 'data')
      }
    }
  })

  lazy.foo.get('bar', function (err, data) {
    if (err) return t.end(err)
    t.equal(data, 'data')
  })

  function load (callback) {
    t.equal(typeof callback, 'function')
    triggerLoad = callback
  }
})
