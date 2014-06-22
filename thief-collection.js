/*! collection- v0.0.0 - MIT license */

"use strict";
var c = (function( poser ) {

  var Collection = poser( "Array" );
  var cp = Collection.prototype;

  function isCollection( obj ) {
    return obj instanceof Collection;
  }

  function isFunction( obj ) {
    return typeof obj === "function";
  }

  function isArrayLike( obj ) {
    return Array.isArray( obj ) || isCollection( obj );
  }

  function matches( obj, against ) {
    for ( var prop in against ) {
      if ( obj[prop] !== against[prop] ) { 
        return false;
      }
    }
    return true;
  }

  function breakableEach( obj, callback ) {
    var result;
    for ( var i = 0; i < obj.length; i++ ) {
      result = callback( obj[i], i, obj );
      if ( result === false ) {
        break;
      }
    }
  }

  // helpers
  var slice = Function.prototype.call.bind( cp.slice );

  // create chainable versions of these native methods
  ["push", "pop", "shift", "unshift"].forEach( function( method ) {
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
    var i = this.length - 1;
    while ( i > -1 ) {
      fn( this[i], i, this );
      i -= 1;
    }
  };
  cp.eachRight = cp.forEachRight;

  cp.where = function( obj ) {
    return this.filter( function( el ) {
      return matches( el, obj );
    });
  };

  cp.whereNot = function( obj ) {
    return this.filter( function( el ) {
      return !matches( el, obj );
    });
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
    return this.find( function( el, i, arr ) {
      return !testFn( el, i, arr );
    });
  };

  cp.findWhere = function( obj ) {
    return this.find( function( el ) {
      return matches( el, obj );
    });
  };

  cp.findWhereNot = function( obj ) {
    return this.find( function( el ) {
      return !matches( el, obj );
    });
  };

  cp.pluck = function( prop ) {
    return this.map( function( el ) {
      return el[prop];
    });
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
    return this.filter( function( el, i, arr ) {
      return !testFn( el, i, arr );
    });
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
    return this.reject( function( el ) {
      return args.indexOf( el ) !== -1;
    });
  };
  cp.remove = cp.without;

  cp.contains = function( obj ) {
    return this.indexOf( obj ) !== -1;
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
    return this.slice(0, num);
  };
  cp.head = cp.first;
  cp.take = cp.first;

  cp.initial = function( num ) {
    if ( num == null ) {
      num = 1;
    }
    return this.slice(0, this.length - num);
  };

  cp.last = function( num ) {
    if ( num == null ) {
      return this[this.length - 1];
    }
    return this.slice(0, -1 * num);
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
    return this.filter( function( el ) {
      return !!el;
    });
  };

  // TODO
  // cp.flatten = function() {

  // };

  cp.partition = function( testFn ) {
    var pass = new Collection();
    var fail = new Collection();
    this.each(function(el, i, arr) {
      ( testFn( el, i, arr ) ? pass : fail ).push( el );
    });
    return factory([ pass, fail ]);
  };

  cp.union = function() {
    var result = new Collection();
    var args = slice( arguments );
    result.push.apply( this );
    args.each( function( argArr ) {
      argArr.forEach( function( item ) {
        if ( !result.contains( item ) ) {
          result.push( item );
        }
      });
    });
    return result;
  };

  cp.intersection = function() { 
    var result = new Collection();
    var args = slice( args );
    this.each( function( el ) {
      var has = args.every( function( arr ) {
        return arr.indexOf( el ) > -1;
      });
      if ( has ) {
        result.push( el );
      }
    });
    return result;
  };

  cp.difference = function() {
    var result = new Collection();
    var args = slice( args );
    this.each( function( el ) {
      var has = args.some( function( arr ) {
        return arr.indexOf( el ) > -1;
      });
      if ( !has ) {
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

  cp.toArray = function() {
    return Array.apply( null, this );
  };

  var factory = function( arr ) {
    if ( arr == null ) {
      arr = [];
    }
    return new Collection().concat( arr );
  };

  // args: ["name", "age", "gender"], [["joe", 30, "male"], ["jane", 35, "female"]] =>
  // return: [{name: "joe", age: 30, gender: "male"}, {name: "jane", age: 35, gender: "female"}];
  function collectifyHeaders( headers, values ) {
    var collection = new Collection();
    var i, j, obj;
    i = 0;
    while ( i < values.length ) {
      obj = {};
      j = 0;
      while ( j < headers.length ) {
        obj[headers[j]] = values[i][j];
        j += 1;
      }
      collection.push( obj );
      i += 1;
    }
    return collection;
  }

  // arg: [["name", "age", "gender"], ["joe", 30, "male"], ["jane", 35, "female"]] =>
  // return: [{name: "joe", age: 30, gender: "male"}, {name: "jane", age: 35, gender: "female"}];
  function collectifyTable( rows, headerIndex ) {
    if ( headerIndex == null ) {
      headerIndex = 0;
    }
    var headers = rows.splice( headerIndex, 1 )[0];
    return collectifyHeaders( headers, rows );
  }

  factory.collectify = function() {
    // should sniff out various types of structured data and return a collection
  };

  factory.ctor = Collection;
  factory.proto = cp;
  factory.isCollection = isCollection;

  return factory;

})( poser );