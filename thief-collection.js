/*! collection- v0.0.0 - MIT license */

"use strict";
module.exports = (function() {
  var poser = require( "poser" );
  var Collection = poser.Array();
  var cp = Collection.prototype;

  // this could be confusing.
  delete Collection.isArray

  var isCollection = function( obj ) {
    return obj instanceof this;
  }.bind( Collection );

  function isFunction( obj ) {
    return typeof obj === "function";
  }

  function isArrayLike( obj ) {
    return Object.prototype.toString.call( obj ) === "[object Array]";
  }

  function matches( against, obj ) {
    for ( var prop in against ) {
      if ( obj[prop] !== against[prop] ) { 
        return false;
      }
    }
    return true;
  }

  function flip( fn ) {
    return function( a, b ) {
      return fn.call( this, b, a );
    };
  }

  function partial( fn ) {
    var args = slice( arguments, 1 );
    return function() {
       return fn.apply( this, args.concat( slice( arguments ) ) );
    };
  }

  function get( prop ) {
    return function( obj ) {
      return obj[prop];
    };
  }

  function not( fn ) {
    return function() {
      return !fn.apply( this, arguments );
    };
  }

  function contains( obj, value ) {
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
    Array.prototype[name] = function() {
      Array.prototype[method].apply( this, arguments );
      return this;
    };
  });

  // aliases for native methods.
  cp.each = cp.forEach;
  cp.collect = cp.map;
  cp.select = cp.filter;

  cp.forEachRight = function( fn ) {
    this.slice().reverse().each( fn );
  };
  cp.eachRight = cp.forEachRight;

  cp.where = function( obj ) {
    return this.filter( partial( matches, obj ) );
  };

  cp.whereNot = function( obj ) {
    return this.filter( not( partial( matches, obj ) ) );
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
    return this.find( partial( matches, obj ) );
  };

  cp.findWhereNot = function( obj ) {
    return this.find( not( partial( matches, obj ) ) );
  };

  cp.pluck = function( prop ) {
    return this.map( get( prop ) );
  };

  cp.pick = function() {
    return this.map( function( el ) {
      var obj = {};
      breakableEach( arguments, function( prop ) {
        obj[prop] = el[prop];
      });
      return obj;
    });
  };

  cp.reject = function( testFn ) {
    return this.filter( not( testFn ) );
  };

  cp.invoke = function( fnOrMethod ) {
    var args = slice( arguments, 1 );
    this.forEach( function( el ) {
      ( isFunction( fnOrMethod ) ? fnOrMethod : el[fnOrMethod] ).apply( el, args );
    });
    return this;
  };

  cp.without = function() {
    var args = slice( arguments );
    return this.reject( partial( contains, args ) );
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
  cp.cloneDeep = function() {

  };

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
    var args = slice( arguments );
    this.each( function( el ) {
      var has = args.every( partial( flip( contains ), el ) );
      if ( has ) {
        result.push( el );
      }
    });
    return result;
  };

  cp.difference = function() {
    var result = new Collection();
    var args = slice( arguments );
    this.each( function( el ) {
      var notHas = args.every( not( partial( flip( contains ), el ) ) );
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

  cp.sortBy = function( itr, ctx ) {
    itr = iterator( itr );
    return cp.pluck.call( this.map( function( val, i, obj ) {
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
    }), "val" );
  };

  // TODO
  // cp.zip = function() {
  // };

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

  var factory = function( arr ) {
    if ( arr == null ) {
      arr = [];
    }
    return new Collection().concat( arr );
  };

  factory.ctor = Collection;
  factory.proto = Collection.prototype;

  factory.isCollection = isCollection;
  factory.isArrayLike = isArrayLike;

  return factory;

})();