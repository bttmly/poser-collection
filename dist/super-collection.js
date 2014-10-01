!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var o;"undefined"!=typeof window?o=window:"undefined"!=typeof global?o=global:"undefined"!=typeof self&&(o=self),o.collection=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
/*! collection- v0.0.0 - MIT license */

"use strict";

var poser = require( "poser" );
var Collection = poser.Array();
var fast = require( "./fast" )( Collection );

var cp = Collection.prototype;

function isCollection ( obj ) {
  return obj instanceof Collection;
}

function isFunction ( obj ) {
  return typeof obj === "function";
}

function isArrayish ( obj ) {
  return Object.prototype.toString.call( obj ) === "[object Array]";
}

function factory () {
  var len = arguments.length;
  var args;

  if ( len === 0 ) {
    return new Collection();
  }

  if ( len === 1 && isArrayish( arguments[0] ) ) {
    return new Collection().concat( arguments[0] );
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

function factoryDeep ( arr ) {
  return new Collection().concat( arr ).map( function ( item ) {
    return isArrayish( item ) ? factoryDeep( item ) : item;
  });
}

function extend ( target, source ) {
  return Object.keys( source ).reduce( function ( tgt, key ) {
    tgt[key] = source[key];
    return tgt;
  }, target );
}

function keys ( obj ) {
  return factory( Object.keys( obj ) );
}

function matches ( against, obj ) {
  return keys( against ).every( function ( key ) {
    return obj[key] === against[key];
  });
}

function flip ( fn ) {
  return function ( a, b ) {
    return fn.call( this, b, a );
  };
}

function get ( prop ) {
  return function ( obj ) {
    return obj[prop];
  };
}

function not ( fn ) {
  return function () {
    return !fn.apply( this, arguments );
  };
}

function contains ( obj, value ) {
  return cp.indexOf.call( obj, value ) > -1;
}

function identity ( value ) {
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

function flatten ( arr ) {
  return arr.reduce( function ( acc, item ) {
    return acc.chainPush.apply( acc, isArrayish( item ) ? flatten( item ) : [ item ] );
  }, new Collection() );
}

function invoke ( obj, fnOrMethod ) {
  var args = new Collection( arguments.length );
  for ( var i = 0; i < args.length; i++ ) {
    args[i] = arguments[i];
  }
  args = args.slice( 2 );
  return ( isFunction( fnOrMethod ) ? fnOrMethod : obj[fnOrMethod] ).apply( obj, args );
}

function collectify ( headers, rows ) {
  return rows.map( function ( item ) {
    return item.reduce( function ( model, val, i ) {
      model[ headers[i] ] = val;
      return model;
    }, {} );
  });
}

var containsFlip = flip( contains );
var partial = fast.partial;

// create chainable versions of these native methods
[ "push", "pop", "shift", "unshift" ].forEach( function( method ) {
  // new methods will be named chainPush, chainPop, chainShift, chainUnshift
  var name = "chain" + method.charAt( 0 ).toUpperCase() + method.slice( 1 );
  var original = cp[method];
  cp[name] = function() {
    original.apply( this, arguments );
    return this;
  };
});

[ "forEach", "map", "reduce", "reduceRight", "filter", "some", "every", "indexOf", "lastIndexOf" ].forEach( function( method ) {
  var name = "native" + method.charAt( 0 ).toUpperCase()  + method.slice( 1 );
  var original = cp[method];
  delete cp[method];
  cp[name] = function() {
    return original.apply( this, arguments );
  };
});

// Methods that we're delegating to fast.js
cp.forEach = function( fn, thisArg ) {
  return fast.forEach( this, fn, thisArg );
};
cp.each = cp.forEach;

cp.map = function( fn, thisArg ) {
  return fast.map( this, fn, thisArg );
};
cp.collect = cp.map;

cp.reduce = function( fn, initialValue, thisArg ) {
  return fast.reduce( this, fn, initialValue, thisArg );
};

cp.reduceRight = function( fn, initialValue, thisArg ) {
  return fast.reduceRight( this, fn, initialValue, thisArg );
};

// Travis throws on functions implementing filter as fast.filter
// for an unknown reason.
cp.filter = function( fn, thisArg ) {
  // return fast.filter( this, fn, thisArg );
  return this.reduce( function ( acc, item, i, arr ) {
    if ( fn.call( thisArg, item, i, arr ) ) {
      acc.push( item );
    }
    return acc;
  }, new Collection() );
};
cp.select = cp.filter;

cp.indexOf = function( target ) {
  return fast.indexOf( this, target );
};

cp.lastIndexOf = function( target ) {
  return fast.lastIndexOf( this, target );
};

cp.some = function( fn, thisContext ) {
  return fast.some( this, fn, thisContext );
};

cp.every = function ( fn, thisContext ) {
  return fast.every( this, fn, thisContext );
};

cp.forEachRight = function ( fn ) {
  this.slice().reverse().each( fn );
};
cp.eachRight = cp.forEachRight;

cp.where = function ( obj ) {
  return this.filter( partial( matches, obj ) );
};

cp.whereNot = function ( obj ) {
  return this.filter( not( partial( matches, obj ) ) );
};

cp.find = function ( testFn ) {
  var result = null;
  this.some( function ( item, i, arr ) {
    var test = testFn( item, i, arr );
    if ( test ) {
      result = item;
      return true;
    }
  });
  return result;
};

cp.findNot = function ( testFn ) {
  return this.find( not( testFn ) );
};

cp.findWhere = function ( obj ) {
  return this.find( partial( matches, obj ) );
};

cp.findWhereNot = function ( obj ) {
  return this.find( not( partial( matches, obj ) ) );
};

cp.pluck = function ( prop ) {
  return this.map( get( prop ) );
};

cp.pick = function () {
  var props = new Collection( arguments.length );
  for ( var i = 0; i < props.length; i++ ) {
    props[i] = arguments[i];
  }
  return this.map( function ( el ) {
    var obj = {};
    props.each( function ( prop ) {
      obj[prop] = el[prop];
    });
    return obj;
  });
};

cp.reject = function ( testFn ) {
  return this.filter( not( testFn ) );
};

cp.invoke = function () {
  this.mapInvoke.apply( this, arguments );
  return this;
};

cp.mapInvoke = function () {
  var args = new Collection( arguments.length );
  for ( var i = 0; i < args.length; i++ ) {
    args[i] = arguments[i];
  }
  return this.map( function ( item ) {
    return invoke.apply( null, [item].concat( args ) );
  });
};

cp.without = function () {
  var args = new Collection( arguments.length );
  for ( var i = 0; i < args.length; i++ ) {
    args[i] = arguments[i];
  }
  return this.reject( partial( contains, args ) );
};
cp.remove = cp.without;

cp.contains = function ( obj ) {
  return contains( this, obj );
};

cp.tap = function ( fn ) {
  var args = new Collection( arguments.length );
  for ( var i = 0; i < args.length; i++ ) {
    args[i] = arguments[i];
  }
  fn( this, args.slice( 1 ) );
  return this;
};

cp.clone = function () {
  return fast.clone( this );
};

cp.first = function ( num ) {
  if ( num == null ) {
    return this[0];
  }
  return this.slice( 0, num );
};
cp.head = cp.first;
cp.take = cp.first;

cp.initial = function ( num ) {
  if ( num == null ) {
    num = 1;
  }
  return this.slice( 0, this.length - num );
};

cp.last = function ( num ) {
  if ( num == null ) {
    return this[this.length - 1];
  }
  return this.slice( 0, -1 * num );
};

cp.rest = function ( num ) {
  if ( num == null ) {
    num = 1;
  }
  return this.slice( num );
};
cp.tail = cp.rest;
cp.drop = cp.rest;

cp.compact = function () {
  return this.filter( identity );
};

cp.flatten = function () {
  return flatten( this );
};

cp.partition = function ( testFn ) {
  return this.reduce( function ( acc, item, i, arr ) {
    ( testFn( item, i, arr ) ? acc[0] : acc[1] ).push( item );
    return acc;
  }, factory( factory(), factory() ) );
};

cp.union = function () {
  return cp.concat.apply( this, arguments ).unique();
};

cp.intersection = function () {
  var args = new Collection( arguments.length );
  for ( var i = 0; i < args.length; i++ ) {
    args[i] = arguments[i];
  }
  return this.filter( function ( el ) {
    return args.every( partial( containsFlip, el ) );
  });
};

cp.difference = function () {
  var args = new Collection( arguments.length );
  for ( var i = 0; i < args.length; i++ ) {
    args[i] = arguments[i];
  }
  return this.filter( function ( el ) {
    return args.every( not( partial( containsFlip, el ) ) );
  });
};

cp.unique = function () {
  return this.reduce( function ( acc, item ) {
    if ( !acc.contains( item ) ) {
      return acc.chainPush( item );
    }
    return acc;
  }, new Collection() );
};
cp.uniq = cp.unique;

// ripped off from Underscore
cp.sortBy = function ( fn, thisArg ) {
  fn = iterator( fn );
  return cp.pluck.call(
    this.map( function ( val, i, obj ) {
      return {
        val: val,
        i: i,
        param: fn.call( thisArg, val, i, obj )
      };
    }).sort( function ( left, right ) {
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
      return left.i - right.i;
    }), "val" );
};

cp.zip = function () {
  var args = new Collection( arguments.length );
  for ( var i = 0; i < args.length; i++ ) {
    args[i] = arguments[i];
  }
  return args
    .chainUnshift( this )
    .map( factoryOne )
    .sortBy( "length" )
    .last()
    .map( function ( item, i ) {
      return args.map( get( i ) );
    });
};

cp.min = function ( prop ) {
  if ( prop ) {
    return cp.min.call( this.pluck( prop ) );
  }
  return Math.min.apply( Math, this );
};

cp.max = function ( prop ) {
  if ( prop ) {
    return cp.max.call( this.pluck( prop ) );
  }
  return Math.max.apply( Math, this );
};

cp.extent = function ( prop ) {
  return [ this.min( prop ), this.max( prop ) ];
};

cp.toArray = function () {
  return [].concat( this );
  // return Array.prototype.slice.call( this );
};

cp.toArrayDeep = function () {
  return this.toArray().map( function ( item ) {
    if ( isCollection( item ) ) {
      item = item.toArrayDeep();
    }
    return item;
  });
};

cp.asRowsOf = function ( headers ) {
  return collectify( headers, this );
};

cp.asHeadersOf = function ( rows ) {
  if ( !( rows instanceof Collection ) ) {
    rows = factory( rows );
  }
  return collectify( this, rows );
};

factory.ctor = Collection;
factory.proto = cp;

factory.extend = extend.bind( null, cp );

factory.isCollection = isCollection;
factory.isArrayish = isArrayish;

factory.one = factoryOne;
factory.deep = factoryDeep;

module.exports = factory;

},{"./fast":2,"poser":3}],2:[function(require,module,exports){
// implementations of forEach, map, reduce, reduceRight, indexOf, lastIndexOf, some, partial from fast.js
// https://github.com/codemix/fast.js

"use strict";

function bindInternal3 (func, thisContext) {
  return function (a, b, c) {
    return func.call(thisContext, a, b, c);
  };
}

function bindInternal4 (func, thisContext) {
  return function (a, b, c, d) {
    return func.call(thisContext, a, b, c, d);
  };
}

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

module.exports = function (ArrayLike) {
  return {
    forEach: function fastForEach (subject, fn, thisContext) {
      var length = subject.length,
          iterator = thisContext !== undefined ? bindInternal3(fn, thisContext) : fn,
          i;
      for (i = 0; i < length; i++) {
        iterator(subject[i], i, subject);
      }
    },

    map: function fastMap (subject, fn, thisContext) {
      var length = subject.length,
          result = new ArrayLike(length),
          iterator = thisContext !== undefined ? bindInternal3(fn, thisContext) : fn,
          i;
      for (i = 0; i < length; i++) {
        result[i] = iterator(subject[i], i, subject);
      }
      return result;
    },

    filter: function fastFilter (subject, fn, thisContext) {
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
    },

    reduce: function fastReduce (subject, fn, initialValue, thisContext) {
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
    },

    reduceRight: function fastReduce (subject, fn, initialValue, thisContext) {
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
    },

    indexOf: function fastIndexOf (subject, target, fromIndex) {
      var length = subject.length,
          i = 0;

      if (typeof fromIndex === "number") {
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
    },

    lastIndexOf: function fastLastIndexOf (subject, target, fromIndex) {
      var length = subject.length,
          i = length - 1;

      if (typeof fromIndex === "number") {
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
    },

    some: function fastSome (subject, fn, thisContext) {
      var length = subject.length,
          iterator = thisContext !== undefined ? bindInternal3(fn, thisContext) : fn,
          i;
      for (i = 0; i < length; i++) {
        if (iterator(subject[i], i, subject)) {
          return true;
        }
      }
      return false;
    },

    every: function fastEvery (subject, fn, thisContext) {
      var length = subject.length,
          iterator = thisContext !== undefined ? bindInternal3(fn, thisContext) : fn,
          i;
      for (i = 0; i < length; i++) {
        if (!iterator(subject[i], i, subject)) {
          return false;
        }
      }
      return true;
    },

    clone: function fastCloneArray (input) {
      var length = input.length,
          sliced = new ArrayLike(length),
          i;
      for (i = 0; i < length; i++) {
        sliced[i] = input[i];
      }
      return sliced;
    },

    partial: function fastPartial (fn) {
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
    }
  };
};

},{}],3:[function(require,module,exports){
var poser = require('./src/node');

module.exports = poser;

['Array', 'Function', 'Object', 'Date', 'String'].forEach(pose);

function pose (type) {
  poser[type] = function poseComputedType () { return poser(type); };
}

},{"./src/node":4}],4:[function(require,module,exports){
(function (global){
'use strict';

var d = global.document;
var frames = global.frames;

function poser (type) {
  var iframe = d.createElement('iframe');
  
  iframe.style.display = 'none';
  d.body.appendChild(iframe);

  return iframe.contentWindow[type];
}

module.exports = poser;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{}]},{},[1])(1)
});