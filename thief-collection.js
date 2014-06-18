/*! collection- v0.0.0 - MIT license */
'use strict';
var c = (function(){

  var borrow = function(className){
    var iframe, altCtx, key, stolen, frames;
    frames = window.frames;
    key = Math.random().toString(36).slice(2);
    iframe = document.createElement("iframe");
    iframe.style.display = "none";
    document.body.appendChild(iframe);
    altCtx = frames[frames.length - 1].document;
    altCtx.write(
      "<script>parent['" +
      key +
      "'] = " +
      className + 
      ";</script>"
    );
    stolen = window[key];
    delete window[key];
    return stolen;
  };

  var Collection = borrow("Array");
  var cp = Collection.prototype;

  function isFunction( obj ){
    return typeof obj === "function";
  };

  function matches( obj, against ){
    for ( var prop in against ) {
      if ( obj[prop] !== against[prop] ) return false;
    }
    return true;
  };

  // constructor function.
  // function Collection( arr ){
  //   [].push.apply( this, arr );
  // }

  // shorthand references
  // var ap = Array.prototype;
  // var cp = Collection.prototype = Object.create( Array.prototype );

  // helpers
  var slice = Function.prototype.call.bind( cp.slice );

  // aliases
  cp.each = cp.forEach;
  cp.collect = cp.map;
  cp.select = cp.filter;

  // todo
  // cp.forEachRight = function( fn ){};
  // cp.eachRight = cp.forEachRight;

  cp.where = function( obj ){
    return this.filter( function( el ) {
      return matches( el, obj );
    });
  };

  cp.whereNot = function( obj ){

  };

  cp.find = function( testFn ) {
    for ( var i = 0; i < this.length; i++ ) {
      if ( testFn( this[i], i, this ) ) return this[i];
    }
  };

  cp.findNot = function() {

  };

  cp.findWhere = function( obj ){
    for ( var i = 0; i < this.length; i++ ) {
      if ( matches( this[i], obj ) ) return this[i];
    }
  };

  cp.findWhereNot = function( obj ) {

  };

  cp.pluck = function( prop ){
    return this.map( function( el ){
      return el[prop];
    });
  };

  cp.reject = function( testFn ){
    return this.filter( function( el, i, arr ) {
      return !testFn( el, i, arr );
    })
  };

  cp.invoke = function( fnOrMethod ){
    var args = slice( arguments, 1 );
    this.forEach( function( el, i, arr ) {
      ( isFunction( fnOrMethod ) ? fnOrMethod : el[fnOrMethod] ).apply( el, args );
    });
    return this;
  };

  cp.without = function(){
    var args = slice( arguments );
    return this.reject( function( el, i, arr ){
      return args.indexOf( el ) !== -1
    });
  };
  cp.remove = cp.without;

  cp.contains = function( obj ){
    return this.indexOf( obj ) !== -1;
  };

  cp.tap = function( fn ) {
    fn( this );
    return this
  };

  cp.clone = function() {

  };

  cp.cloneDeep = function() {

  };

  // cp.first = function( num ){

  // };
  // cp.head = cp.first;
  // cp.take = cp.first;

  // cp.initial = function( num ){

  // };

  // cp.last = function( num ){

  // };

  // cp.rest = function( num ){

  // };
  // cp.tail = cp.rest;
  // cp.drop = cp.rest;

  // cp.compact = function(){

  // };

  // cp.flatten = function(){

  // };

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
    // should be collection?
    return [pass, fail];
  };

  // cp.union = function(){
  //   var result = new Collection();
  //   return result;
  // };

  // cp.intersection = function(){
  //   // arguments
  // };

  // cp.difference = function(){
  // };
  
  cp.unique = function(){
    var found = new Collection();
    var i = 0;
    while ( i < this.length ){
      if ( found.indexOf( this[i] ) !== -1 ) {
        found.push( this[i] )
      }
      i++;
    }
    return found;
  };
  cp.uniq = cp.unique;

  cp.zip = function(){
    // arguments 
  }

  cp.min = function( prop ){
    if ( prop ) return cp.min.call( this.pluck( prop ) );
    return Math.min.apply( Math, this );
  }

  cp.max = function( prop ){
    if ( prop ) return cp.max.call( this.pluck( prop ) );
    return Math.max.apply( Math, this );
  };

  cp.toArray = function(){
    return Array.apply( null, this );
  };

  var factory = function( arr ) {
    return new Collection().concat( arr || [] );
  };

  // args: ["name", "age", "gender"], [["joe", 30, "male"], ["jane", 35, "female"]] =>
  // return: [{name: "joe", age: 30, gender: "male"}, {name: "jane", age: 35, gender: "female"}];
  factory.collectify = function( keys, valueArrays ) {
    var collection = new Collection();
    var obj;
    for ( var i = 0; i < valueArrays.length; i++ ) {
      obj = {};
      for ( var j = 0; j < keys.length; j++ ) {
        obj[keys[j]] = valueArrays[i][j];
      }
      collection.push( obj );
    }
    return collection;
  };

  factory.ctor = ctor;

  return factory;

})();