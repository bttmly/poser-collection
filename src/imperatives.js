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

