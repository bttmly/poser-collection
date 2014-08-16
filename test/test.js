"use strict";

var expect = require( "chai" ).expect;
var helpers = require( "./helpers" );

var _ = require( "underscore" );

var range = helpers.range;
var haveSameValues = helpers.haveSameValues;
var userData = helpers.userData;

var c = require( ".." );

function match( obj, against ){
  for ( var prop in against ) {
    if ( obj[prop] !== against[prop] ) {
      return false;
    }
  }
  return true;
}

function strictMatch( obj, against ){
  if ( Object.keys( obj ).length !== Object.keys( against ).length ) {
    return false;
  }
  return match( obj, against );
}

describe("factory", function () {

  it("exists", function () {
    expect( c ).to.be.a( "function" );
  });

  it("works with zero arguments", function() {
    var col = c();
    expect( col ).to.be.instanceof( c.ctor );
    expect( col.length ).to.equal( 0 );
  });

  it("turns an array into a collection, if array is only argument", function () {
    var col = c([ 1, 2, 3 ]);
    expect( col ).to.be.instanceof( c.ctor );
    expect( col.length ).to.equal( 3 );
    expect( col.toArray() ).to.deep.equal([ 1, 2, 3 ]);
  });

  it("works like new Array() when passed a number as its only argument", function () {
    var col = c( 3 );
    expect( col ).to.be.instanceof( c.ctor );
    expect( col.length ).to.equal( 3 )
    expect( col.toArray() ).to.deep.equal( new Array( 3 ) );
  });

  it("works like new Array() when passed multiple arguments", function () {
    var col = c( 1, "a", [] );
    expect( col ).to.be.instanceof( c.ctor );
    expect( col.length ).to.equal( 3 );
    expect( col.toArray() ).to.deep.equal( new Array( 1, "a", []) );
  });

  it("works like new Array() when passed a single non-array-like argument" , function () {
    var col = c( "a" );
    expect( col ).to.be.instanceof( c.ctor );
    expect( col.length ).to.equal( 1 );
    expect( col.toArray() ).to.deep.equal( new Array( "a" ) );
  });

});

// Collection.prototype.toArray
describe( "#toArray", function() {

  it( "returns a vanilla array representing the collection's data", function() {
    var col = c([1,2,3]);
    var arr = col.toArray();
    expect( col ).to.be.instanceof( c.ctor );
    expect( arr ).to.not.be.instanceof( c.ctor );
  });

});


describe( "#push", function() {

  it("does not change a collection into an array", function() {
    var col = c();
    col.push("item");
    expect( col ).to.be.instanceof( c.ctor );
  });

});


// Collection.prototype.pop === Array.prototype.pop
describe( "#pop", function() {

  it("does not change a collection into an array", function() {
    var col = c(["item"]);
    col.pop();
    expect( col ).to.be.instanceof( c.ctor );
  });

});


describe( "#shift", function() {

  it("does not change a collection into an array", function() {
    var col = c();
    col.shift("item");
    expect( col ).to.be.instanceof( c.ctor );
  });

});


describe( "#unshift", function() {

  it("does not change a collection into an array", function() {
    var col = c(["item"]);
    col.shift();
    expect( col ).to.be.instanceof( c.ctor );
  });

});


describe( "#forEach", function() {

  it("does not change a collection into an array", function() {
    var col = c( range(0, 10) );
    var result;
    col.forEach( function( el, i, arr ){
      result = el * i;
    });
    expect( col ).to.be.instanceof( c.ctor );
  });

  it( "has an alias called EACH", function() {
    var col = c();
    expect( col.forEach ).to.equal( col.each );
  });

});


// Collection.prototype.concat
describe( "#concat", function() {

  it( "doesn't delegate to Array.prototype.concat", function() {
     var col = c();
     expect( c.concat ).to.not.equal( Array.prototype.concat );
  });

  it( "doesn't modify the original object", function() {
    var col = c();
    col.concat([1,2,3]);
    expect( col ).to.have.length( 0 );
  });

  it( "returns a collection", function() {
    var col = c();
    var concatCol = col.concat([1,2,3]);
    expect( concatCol ).to.be.instanceof( c.ctor );
  });

});


