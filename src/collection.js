/*! collection- v0.0.0 - MIT license */

"use strict";
module.exports = (function() {

  var poser = require( "poser" );
  var Collection = poser.Array();
  var fast = require( "fast-poser" )( Collection );

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

  mixin( cp, require( "./imperatives.js" ) );

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
