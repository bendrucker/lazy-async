# lazy-async [![Build Status](https://travis-ci.org/bendrucker/lazy-async.svg?branch=master)](https://travis-ci.org/bendrucker/lazy-async) [![Greenkeeper badge](https://badges.greenkeeper.io/bendrucker/lazy-async.svg)](https://greenkeeper.io/)

> Generate a lazy-execution API by queueing requests

## Install

```
$ npm install --save lazy-async
```


## Usage

```js
var Lazy = require('lazy-async')

var maps = Lazy(['autocomplete.places'], loadGoogleMaps)

maps.autocomplete.places({input: 'SF'}, function (err, results) {
  //=> handle err/results
})
```

`Lazy` will call `loadGoogleMaps` immediately. It passes a callback to `loadGoogleMaps` that expects an error if the library failed to load or the JS API upon success (`err, api`). 

Before the library loads, you can call the methods you define. The calls will be queued up until the library loads. If the library loads, all calls will be executed in call-order. If the library fails to load, all callbacks will be called with the error generated by your load function.

All subsequent calls are either routed to the loaded API or fulfilled with the original error.

## API

#### `Lazy(methods, load)` -> `object`

##### methods

*Required*  
Type: `array[string]`

An array of methods in dot property syntax, e.g. `users.fetch`. These methods should exist on the remote API once loaded. Methods may accept a callback as their last argument. 

##### load

*Required*  
Type: `function`  
Arguments: `callback`

A function that will load the remote API and call the `callback` with `err, api` once ready.

## License

MIT © [Ben Drucker](http://bendrucker.me)