// Collection.prototype.slice
describe( "#slice", function() {

  it( "does not delegate to Array.prototype.slice", function() {
    var col = c();
    expect( c.slice ).to.not.equal( Array.prototype.slice );
  });

  it( "returns a collection", function() {
    var col = c( range(0, 10) );
    var sliced = col.slice(1);
    expect( sliced ).to.be.instanceof( c.ctor );
  });

  it( "should work like Array.prototype.slice, WRT original item", function() {
    var col = c( range(0, 10) );
    var arr = range( 0, 10 );
    var slicedCol = col.slice( 1, 3 );
    var slicedArr = arr.slice( 1, 3 );
    expect( haveSameValues( col, arr ) ).to.be.true;
  });

  it( "should work like Array.prototype.slice, WRT return value", function() {
    var col = c( range(0, 10) );
    var arr = range( 0, 10 );
    var slicedCol = col.slice( 1, 3 );
    var slicedArr = arr.slice( 1, 3 );
    expect( haveSameValues( slicedCol, slicedArr ) ).to.be.true;
  });
});


// Collection.prototype.splice
describe( "#splice", function() {

  it( "does not delegate to Array.prototype.splice", function() {
    var col = c();
    expect( c.splice ).to.not.equal( Array.prototype.splice );
  });

  it( "returns a collection", function() {
    var col = c( range(0, 10) );
    var spliced = col.splice( 0, 2, "item" );
    expect( spliced ).to.be.instanceof( c.ctor );
  });

  it( "should leave the original item as a collection", function() {
    var col = c( range(0, 10) );
    var spliced = col.splice( 0, 2, "item" );
    expect( col ).to.be.instanceof( c.ctor );
  });

  it( "should work like Array.prototype.splice, WRT original item", function() {
    var col = c( range(0, 10) );
    var arr = range( 0, 10 );
    col.splice( 0, 2, "item" );
    arr.splice( 0, 2, "item" );
    expect( haveSameValues( col, arr ) ).to.be.true;
  });

  it( "should work like Array.prototype.splice, WRT return value", function() {
    var col = c( range(0, 10) );
    var arr = range( 0, 10 );
    var splicedCol = col.splice( 0, 2, "item" );
    var splicedArr = arr.splice( 0, 2, "item" );
    expect( haveSameValues( splicedCol, splicedArr ) ).to.be.true;
  });

});

// Collection.prototype.map
describe( "#map", function() {

  it("doesn't delegate to Array.prototype.map", function() {
    var col = c();
    expect( col.map ).to.be.not.equal( Array.prototype.map );
  });

  it("returns a collection", function() {
    var col = c([1,2,3]);
    var map = col.map( function( item ){
      return item;
    });
    expect( map ).to.be.instanceof( c.ctor );
  });

  it("produces the same values as Array.prototype.map", function() {
    var arr = [4, 10, 4, 5, 7, 3, 5, 2, 4, 6];
    var col = c([4, 10, 4, 5, 7, 3, 5, 2, 4, 6]);
    var mapFn = function( item, index ){
      return item * index;
    };
    var arrMap = arr.map( mapFn );
    var colMap = col.map( mapFn );
    expect( haveSameValues( arrMap, colMap ) ).to.be.true;
  });

  it( "has an alias called COLLECT", function() {
    var col = c();
    expect( col.map ).to.equal( col.collect );
  });

});


describe( "#filter", function() {

  it( "doesn't delegate to Array.prototype.filter", function() {
    var col = c();
    expect( col.filter ).to.not.equal( Array.prototype.filter );
  });

  it("produces the same values as Array.prototype.filter", function() {
    var col = c( range(0, 10) );
    var arr = range( 0, 10 );
    var filterFn = function( item ){
      return item % 3 === 0;
    };
    var colFilter = col.filter( filterFn );
    var arrFilter = arr.filter( filterFn );
    expect( haveSameValues( colFilter, arrFilter ) ).to.be.true;
  });

  it("returns collections", function() {
    var col = c([1,2,3]);
    var result = col.filter( function( item ){
      return item % 2 === 1;
    });
    expect( result ).to.be.instanceof( c.ctor );
  });

  it( "has an alias called SELECT", function() {
    var col = c();
    expect( c.filter ).to.equal( c.select );
  });

});

describe( "#reject" , function() {

  it("returns collections", function() {
    var col = c([1,2,3]);
    var result = col.reject( function( item ){
      return item % 2 === 1;
    });
    expect( result ).to.be.instanceof( c.ctor );
  });

  it("works as expected", function() {
    var col = c( range(0, 4) );
    var result = col.reject( function( item ){
      return item % 2 === 1;
    });
    expect( haveSameValues( [0, 2], result ) ).to.be.true;
  });

});

describe( "#pluck", function() {

  it( "works like _.pluck", function() {
    var col = c( userData() );
    var arr = userData();
    var cPlucked = col.pluck( "name" );
    var aPlucked = _.pluck( arr, "name" );
    expect( haveSameValues( cPlucked, aPlucked ) ).to.be.true;
  });

});

