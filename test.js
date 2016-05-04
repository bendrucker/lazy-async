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

test('no callback', function (t) {
  t.plan(4)

  var triggerLoad
  var lazy = Lazy(['foo.get'], load)

  t.equal(typeof lazy.foo.get, 'function', 'defines interface')

  lazy.foo.get('bar')

  triggerLoad(null, {
    foo: {
      get: function (input) {
        t.equal(input, 'bar', 'redirects input')
      }
    }
  })

  lazy.foo.get('bar')

  function load (callback) {
    t.equal(typeof callback, 'function')
    triggerLoad = callback
  }
})

test('error', function (t) {
  t.plan(4)

  var triggerLoad
  var lazy = Lazy(['foo.get'], load)

  lazy.foo.get('bar', function (err, data) {
    t.ok(err, 'queued error')
    t.equal(err.message, 'Library failed to load')
  })

  triggerLoad(new Error('Library failed to load'))

  lazy.foo.get('bar', function (err, data) {
    t.ok(err, 'error after load failure')
    t.equal(err.message, 'Library failed to load')
  })

  function load (callback) {
    triggerLoad = callback
  }
})
