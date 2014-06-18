/*! collection- v0.0.0 - MIT license */
'use strict';
var c = (function(){

  function isFunction( obj ){
    return typeof obj === "function";
  }

  function matches( obj, against ){
    for ( var prop in against ) {
      if ( obj[prop] !== against[prop] ) return false;
    }
    return true;
  }

  // constructor function.
  function Collection( arr ){
    [].push.apply( this, arr );
  }

  // shorthand references
  var ap = Array.prototype;
  var cp = Collection.prototype = Object.create( Array.prototype );

  // helpers
  var slice = Function.prototype.call.bind( cp.slice );

  // methods we pass through directly
  var arrMethods = ["filter", "map", "concat", "slice", "splice"]
  arrMethods.forEach( function( method ) {
    cp[method] = function(){
      return factory( ap[method].apply( this, arguments ) );
    };
  });

  // aliases
  cp.each = cp.forEach;
  cp.collect = cp.map;
  cp.select = cp.filter;

  // todo
  // cp.forEachRight = function( fn ){};
  // cp.eachRight = cp.forEachRight;

  cp.forEachRight = function( fn ) {
    this.reverse().forEach( fn );
  };

  cp.where = function( obj ){
    return this.filter( function( el ) {
      return matches( el, obj );
    });
  };

  cp.findWhere = function( obj ){
    for ( var i = 0; i < this.length; i++ ) {
      if ( matches( this[i], obj ) ) return this[i];
    }
  };

  cp.find = function( testFn ) {
    for ( var i = 0; i < this.length; i++ ) {
      if ( testFn( this[i], i, this ) ) return this[i];
    }
  };

  cp.pluck = function( prop ){
    return this.map( function( el ) {
      return el[prop];
    });
  };

  cp.reject = function( testFn ){
    return this.filter( function( el, i, arr ) {
      return !testFn( el, i, arr );
    })
  };

  cp.invoke = function( fnOrMethod ) {
    var args = slice( arguments, 1 );
    this.forEach( function( el, i, arr ) {
      ( isFunction( fnOrMethod ) ? fnOrMethod : el[fnOrMethod] ).apply( el, args );
    });
    return this;
  };

  cp.without = function(){
    var args = slice( arguments );
    return this.reject( function( el, i, arr ) {
      return args.indexOf( el ) !== -1
    });
  };
  cp.remove = cp.without;

  cp.contains = function( obj ) {
    return this.indexOf( obj ) !== -1;
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
      var num = 1;
    }
    return this.slice(0, this.length - num)
  };

  cp.last = function( num ) {
    if ( num == null ) {
      return this[this.length - 1];
    }
    return this.slice(0, -1 * num);
  };

  cp.rest = function( num ){
    if ( num == null ){
      var num = 1;
    }
    return this.slice( num );
  };
  cp.tail = cp.rest;
  cp.drop = cp.rest;

  cp.compact = function(){
    return this.filter( function( el ) {
      return !!el;
    });
  };

  cp.flatten = function(nestedArray, result) {
    var result = result || new Collection();

    each( nestedArray, function( item ) {
      if ( Array.isArray( item ) ) {
        result.push.apply( result, cp.flatten.call( item ) );
      } else {
        result.push( item );
      }

    });

    return result;
  };

  cp.partition = function( testFn ){
    var pass = new Collection();
    var fail = new Collection();
    this.each(function(el, i, arr){
      if ( testFn( el ) ) {
        pass.push( el );
      } else {
        fail.push( el );
      }
    });
    return [pass, fail];
  };

  cp.union = function() {
    var result = new Collection();
    var args = slice( arguments );
    result.push.apply( this );
    args.each( function( argArr ){
      argArr.each( function( item ){
        if ( !result.contains( item ) ) result.push( item );
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
      if ( has ) result.push( el );
    });
    return result;
  };

  cp.difference = function(){
    var result = new Collection();
    var args = slice( args );
    this.each( function( el ) ){
      var has = args.some( function( arr ) {
        return arr.indexOf( el ) > -1;
      });
      if ( !has ) results.push( el );
    });
    return result;
  };
  
  cp.unique = function() {
    var found = new Collection();
    this.each( function( el ) {
      if ( !found.contains( el ) ) found.push( el )
    });
    return found;
  };
  cp.uniq = cp.unique;

  cp.zip = function(){
    // arguments 
  };

  cp.min = function( prop ) {
    if ( prop ) return cp.min.call( this.pluck( prop ) );
    return Math.min.apply( Math, this );
  };

  cp.max = function( prop ) {
    if ( prop ) return cp.max.call( this.pluck( prop ) );
    return Math.max.apply( Math, this );
  };

  cp.toArray = function() {
    return Array.apply( null, this );
  };

  var factory = function( arr ) {
    var arr = arr || [];
    return new Collection( arr );
  };

  factory.ctor = Collection;

  return factory;

})();