describe( "#find", function() {

  it( "works like _.find", function() {
    var col = c( userData() );
    var arr = userData();
    var findFn = function( item ){
      return item.age > 20;
    };
    var cFound = col.find( findFn );
    var aFound = _.find( arr, findFn );
    expect( cFound ).to.deep.equal( aFound );
  });

});

describe( "#findWhere", function() {

  it( "works like _.findWhere", function() {
    var col = c( userData() );
    var arr = userData();
    var testObj = { age: 20 };
    var cFound = col.findWhere( testObj );
    var aFound = _.findWhere( arr, testObj );
    expect( cFound ).to.deep.equal( aFound );
  });

});

describe( "#where", function() {

  it( "works like _.where", function() {
    var col = c( userData() );
    var arr = userData();
    var testObj = { age: 20 };
    var cFound = col.where( testObj );
    var aFound = _.where( arr, testObj );
    var pass = true;
    for ( var i = 0; i < cFound.length; i++ ) {
      if (!( strictMatch( cFound[i], aFound[i] ) )) {
        pass = false;
      }
    }
    expect( pass ).to.be.true;
  });

});

describe( "#invoke", function() {

  it( "works like _.invoke", function() {
    var col = c( userData() );
    var arr = userData();
    var fn = function() {
      this.lastName = this.name.split( "" ).reverse().join( "" );
    };
    var invokedCol = col.invoke( fn );
    var invokedArr = _.invoke( arr, fn );
    expect( col.toArray() ).to.deep.equal( arr );
    expect( col[0] ).to.have.property( "lastName" );
    expect( arr[0] ).to.have.property( "lastName" );
  });

});

describe( "#without", function() {

  it( "removes a value passed to it", function() {
    var col = c( [1, 2, 3, 4, 5] );
    var removedCol = col.without( 3 );
    expect( removedCol.toArray() ).to.deep.equal( [1, 2, 4, 5] );
  });

  it( "removes multiple values passed to it", function() {
    var col = c( [1, 2, 3, 4, 5] );
    var removedCol = col.without( 3, 4 );
    expect( removedCol.toArray() ).to.deep.equal( [1, 2, 5] );
  });

  it( "has an alias called REMOVE", function() {
    var col = c();
    expect( col.without ).to.equal( col.remove );
  });

});

describe( "#contains", function() {

  it( "checks if a value exists in a collection", function() {
    var obj = { key: "value" };
    var c1 = c( [10, 20, 30] );
    var c2 = c( ["a", obj, "b"] );
    expect( c1.contains( 10 ) ).to.be.true;
    expect( c2.contains( obj ) ).to.be.true;
  });

});

//
describe( "#forEachRight", function() {
  it("iterates over an array in reverse order", function(){
    var original = c( [1, 2, 3, 4, 5] );
    var result = [];
    original.forEachRight( function( el ) {
      result.push( el );
    });
    expect( result ).to.deep.equal( [5, 4, 3, 2, 1] );
  });
});

describe( "#compact", function() {
  it( "returns a copy with falsy values removed", function() {
    var original = [false, 1, 0, 2, "", 3, null, 4, undefined, 5];
    var cOrignal = c( original );
    var cResult = cOrignal.compact().toArray();
    var uResult = _.compact( original );
    expect( cResult ).to.deep.equal( uResult );
  });
});

describe( "#partition", function() {
  it( "returns an array with the first element containing all the passing values, the second all the failing", function() {
    var original = [0, 1, 2, 3, 4, 5];
    var cOriginal = c( original );
    var test = function( el ) {
      return el % 2 === 0;
    };
    var cResult = cOriginal.partition( test ).map( function( el ) {
      return el.toArray();
    }).toArray();
    var uResult = _.partition( original, test );
    expect( cResult ).to.deep.equal( uResult );
  });
});

describe( "#union", function() {
  it( "works like _.union", function() {
    var a = [1, 2, 3, 4];
    var b = [3, 4, 5, 6];
    var d = [1, 2, 7, 8];
    var cResult = c( a ).union( b, c ).toArray();
    var uResult = _.union( a, b, c );
    expect( cResult ).to.deep.equal( uResult );
  });
});

describe( "#intersection", function() {
  it( "works like _.intersection", function() {
    var a = [1, 2, 3, 4];
    var b = [3, 4, 5, 6];
    var d = [1, 2, 7, 8];
    var cResult = c( a ).intersection( b, c ).toArray();
    var uResult = _.intersection( a, b, c );
    expect( cResult ).to.deep.equal( uResult );
  });
});

