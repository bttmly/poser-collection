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

function isArrayLike ( obj ) {
  return Object.prototype.toString.call( obj ) === "[object Array]";
}

function factory () {
  var len = arguments.length;
  var args;

  if ( len === 0 ) {
    return new Collection();
  }

  if ( len === 1 && isArrayLike( arguments[0] ) ) {
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
    return isArrayLike( item ) ? factoryDeep( item ) : item;
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


function isTruthy ( value ) {
  return !!value;
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
    return acc.chainPush.apply( acc, isArrayLike( item ) ? flatten( item ) : [ item ] );
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
  fn( this );
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
  return this.filter( isTruthy );
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
factory.extend = function ( ext ) {
  return extend( cp, ext );
};

factory.isCollection = isCollection;
factory.isArrayish = isArrayLike;

factory.one = factoryOne;
factory.deep = factoryDeep;

module.exports = factory;
