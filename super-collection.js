!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var o;"undefined"!=typeof window?o=window:"undefined"!=typeof global?o=global:"undefined"!=typeof self&&(o=self),o.collection=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
module.exports = _dereq_( './src/collection.js' );

},{"./src/collection.js":5}],2:[function(_dereq_,module,exports){
'use strict';

module.exports = function (Ctor) {
  var ArrayLike = Ctor || Array;

  /**
   * # Constructor
   *
   * Provided as a convenient wrapper around Fast functions.
   *
   * ```js
   * var arr = fast([1,2,3,4,5,6]);
   *
   * var result = arr.filter(function (item) {
   *   return item % 2 === 0;
   * });
   *
   * result instanceof Fast; // true
   * result.length; // 3
   * ```
   *
   *
   * @param {Array} value The value to wrap.
   */
  function Fast (value) {
    if (!(this instanceof Fast)) {
      return new Fast(value);
    }
    this.value = value || [];
  }

  /**
   * # Concat
   *
   * Concatenate multiple arrays.
   *
   * @param  {Array|mixed} item, ... The item(s) to concatenate.
   * @return {Fast}                  A new Fast object, containing the results.
   */
  Fast.prototype.concat = function Fast$concat () {
    var length = this.value.length,
        arr = new ArrayLike(length),
        i, item, childLength, j;

    for (i = 0; i < length; i++) {
      arr[i] = this.value[i];
    }

    length = arguments.length;
    for (i = 0; i < length; i++) {
      item = arguments[i];
      if (ArrayLike.isArray(item)) {
        childLength = item.length;
        for (j = 0; j < childLength; j++) {
          arr.push(item[j]);
        }
      }
      else {
        arr.push(item);
      }
    }
    return new Fast(arr);
  };

  /**
   * Fast Map
   *
   * @param  {Function} fn          The visitor function.
   * @param  {Object}   thisContext The context for the visitor, if any.
   * @return {Fast}                 A new Fast object, containing the results.
   */
  Fast.prototype.map = function Fast$map (fn, thisContext) {
    return new Fast(Fast.map(this.value, fn, thisContext));
  };

  /**
   * Fast Filter
   *
   * @param  {Function} fn          The filter function.
   * @param  {Object}   thisContext The context for the filter function, if any.
   * @return {Fast}                 A new Fast object, containing the results.
   */
  Fast.prototype.filter = function Fast$filter (fn, thisContext) {
    return new Fast(Fast.filter(this.value, fn, thisContext));
  };

  /**
   * Fast Reduce
   *
   * @param  {Function} fn           The reducer function.
   * @param  {mixed}    initialValue The initial value, if any.
   * @param  {Object}   thisContext  The context for the reducer, if any.
   * @return {mixed}                 The final result.
   */
  Fast.prototype.reduce = function Fast$reduce (fn, initialValue, thisContext) {
    return Fast.reduce(this.value, fn, initialValue, thisContext);
  };


  /**
   * Fast Reduce Right
   *
   * @param  {Function} fn           The reducer function.
   * @param  {mixed}    initialValue The initial value, if any.
   * @param  {Object}   thisContext  The context for the reducer, if any.
   * @return {mixed}                 The final result.
   */
  Fast.prototype.reduceRight = function Fast$reduceRight (fn, initialValue, thisContext) {
    return Fast.reduceRight(this.value, fn, initialValue, thisContext);
  };

  /**
   * Fast For Each
   *
   * @param  {Function} fn          The visitor function.
   * @param  {Object}   thisContext The context for the visitor, if any.
   * @return {Fast}                 The Fast instance.
   */
  Fast.prototype.forEach = function Fast$forEach (fn, thisContext) {
    Fast.forEach(this.value, fn, thisContext);
    return this;
  };

  /**
   * Fast Some
   *
   * @param  {Function} fn          The matcher predicate.
   * @param  {Object}   thisContext The context for the matcher, if any.
   * @return {Boolean}              True if at least one element matches.
   */
  Fast.prototype.some = function Fast$some (fn, thisContext) {
    return Fast.some(this.value, fn, thisContext);
  };

  /**
   * Fast Index Of
   *
   * @param  {mixed}  target    The target to lookup.
   * @param  {Number} fromIndex The index to start searching from, if known.
   * @return {Number}           The index of the item, or -1 if no match found.
   */
  Fast.prototype.indexOf = function Fast$indexOf (target, fromIndex) {
    return Fast.indexOf(this.value, target, fromIndex);
  };


  /**
   * Fast Last Index Of
   *
   * @param  {mixed}  target    The target to lookup.
   * @param  {Number} fromIndex The index to start searching from, if known.
   * @return {Number}           The last index of the item, or -1 if no match found.
   */
  Fast.prototype.lastIndexOf = function Fast$lastIndexOf (target, fromIndex) {
    return Fast.lastIndexOf(this.value, target, fromIndex);
  };

  /**
   * Reverse
   *
   * @return {Fast} A new Fast instance, with the contents reversed.
   */
  Fast.prototype.reverse = function Fast$reverse () {
    return new Fast(this.value.reverse());
  };

  /**
   * Value Of
   *
   * @return {Array} The wrapped value.
   */
  Fast.prototype.valueOf = function Fast$valueOf () {
    return this.value;
  };

  /**
   * To JSON
   *
   * @return {Array} The wrapped value.
   */
  Fast.prototype.toJSON = function Fast$toJSON () {
    return this.value;
  };

  /**
   * Item Length
   */
  Object.defineProperty(Fast.prototype, 'length', {
    get: function () {
      return this.value.length;
    }
  });

  /**
   * # Bind
   * Analogue of `Function::bind()`.
   *
   * ```js
   * var bind = require('fast.js').bind;
   * var bound = bind(myfunc, this, 1, 2, 3);
   *
   * bound(4);
   * ```
   *
   *
   * @param  {Function} fn          The function which should be bound.
   * @param  {Object}   thisContext The context to bind the function to.
   * @param  {mixed}    args, ...   Additional arguments to pre-bind.
   * @return {Function}             The bound function.
   */
  Fast.bind = function fastBind (fn, thisContext) {
    var boundLength = arguments.length - 2,
        boundArgs;

    if (boundLength > 0) {
      boundArgs = new ArrayLike(boundLength);
      for (var i = 0; i < boundLength; i++) {
        boundArgs[i] = arguments[i + 2];
      }
      if (thisContext !== undefined) {
        return function () {
          var length = arguments.length,
              args = new ArrayLike(boundLength + length),
              i;
          for (i = 0; i < boundLength; i++) {
            args[i] = boundArgs[i];
          }
          for (i = 0; i < length; i++) {
            args[boundLength + i] = arguments[i];
          }
          return applyWithContext(fn, thisContext, args);
        };
      }
      else {
        return function () {
          var length = arguments.length,
              args = new ArrayLike(boundLength + length),
              i;
          for (i = 0; i < boundLength; i++) {
            args[i] = boundArgs[i];
          }
          for (i = 0; i < length; i++) {
            args[boundLength + i] = arguments[i];
          }
          return applyNoContext(fn, args);
        };
      }
    }
    if (thisContext !== undefined) {
      return function () {
        return applyWithContext(fn, thisContext, arguments);
      };
    }
    else {
      return function () {
        return applyNoContext(fn, arguments);
      };
    }
  };

  /**
   * # Partial Application
   *
   * Partially apply a function. This is similar to `.bind()`,
   * but with one important difference - the returned function is not bound
   * to a particular context. This makes it easy to add partially
   * applied methods to objects. If you need to bind to a context,
   * use `.bind()` instead.
   *
   * > Note: This function does not support partial application for
   * constructors, for that see `partialConstructor()`
   *
   *
   * @param  {Function} fn          The function to partially apply.
   * @param  {mixed}    args, ...   Arguments to pre-bind.
   * @return {Function}             The partially applied function.
   */
  Fast.partial = function fastPartial (fn) {
    var boundLength = arguments.length - 1,
        boundArgs;

    boundArgs = new ArrayLike(boundLength);
    for (var i = 0; i < boundLength; i++) {
      boundArgs[i] = arguments[i + 1];
    }
    return function () {
      var length = arguments.length,
          args = new ArrayLike(boundLength + length),
          i;
      for (i = 0; i < boundLength; i++) {
        args[i] = boundArgs[i];
      }
      for (i = 0; i < length; i++) {
        args[boundLength + i] = arguments[i];
      }
      return applyWithContext(fn, this, args);
    };
  };

  /**
   * # Partial Constructor
   *
   * Partially apply a constructor function. The returned function
   * will work with or without the `new` keyword.
   *
   *
   * @param  {Function} fn          The constructor function to partially apply.
   * @param  {mixed}    args, ...   Arguments to pre-bind.
   * @return {Function}             The partially applied constructor.
   */
  Fast.partialConstructor = function fastPartialConstructor (fn) {
    var boundLength = arguments.length - 1,
        boundArgs;

    boundArgs = new ArrayLike(boundLength);
    for (var i = 0; i < boundLength; i++) {
      boundArgs[i] = arguments[i + 1];
    }
    return function partialed () {
      var length = arguments.length,
          args = new ArrayLike(boundLength + length),
          i;
      for (i = 0; i < boundLength; i++) {
        args[i] = boundArgs[i];
      }
      for (i = 0; i < length; i++) {
        args[boundLength + i] = arguments[i];
      }

      var thisContext = Object.create(fn.prototype),
          result = applyWithContext(fn, thisContext, args);

      if (result != null && (typeof result === 'object' || typeof result === 'function')) {
        return result;
      }
      else {
        return thisContext;
      }
    };
  };

  /**
   * # Clone
   *
   * Clone an item. Primitive values will be returned directly,
   * arrays and objects will be shallow cloned. If you know the
   * type of input you're dealing with, call `.cloneArray()` or `.cloneObject()`
   * instead.
   *
   * @param  {mixed} input The input to clone.
   * @return {mixed}       The cloned input.
   */
  Fast.clone = function clone (input) {
    if (!input || typeof input !== 'object') {
      return input;
    }
    else if (ArrayLike.isArray(input)) {
      return Fast.cloneArray(input);
    }
    else {
      return Fast.cloneObject(input);
    }
  };

  /**
   * # Clone Array
   *
   * Clone an array or array like object (e.g. `arguments`).
   * This is the equivalent of calling `Array.prototype.slice.call(arguments)`, but
   * significantly faster.
   *
   * @param  {Array} input The array or array-like object to clone.
   * @return {Array}       The cloned array.
   */
  Fast.cloneArray = function fastCloneArray (input) {
    var length = input.length,
        sliced = new ArrayLike(length),
        i;
    for (i = 0; i < length; i++) {
      sliced[i] = input[i];
    }
    return sliced;
  };

  /**
   * # Clone Object
   *
   * Shallow clone a simple object.
   *
   * > Note: Prototypes and non-enumerable properties will not be copied!
   *
   * @param  {Object} input The object to clone.
   * @return {Object}       The cloned object.
   */
  Fast.cloneObject = function fastCloneObject (input) {
    var keys = Object.keys(input),
        total = keys.length,
        cloned = {},
        i, key;

    for (i = 0; i < total; i++) {
      key = keys[i];
      cloned[key] = input[key];
    }

    return cloned;
  };


  /**
   * # Concat
   *
   * Concatenate multiple arrays.
   *
   * > Note: This function is effectively identical to `Array.prototype.concat()`.
   *
   *
   * @param  {Array|mixed} item, ... The item(s) to concatenate.
   * @return {Array}                 The array containing the concatenated items.
   */
  Fast.concat = function fastConcat () {
    var length = arguments.length,
        arr = new ArrayLike(),
        i, item, childLength, j;

    for (i = 0; i < length; i++) {
      item = arguments[i];
      if (ArrayLike.isArray(item)) {
        childLength = item.length;
        for (j = 0; j < childLength; j++) {
          arr.push(item[j]);
        }
      }
      else {
        arr.push(item);
      }
    }
    return arr;
  };

  /**
   * # Map
   *
   * A fast `.map()` implementation.
   *
   * @param  {Array}    subject     The array (or array-like) to map over.
   * @param  {Function} fn          The mapper function.
   * @param  {Object}   thisContext The context for the mapper.
   * @return {Array}                The array containing the results.
   */
  Fast.map = function fastMap (subject, fn, thisContext) {
    var length = subject.length,
        result = new ArrayLike(length),
        iterator = thisContext !== undefined ? bindInternal3(fn, thisContext) : fn,
        i;
    for (i = 0; i < length; i++) {
      result[i] = iterator(subject[i], i, subject);
    }
    return result;
  };

  /**
   * # Filter
   *
   * A fast `.filter()` implementation.
   *
   * @param  {Array}    subject     The array (or array-like) to filter.
   * @param  {Function} fn          The filter function.
   * @param  {Object}   thisContext The context for the filter.
   * @return {Array}                The array containing the results.
   */
  Fast.filter = function fastFilter (subject, fn, thisContext) {
    var length = subject.length,
        result = new ArrayLike(),
        iterator = thisContext !== undefined ? bindInternal3(fn, thisContext) : fn,
        i;
    for (i = 0; i < length; i++) {
      if (iterator(subject[i], i, subject)) {
        result.push(subject[i]);
      }
    }
    return result;
  };

  /**
   * # Reduce
   *
   * A fast `.reduce()` implementation.
   *
   * @param  {Array}    subject      The array (or array-like) to reduce.
   * @param  {Function} fn           The reducer function.
   * @param  {mixed}    initialValue The initial value for the reducer, defaults to subject[0].
   * @param  {Object}   thisContext  The context for the reducer.
   * @return {mixed}                 The final result.
   */
  Fast.reduce = function fastReduce (subject, fn, initialValue, thisContext) {
    var length = subject.length,
        iterator = thisContext !== undefined ? bindInternal4(fn, thisContext) : fn,
        i, result;

    if (initialValue === undefined) {
      i = 1;
      result = subject[0];
    }
    else {
      i = 0;
      result = initialValue;
    }

    for (; i < length; i++) {
      result = iterator(result, subject[i], i, subject);
    }

    return result;
  };

  /**
   * # Reduce Right
   *
   * A fast `.reduceRight()` implementation.
   *
   * @param  {Array}    subject      The array (or array-like) to reduce.
   * @param  {Function} fn           The reducer function.
   * @param  {mixed}    initialValue The initial value for the reducer, defaults to subject[0].
   * @param  {Object}   thisContext  The context for the reducer.
   * @return {mixed}                 The final result.
   */
  Fast.reduceRight = function fastReduce (subject, fn, initialValue, thisContext) {
    var length = subject.length,
        iterator = thisContext !== undefined ? bindInternal4(fn, thisContext) : fn,
        i, result;

    if (initialValue === undefined) {
      i = length - 2;
      result = subject[length - 1];
    }
    else {
      i = length - 1;
      result = initialValue;
    }

    for (; i >= 0; i--) {
      result = iterator(result, subject[i], i, subject);
    }

    return result;
  };


  /**
   * # For Each
   *
   * A fast `.forEach()` implementation.
   *
   * @param  {Array}    subject     The array (or array-like) to iterate over.
   * @param  {Function} fn          The visitor function.
   * @param  {Object}   thisContext The context for the visitor.
   */
  Fast.forEach = function fastForEach (subject, fn, thisContext) {
    var length = subject.length,
        iterator = thisContext !== undefined ? bindInternal3(fn, thisContext) : fn,
        i;
    for (i = 0; i < length; i++) {
      iterator(subject[i], i, subject);
    }
  };

  /**
   * # Some
   *
   * A fast `.some()` implementation.
   *
   * @param  {Array}    subject     The array (or array-like) to iterate over.
   * @param  {Function} fn          The visitor function.
   * @param  {Object}   thisContext The context for the visitor.
   * @return {Boolean}              true if at least one item in the array passes the truth test.
   */
  Fast.some = function fastSome (subject, fn, thisContext) {
    var length = subject.length,
        iterator = thisContext !== undefined ? bindInternal3(fn, thisContext) : fn,
        i;
    for (i = 0; i < length; i++) {
      if (iterator(subject[i], i, subject)) {
        return true;
      }
    }
    return false;
  };

  /**
   * # Index Of
   *
   * A faster `Array.prototype.indexOf()` implementation.
   *
   * @param  {Array}  subject   The array (or array-like) to search within.
   * @param  {mixed}  target    The target item to search for.
   * @param  {Number} fromIndex The position to start searching from, if known.
   * @return {Number}           The position of the target in the subject, or -1 if it does not exist.
   */
  Fast.indexOf = function fastIndexOf (subject, target, fromIndex) {
    var length = subject.length,
        i = 0;

    if (typeof fromIndex === 'number') {
      i = fromIndex;
      if (i < 0) {
        i += length;
        if (i < 0) {
          i = 0;
        }
      }
    }

    for (; i < length; i++) {
      if (subject[i] === target) {
        return i;
      }
    }
    return -1;
  };



  /**
   * # Last Index Of
   *
   * A faster `Array.prototype.lastIndexOf()` implementation.
   *
   * @param  {Array}  subject The array (or array-like) to search within.
   * @param  {mixed}  target  The target item to search for.
   * @param  {Number} fromIndex The position to start searching backwards from, if known.
   * @return {Number}         The last position of the target in the subject, or -1 if it does not exist.
   */
  Fast.lastIndexOf = function fastLastIndexOf (subject, target, fromIndex) {
    var length = subject.length,
        i = length - 1;

    if (typeof fromIndex === 'number') {
      i = fromIndex;
      if (i < 0) {
        i += length;
      }
    }
    for (; i >= 0; i--) {
      if (subject[i] === target) {
        return i;
      }
    }
    return -1;
  };

  /**
   * # Try
   *
   * Allows functions to be optimised by isolating `try {} catch (e) {}` blocks
   * outside the function declaration. Returns either the result of the function or an Error
   * object if one was thrown. The caller should then check for `result instanceof Error`.
   *
   * ```js
   * var result = fast.try(myFunction);
   * if (result instanceof Error) {
   *    console.log('something went wrong');
   * }
   * else {
   *   console.log('result:', result);
   * }
   * ```
   *
   * @param  {Function} fn The function to invoke.
   * @return {mixed}       The result of the function, or an `Error` object.
   */
  Fast['try'] = function fastTry (fn) {
    try {
      return fn();
    }
    catch (e) {
      if (!(e instanceof Error)) {
        return new Error(e);
      }
      else {
        return e;
      }
    }
  };

  // alias of `.try()` for older JS engines.
  Fast.attempt = Fast['try'];

  /**
   * # Apply
   *
   * Faster version of `Function::apply()`, optimised for 8 arguments or fewer.
   *
   *
   * @param  {Function} subject   The function to apply.
   * @param  {Object} thisContext The context for the function, set to undefined or null if no context is required.
   * @param  {Array} args         The arguments for the function.
   * @return {mixed}              The result of the function invocation.
   */
  Fast.apply = function fastApply (subject, thisContext, args) {
    return thisContext !== undefined ? applyWithContext(subject, thisContext, args) : applyNoContext(subject, args);
  };


  /**
   * Internal helper for applying a function with a context.
   */
  function applyWithContext (subject, thisContext, args) {
    switch (args.length) {
      case 0:
        return subject.call(thisContext);
      case 1:
        return subject.call(thisContext, args[0]);
      case 2:
        return subject.call(thisContext, args[0], args[1]);
      case 3:
        return subject.call(thisContext, args[0], args[1], args[2]);
      case 4:
        return subject.call(thisContext, args[0], args[1], args[2], args[3]);
      case 5:
        return subject.call(thisContext, args[0], args[1], args[2], args[3], args[4]);
      case 6:
        return subject.call(thisContext, args[0], args[1], args[2], args[3], args[4], args[5]);
      case 7:
        return subject.call(thisContext, args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
      case 8:
        return subject.call(thisContext, args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7]);
      default:
        return subject.apply(thisContext, args);
    }
  }

  /**
   * Internal helper for applying a function without a context.
   */
  function applyNoContext (subject, args) {
    switch (args.length) {
      case 0:
        return subject();
      case 1:
        return subject(args[0]);
      case 2:
        return subject(args[0], args[1]);
      case 3:
        return subject(args[0], args[1], args[2]);
      case 4:
        return subject(args[0], args[1], args[2], args[3]);
      case 5:
        return subject(args[0], args[1], args[2], args[3], args[4]);
      case 6:
        return subject(args[0], args[1], args[2], args[3], args[4], args[5]);
      case 7:
        return subject(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
      case 8:
        return subject(args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7]);
      default:
        return subject.apply(undefined, args);
    }
  }

  /**
   * Internal helper to bind a function known to have 3 arguments
   * to a given context.
   */
  function bindInternal3 (func, thisContext) {
    return function (a, b, c) {
      return func.call(thisContext, a, b, c);
    };
  }

  /**
   * Internal helper to bind a function known to have 4 arguments
   * to a given context.
   */
  function bindInternal4 (func, thisContext) {
    return function (a, b, c, d) {
      return func.call(thisContext, a, b, c, d);
    };
  }

  /**
   * Fast gets returned from the module.exports function
   */
  return Fast;
};

},{}],3:[function(_dereq_,module,exports){
var poser = _dereq_('./src/node');

module.exports = poser;

['Array', 'Function', 'Object', 'Date', 'String'].forEach(pose);

function pose (type) {
  poser[type] = function poseComputedType () { return poser(type); };
}

},{"./src/node":4}],4:[function(_dereq_,module,exports){
'use strict';

var vm = _dereq_('vm');

function poser (type) {
  var sandbox = {};
  vm.runInNewContext('stolen=' + type + ';', sandbox, 'poser.vm');
  return sandbox.stolen;
}

module.exports = poser;

},{"vm":7}],5:[function(_dereq_,module,exports){
/*! collection- v0.0.0 - MIT license */

"use strict";
module.exports = (function() {

  var poser = _dereq_( "poser" );
  var Collection = poser.Array();
  var fast = _dereq_( "fast-poser" )( Collection );

  var cp = Collection.prototype;

  function isCollection( obj ) {
    return obj instanceof Collection;
  }

  function isFunction( obj ) {
    return typeof obj === "function";
  }

  function isArrayLike( obj ) {
    return Object.prototype.toString.call( obj ) === "[object Array]";
  }

  function keys( obj ) {
    return factory( Object.keys( obj ) );
  }

  function mixin( target, source ) {
    keys( source ).each( function ( key ) {
      target[key] = source[key];
    });
    return target;
  }

  function matches( against, obj ) {
    return keys( against ).every( function ( key ) {
      return obj[key] === against[key];
    });
  }

  function flip( fn ) {
    return function( a, b ) {
      return fn.call( this, b, a );
    };
  }

  function get( prop ) {
    return function ( obj ) {
      return obj[prop];
    };
  }

  function getSkip( _, idx ) {
    return get( idx );
  }

  function not( fn ) {
    return function() {
      return !fn.apply( this, arguments );
    };
  }

  function contains( obj, value ) {
    return cp.indexOf.call( obj, value ) > -1;
  }

  function containsReverse( value, obj ) {
    return cp.indexOf.call( obj, value ) > -1;
  }

  function isTruthy( value ) {
    return !!value;
  }

  function identity( value ) {
    return value;
  }

  function iterator( value ) {
    if ( value == null ) {
      return identity;
    } else if ( isFunction( value ) ) {
      return value;
    } else {
      return get( value );
    }
  }

  function breakableEach( obj, callback ) {
    var result;
    for ( var i = 0; i < obj.length; i++ ) {
      result = callback( obj[i], i, obj );
      if ( result === false ) {
        return result;
      }
    }
    return null;
  }

  // helpers
  var slice = Function.prototype.call.bind( cp.slice );

  // create chainable versions of these native methods
  ["push", "pop", "shift", "unshift"].forEach( function( method ) {
    // new methods will be named cPush, cPop, cShift, cUnshift
    var name = "c" + method.charAt( 0 ).toUpperCase() + method.slice( 1 );
    Collection.prototype[name] = function() {
      Collection.prototype[method].apply( this, arguments );
      return this;
    };
  });

  ["forEach", "map", "reduce", "filter", "some", "every"].forEach( function( method ) {
    var name = "slow" + method.charAt( 0 ).toUpperCase()  + method.slice( 1 );
    var prev = Collection.prototype[method];
    Collection.prototype[name] = function() {
      return prev.apply( this, arguments );
    };
  });

  // Methods that we're delegating to fast.js
  cp.forEach = function( fn, thisArg ) {
    return fast.forEach( this, fn, thisArg );
  };

  cp.map = function( fn, thisArg ) {
    return fast.map( this, fn, thisArg );
  };

  cp.reduce = function( fn, initialValue, thisArg ) {
    return fast.reduce( this, fn, thisArg );
  };

  cp.reduceRight = function( fn, initialValue, thisArg ) {
    return fast.reduceRight( this, fn, thisArg );
  };

  cp.filter = function( fn, thisArg ) {
    return fast.filter( this, fn, thisArg );
  };

  cp.indexOf = function( target ) {
    return fast.indexOf( this, target );
  };

  cp.lastIndexOf = function( target ) {
    return fast.lastIndexOf( this, target );
  };

  cp.some = function( fn, thisContext ) {
    return fast.some( this, fn, thisContext );
  };

  // aliases for native methods.
  cp.each = cp.forEach;
  cp.collect = cp.map;
  cp.select = cp.filter;

  cp.forEachRight = function( fn ) {
    this.slice().reverse().each( fn );
  };
  cp.eachRight = cp.forEachRight;

  cp.where = function( obj ) {
    return this.filter( fast.partial( matches, obj ) );
  };

  cp.whereNot = function( obj ) {
    return this.filter( not( fast.partial( matches, obj ) ) );
  };

  cp.find = function( testFn ) {
    var result = null;
    breakableEach( this, function( el, i, arr ) {
      if ( testFn( el, i, arr ) ) {
        result = el;
        return false;
      }
    });
    return result;
  };

  cp.findNot = function( testFn ) {
    return this.find( not( testFn ) );
  };

  cp.findWhere = function( obj ) {
    return this.find( fast.partial( matches, obj ) );
  };

  cp.findWhereNot = function( obj ) {
    return this.find( not( fast.partial( matches, obj ) ) );
  };

  cp.pluck = function( prop ) {
    return this.map( get( prop ) );
  };

  cp.pick = function() {
    var props = new Array( arguments.length );
    for ( var i = 0; i < args.length; i++ ) {
      args[i] = arguments[i];
    }
    return this.map( function( el ) {
      var obj = {};
      props.each( function( prop ) {
        obj[prop] = el[prop];
      });
      return obj;
    });
  };

  cp.reject = function( testFn ) {
    return this.filter( not( testFn ) );
  };

  cp.invoke = function( fnOrMethod ) {
    var args = new Array( arguments.length - 1 );
    for ( var i = 0; i < args.length; i++ ) {
      args[i] = arguments[i + 1];
    }
    this.forEach( function( el ) {
      ( isFunction( fnOrMethod ) ? fnOrMethod : el[fnOrMethod] ).apply( el, args );
    });
    return this;
  };

  cp.without = function() {
    var args = new Array( arguments.length );
    for ( var i = 0; i < args.length; i++ ) {
      args[i] = arguments[i];
    }
    return this.reject( fast.partial( contains, args ) );
  };
  cp.remove = cp.without;

  cp.contains = function( obj ) {
    return contains( this, obj );
  };

  cp.tap = function( fn ) {
    fn( this );
    return this;
  };

  cp.clone = function() {
    return this.slice();
  };

  // todo
  // cp.cloneDeep = function() {

  // };

  cp.first = function( num ) {
    if ( num == null ) {
      return this[0];
    }
    return this.slice( 0, num );
  };
  cp.head = cp.first;
  cp.take = cp.first;

  cp.initial = function( num ) {
    if ( num == null ) {
      num = 1;
    }
    return this.slice( 0, this.length - num );
  };

  cp.last = function( num ) {
    if ( num == null ) {
      return this[this.length - 1];
    }
    return this.slice( 0, -1 * num );
  };

  cp.rest = function( num ) {
    if ( num == null ) {
      num = 1;
    }
    return this.slice( num );
  };
  cp.tail = cp.rest;
  cp.drop = cp.rest;

  cp.compact = function() {
    return this.filter( isTruthy );
  };

  // TODO
  // cp.flatten = function() {

  // };

  cp.partition = function( testFn ) {
    var pass = new Collection();
    var fail = new Collection();
    this.each( function( el, i, arr ) {
      ( testFn( el, i, arr ) ? pass : fail ).push( el );
    });
    return factory([ pass, fail ]);
  };

  cp.union = function() {
    return cp.concat.apply( this, arguments ).unique();
  };

  cp.intersection = function() {
    var result = new Collection();
    var args = new Array( arguments.length );
    for ( var i = 0; i < args.length; i++ ) {
      args[i] = arguments[i];
    }
    this.each( function( el ) {
      var has = args.every( fast.partial( containsReverse, el ) );
      if ( has ) {
        result.push( el );
      }
    });
    return result;
  };

  cp.difference = function() {
    var result = new Collection();
    var args = new Array( arguments.length );
    for ( var i = 0; i < args.length; i++ ) {
      args[i] = arguments[i];
    }
    this.each( function( el ) {
      var notHas = args.every( not( fast.partial( containsReverse, el ) ) );
      if ( notHas ) {
        result.push( el );
      }
    });
    return result;
  };

  cp.unique = function() {
    var found = new Collection();
    this.each( function( el ) {
      if ( !found.contains( el ) ) {
        found.push( el );
      }
    });
    return found;
  };
  cp.uniq = cp.unique;

  // ripped off from Underscore
  cp.sortBy = function( itr, ctx ) {
    itr = iterator( itr );
    return cp.pluck.call(
      this.map( function( val, i, obj ) {
        return {
          val: val,
          i: i,
          param: itr.call( ctx, val, i, obj )
        };
      }).sort( function( left, right ) {
        var a = left.param;
        var b = right.param;
        if ( a !== b ) {
          if ( a > b || a === undefined ) {
            return 1;
          }
          if ( a < b || b === undefined ) {
            return -1;
          }
        }
        return left.index - right.index;
      }),
    "val" );
  };

  cp.zip = function() {
    var args = new Collection( arguments.length );
    for ( var i = 0; i < args.length; i++ ) {
      args[i] = arguments[i];
    }
    return args
      .cUnshift( this )
      .map( factoryOne )
      .sortBy( "length" )
      .last()
      .map( function ( item, i ) {
        return args.map( get( i ) );
      });
  };

  cp.min = function( prop ) {
    if ( prop ) {
      return cp.min.call( this.pluck( prop ) );
    }
    return Math.min.apply( Math, this );
  };

  cp.max = function( prop ) {
    if ( prop ) {
      return cp.max.call( this.pluck( prop ) );
    }
    return Math.max.apply( Math, this );
  };

  cp.extent = function( prop ) {
    return [ this.min( prop ), this.max( prop ) ];
  };

  cp.toArray = function() {
    return Array.prototype.slice.call( this );
  };

  mixin( cp, _dereq_( "./imperatives.js" ) );

  function factory () {
    var len = arguments.length;
    var args;
    var ret;

    if ( len === 0 ) {
      return new Collection();
    }

    if ( len === 1 && isArrayLike( arguments[0] ) ) {
      ret = new Collection();
      cp.push.apply( ret, arguments[0] );
      return ret;
    }

    if ( len === 1 && typeof arguments[0] === "number") {
      return new Collection( arguments[0] );
    }

    args = new Collection( len );
    for ( var i = 0; i < args.length; i++ ) {
      args[i] = arguments[i];
    }
    return factory( args );
  }

  function factoryOne () {
    return factory( arguments[0] );
  }

  factory.ctor = Collection;
  factory.proto = Collection.prototype;

  factory.isCollection = isCollection;
  factory.isArrayLike = isArrayLike;

  return factory;

})();

},{"./imperatives.js":6,"fast-poser":2,"poser":3}],6:[function(_dereq_,module,exports){
"use strict";

function matches( against, obj ) {
  for ( var prop in against ) {
    if ( obj[prop] !== against[prop] ) { 
      return false;
    }
  }
  return true;
}

var methods = {
  imperativeWhere: function( obj ) {
    var results = [];
    var i = 0;
    var len = this.length;
    while ( i < len ) {
      if ( matches( this[i], obj ) ) {
        results.push( this[i] );
      }
      i++;
    }
    return results;
  },

  imperativeWhereNot: function( obj ) {
    var results = [];
    var i = 0;
    var len = this.length;
    while ( i < len ) {
      if ( !matches( this[i], obj ) ) {
        results.push( this[i] );
      }
      i++;
    }
    return results;
  },

  imperativeFind: function( testFn ) {
    var i = 0;
    var len = this.length;
    while ( i < len ) {
      if ( testFn( this[i], i, this ) ) {
        return this[i];
      }
      i++;
    }
    return null;
  },

  imperativeFindWhere: function( obj ) {
    var fn = function( item ) { 
      return matches( item, obj );
    };
    return this.imperativeFind( fn );
  },

  imperativeFindWhereNot: function( obj ) {
    var fn = function( item ) { 
      return !matches( item, obj );
    };
    return this.imperativeFind( fn );
  }
};

module.exports = methods;
},{}],7:[function(_dereq_,module,exports){
var indexOf = _dereq_('indexof');

var Object_keys = function (obj) {
    if (Object.keys) return Object.keys(obj)
    else {
        var res = [];
        for (var key in obj) res.push(key)
        return res;
    }
};

var forEach = function (xs, fn) {
    if (xs.forEach) return xs.forEach(fn)
    else for (var i = 0; i < xs.length; i++) {
        fn(xs[i], i, xs);
    }
};

var defineProp = (function() {
    try {
        Object.defineProperty({}, '_', {});
        return function(obj, name, value) {
            Object.defineProperty(obj, name, {
                writable: true,
                enumerable: false,
                configurable: true,
                value: value
            })
        };
    } catch(e) {
        return function(obj, name, value) {
            obj[name] = value;
        };
    }
}());

var globals = ['Array', 'Boolean', 'Date', 'Error', 'EvalError', 'Function',
'Infinity', 'JSON', 'Math', 'NaN', 'Number', 'Object', 'RangeError',
'ReferenceError', 'RegExp', 'String', 'SyntaxError', 'TypeError', 'URIError',
'decodeURI', 'decodeURIComponent', 'encodeURI', 'encodeURIComponent', 'escape',
'eval', 'isFinite', 'isNaN', 'parseFloat', 'parseInt', 'undefined', 'unescape'];

function Context() {}
Context.prototype = {};

var Script = exports.Script = function NodeScript (code) {
    if (!(this instanceof Script)) return new Script(code);
    this.code = code;
};

Script.prototype.runInContext = function (context) {
    if (!(context instanceof Context)) {
        throw new TypeError("needs a 'context' argument.");
    }
    
    var iframe = document.createElement('iframe');
    if (!iframe.style) iframe.style = {};
    iframe.style.display = 'none';
    
    document.body.appendChild(iframe);
    
    var win = iframe.contentWindow;
    var wEval = win.eval, wExecScript = win.execScript;

    if (!wEval && wExecScript) {
        // win.eval() magically appears when this is called in IE:
        wExecScript.call(win, 'null');
        wEval = win.eval;
    }
    
    forEach(Object_keys(context), function (key) {
        win[key] = context[key];
    });
    forEach(globals, function (key) {
        if (context[key]) {
            win[key] = context[key];
        }
    });
    
    var winKeys = Object_keys(win);

    var res = wEval.call(win, this.code);
    
    forEach(Object_keys(win), function (key) {
        // Avoid copying circular objects like `top` and `window` by only
        // updating existing context properties or new properties in the `win`
        // that was only introduced after the eval.
        if (key in context || indexOf(winKeys, key) === -1) {
            context[key] = win[key];
        }
    });

    forEach(globals, function (key) {
        if (!(key in context)) {
            defineProp(context, key, win[key]);
        }
    });
    
    document.body.removeChild(iframe);
    
    return res;
};

Script.prototype.runInThisContext = function () {
    return eval(this.code); // maybe...
};

Script.prototype.runInNewContext = function (context) {
    var ctx = Script.createContext(context);
    var res = this.runInContext(ctx);

    forEach(Object_keys(ctx), function (key) {
        context[key] = ctx[key];
    });

    return res;
};

forEach(Object_keys(Script.prototype), function (name) {
    exports[name] = Script[name] = function (code) {
        var s = Script(code);
        return s[name].apply(s, [].slice.call(arguments, 1));
    };
});

exports.createScript = function (code) {
    return exports.Script(code);
};

exports.createContext = Script.createContext = function (context) {
    var copy = new Context();
    if(typeof context === 'object') {
        forEach(Object_keys(context), function (key) {
            copy[key] = context[key];
        });
    }
    return copy;
};

},{"indexof":8}],8:[function(_dereq_,module,exports){

var indexOf = [].indexOf;

module.exports = function(arr, obj){
  if (indexOf) return arr.indexOf(obj);
  for (var i = 0; i < arr.length; ++i) {
    if (arr[i] === obj) return i;
  }
  return -1;
};
},{}]},{},[1])
(1)
});