describe( "#difference", function() {
  it( "works like _.difference", function() {
    var a = [1, 2, 3, 4];
    var b = [3, 4, 5, 6];
    var d = [1, 7, 8, 8];
    var cResult = c( a ).difference( b, c ).toArray();
    var uResult = _.difference( a, b, c );
    expect( cResult ).to.deep.equal( uResult );
  });
});

describe( "#zip", function () {
  it( "works like _.zip with arrays of equal length", function () {
    var cArr = c(["moe", "larry", "curly"]);
    var expected = [["moe", 30, true], ["larry", 40, false], ["curly", 50, false]];
    var cZip = cArr.zip( [30, 40, 50], [true, false, false] );
    expect( JSON.stringify( cZip ) ).to.equal( JSON.stringify( expected ) );
  });
  it( "leaves 'undefined' where array lengths differ", function () {
    var cArr = c(["moe", "larry", "curly"]);
    var expected = [["moe", 30, true], ["larry", 40, undefined], ["curly", undefined, undefined]];
    var cZip = cArr.zip( [30, 40], [true] );
    expect( JSON.stringify( cZip ) ).to.equal( JSON.stringify( expected ) );
  });
});

describe( "#min", function () {
  it( "works when not called with an argument", function () {
    expect( c([ 10, 100, 30, 70 ]).max() ).to.equal( 100 );
  });
  it( "returns NaN if no argument and no numbers", function () {
    expect( isNaN( c([ "a", "b", "z", "d" ]).max() ) ).to.equal( true );
  });
  it( "returns the max value of a property", function () {
    expect( c( userData() ).max( "age" ) ).to.equal( 40 );
  });
});

describe( "#min", function () {
  it( "works when not called with an argument", function () {
    expect( c([ 10, 100, 30, 70 ]).min() ).to.equal( 10 );
  });
  it( "returns NaN if no argument and no numbers", function () {
    expect( isNaN( c([ "a", "b", "z", "d" ]).min() ) ).to.equal( true );
  });
  it( "returns the max value of a property", function () {
    expect( c( userData() ).min( "age" ) ).to.equal( 20 );
  });
});

describe( "#extent", function () {
  it( "works when not called with an argument", function () {
    expect( c([ 10, 100, 30, 70 ]).extent() ).to.deep.equal([ 10, 100 ]);
  });
  it( "returns NaN if no argument and no numbers", function () {
    expect( isNaN( c([ "a", "b", "z", "d" ]).extent()[0] ) ).to.equal( true );
  });
  it( "returns the max value of a property", function () {
    expect( c( userData() ).extent( "age" ) ).to.deep.equal([ 20, 40 ]);
  });
});

describe( "#flatten", function () {
  it( "recursively flattens a nested array", function () {
    var flat = c([ 1, [ 2, [ 3, [ 4, [ 5, [ 6 ]]]]]]).flatten();
    expect( flat.toArray() ).to.deep.equal([ 1, 2, 3, 4, 5, 6 ]);
  });
});

describe( "#mapInvoke", function () {
  it( "returns the result of calling the function on each item", function () {
    var nums = c([ 1, 2, 3 ]);
    expect( nums.mapInvoke(function(){ return this * 2; }).toArray() ).to.deep.equal([ 2, 4, 6 ]);
  });
  it( "returns the result of calling the method on each item", function () {
    var nums = c([ 1, 2, 3 ]);
    expect( nums.mapInvoke( "toString" ).toArray() ).to.deep.equal([ "1", "2", "3" ]);
  });
});

describe( "#asHeadersOf", function () {
  it( "Uses the collection as the headers for a supplied set of rows", function () {
    var headers = c([ "name", "age", "gender"]);
    var rows = [["Joe", 30, "male"], ["Jane", 32, "female"]];
    var result = headers.asHeadersOf( rows );
    expect( result.toArray() ).to.deep.equal([{ name: "Joe", age: 30, gender: "male"}, {name: "Jane", age: 32, gender: "female" }]);
    expect( result ).to.be.instanceof( c.ctor );
  });
});


describe( "#asRowsOf", function () {
  it( "Uses the collection as the headers for a supplied set of rows", function () {
    var headers = [ "name", "age", "gender"];
    var rows = c([["Joe", 30, "male"], ["Jane", 32, "female"]]);
    var result = rows.asRowsOf( headers );
    expect( result.toArray() ).to.deep.equal([{ name: "Joe", age: 30, gender: "male"}, {name: "Jane", age: 32, gender: "female" }]);
    expect( result ).to.be.instanceof( c.ctor );
  });
});
