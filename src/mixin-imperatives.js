wmodule.exports = function mixinImperatives( proto ) {

    function matches( against, obj ) {
    for ( var prop in against ) {
      if ( obj[prop] !== against[prop] ) { 
        return false;
      }
    }
    return true;
  }

  proto.imperativeWhere = function( obj ) {
    var results = [];
    var i = 0;
    var len = this.length;
    var key;
    while ( i < len ) {
      if ( matches( this[i], obj ) ) {
        results.push( this[i] );
      }
      i++
    }
    return results;
  };

  proto.imperativeWhereNot = function( obj ) {
    var results = [];
    var i = 0;
    var len = this.length;
    var key;
    while ( i < len ) {
      if ( !matches( this[i], obj ) ) {
        results.push( this[i] );
      }
      i++
    }
    return results;
  };

  proto.imperativeFind = function( testFn ) {
    var i = 0;
    var len = this.length;
    while ( i < len ) {
      if ( testFn( this[i], i, this ) ) {
        return this[i];
      }
      i++
    }
    return null;
  };

  proto.imperativeFindWhere = function( obj ) {
    fn = function( item ) { return matches( item, obj ) };
    return this._findImp( fn );
  };

  proto.imperativeFindWhereNot = function( obj ) {
    fn = function( item ) { return !matches( item, obj ) };
    return this._findImp( fn );
  };

};

