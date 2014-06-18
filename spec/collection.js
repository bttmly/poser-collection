'use strict';

function match( obj, against ){
  for ( var prop in against ) {
    if ( obj[prop] !== against[prop] ) return false;
  }
  return true;
};

function strictMatch( obj, against ){
  if ( Object.keys( obj ).length !== Object.keys( against ).length )
    return false;
  return match( obj, against );
}

describe('collection', function () {

  it('exists', function () {
    expect(c).to.be.a('function');
  });

  it('creates collections', function(){
    var col = c();
    expect( col ).to.be.instanceof( c.ctor );
  });

  it('creates collections that inherit from array', function(){
    var col = c();
    expect( col ).to.be.instanceof( Array );
  });

  // Add more assertions here
});

// Collection.prototype.toArray
describe( "#toArray", function(){

  it( "returns a vanilla array representing the collection's data", function(){
    var col = c([1,2,3]);
    var arr = col.toArray();
    expect( col ).to.be.instanceof( c.ctor );
    expect( arr ).to.not.be.instanceof( c.ctor );
  });

});


// Collection.prototype.push === Array.prototype.push
describe( "#push", function(){

  it("delegates to Array.prototype", function(){
    var col = c();
    expect( col.push ).to.equal( Array.prototype.push );
  });

  it("does not change a collection into an array", function(){
    var col = c();
    col.push("item");
    expect( col ).to.be.instanceof( c.ctor );
  });

});


// Collection.prototype.pop === Array.prototype.pop
describe( "#pop", function(){

  it("delegates to Array.prototype", function(){
    var col = c();
    expect( col.pop ).to.equal( Array.prototype.pop );
  });

  it("does not change a collection into an array", function(){
    var col = c(["item"]);
    col.pop();
    expect( col ).to.be.instanceof( c.ctor );
  });

});


// Collection.prototype.shift === Array.prototype.shift
describe( "#shift", function(){

  it("delegates to Array.prototype", function(){
    var col = c();
    expect( col.shift ).to.equal( Array.prototype.shift )
  });

  it("does not change a collection into an array", function(){
    var col = c();
    col.shift("item");
    expect( col ).to.be.instanceof( c.ctor );
  });
  
});


// Collection.prototype.unshift === Array.prototype.unshift
describe( "#unshift", function(){

  it("delegates to Array.prototype", function(){
    var col = c();
    expect( col.unshift ).to.equal( Array.prototype.unshift );
  });

  it("does not change a collection into an array", function(){
    var col = c(["item"]);
    col.shift();
    expect( col ).to.be.instanceof( c.ctor );
  });

});


// Collection.prototype.forEach === Array.prototype.forEach
describe( "#forEach", function(){

  it( "delegates to Array.prototype.forEach", function(){
    var col = c();
    expect( col.forEach ).to.equal( Array.prototype.forEach );
  });

  it("does not change a collection into an array", function(){
    var col = c( range(0, 10) );
    var result;
    col.forEach( function( el, i, arr ){
      result = el * i;
    });
    expect( col ).to.be.instanceof( c.ctor );
  });

  it( "has an alias called EACH", function(){
    var col = c();
    expect( col.forEach ).to.equal( col.each );
  });

});


// Collection.prototype.concat
describe( "#concat", function(){

  it( "doesn't delegate to Array.prototype.concat", function(){
     var col = c();
     expect( c.concat ).to.not.equal( Array.prototype.concat ); 
  });

  it( "doesn't modify the original object", function(){
    var col = c();
    col.concat([1,2,3]);
    expect( col ).to.have.length( 0 );
  });

  it( "returns a collection", function(){
    var col = c();
    var concatCol = col.concat([1,2,3]);
    expect( concatCol ).to.be.instanceof( c.ctor );
  })

});


// Collection.prototype.slice
describe( "#slice", function(){

  it( "does not delegate to Array.prototype.slice", function(){
    var col = c();
    expect( c.slice ).to.not.equal( Array.prototype.slice );
  });

  it( "returns a collection", function(){
    var col = c( range(0, 10) );
    var sliced = col.slice(1);
    expect( sliced ).to.be.instanceof( c.ctor );
  });

  it( "should work like Array.prototype.slice, WRT original item", function(){
    var col = c( range(0, 10) );
    var arr = range( 0, 10 );
    var slicedCol = col.slice( 1, 3 );
    var slicedArr = arr.slice( 1, 3 );
    expect( haveSameValues( col, arr ) ).to.be.true;
  });

  it( "should work like Array.prototype.slice, WRT return value", function(){
    var col = c( range(0, 10) );
    var arr = range( 0, 10 );
    var slicedCol = col.slice( 1, 3 );
    var slicedArr = arr.slice( 1, 3 );
    expect( haveSameValues( slicedCol, slicedArr ) ).to.be.true;
  });
});


// Collection.prototype.splice
describe( "#splice", function(){

  it( "does not delegate to Array.prototype.splice", function(){
    var col = c();
    expect( c.splice ).to.not.equal( Array.prototype.splice );
  });

  it( "returns a collection", function(){
    var col = c( range(0, 10) );
    var spliced = col.splice( 0, 2, "item" );
    expect( spliced ).to.be.instanceof( c.ctor );
  });

  it( "should leave the original item as a collection", function(){
    var col = c( range(0, 10) );
    var spliced = col.splice( 0, 2, "item" );
    expect( col ).to.be.instanceof( c.ctor );
  });

  it( "should work like Array.prototype.splice, WRT original item", function(){
    var col = c( range(0, 10) );
    var arr = range( 0, 10 );
    col.splice( 0, 2, "item" );
    arr.splice( 0, 2, "item" );
    expect( haveSameValues( col, arr ) ).to.be.true;
  });

  it( "should work like Array.prototype.splice, WRT return value", function(){
    var col = c( range(0, 10) );
    var arr = range( 0, 10 );
    var splicedCol = col.splice( 0, 2, "item" );
    var splicedArr = arr.splice( 0, 2, "item" );
    expect( haveSameValues( splicedCol, splicedArr ) ).to.be.true;
  });

});

// Collection.prototype.map
describe( "#map", function(){

  it("doesn't delegate to Array.prototype.map", function(){
    var col = c();
    expect( col.map ).to.be.not.equal( Array.prototype.map )
  });

  it("returns a collection", function(){
    var col = c([1,2,3]);
    var map = col.map( function( item ){
      return item;
    });
    expect( map ).to.be.instanceof( c.ctor );
  });

  it("produces the same values as Array.prototype.map", function(){
    var arr = [4, 10, 4, 5, 7, 3, 5, 2, 4, 6];
    var col = c([4, 10, 4, 5, 7, 3, 5, 2, 4, 6]);
    var mapFn = function( item, index ){
      return item * index;
    };
    var arrMap = arr.map( mapFn );
    var colMap = col.map( mapFn );
    expect( haveSameValues( arrMap, colMap ) ).to.be.true
  });

  it( "has an alias called COLLECT", function(){
    var col = c();
    expect( col.map ).to.equal( col.collect );
  });

});


describe( "#filter", function(){

  it( "doesn't delegate to Array.prototype.filter", function(){
    var col = c();
    expect( col.filter ).to.not.equal( Array.prototype.forEach );
  });

  it("produces the same values as Array.prototype.filter", function(){
    var col = c( range(0, 10) );
    var arr = range( 0, 10 );
    var filterFn = function( item ){
      return item % 3 === 0;
    };
    var colFilter = col.filter( filterFn );
    var arrFilter = arr.filter( filterFn );
    expect( haveSameValues( colFilter, arrFilter ) ).to.be.true;
  });

  it("returns collections", function(){
    var col = c([1,2,3]);
    var result = col.filter( function( item ){
      return item % 2 === 1;
    });
    expect( result ).to.be.instanceof( c.ctor );
  });

  it( "has an alias called SELECT", function(){
    var col = c();
    expect( c.filter ).to.equal( c.select );
  });

});

describe( "#reject" , function(){
  
  it("returns collections", function(){
    var col = c([1,2,3]);
    var result = col.reject( function( item ){
      return item % 2 === 1;
    });
    expect( result ).to.be.instanceof( c.ctor );
  });

  it("works as expected", function(){
    var col = c( range(0, 4) );
    var result = col.reject( function( item ){
      return item % 2 === 1;
    });
    expect( haveSameValues( [0, 2], result ) ).to.be.true;
  });

});

describe( "#pluck", function(){

  it( "works like _.pluck", function(){
    var col = c( userData() );
    var arr = userData();
    var cPlucked = col.pluck( "name" );
    var aPlucked = _.pluck( arr, "name" );
    expect( haveSameValues( cPlucked, aPlucked ) ).to.be.true;
  });

});

describe( "#find", function(){

  it( "works like _.find", function(){
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

describe( "#findWhere", function(){

  it( "works like _.findWhere", function(){
    var col = c( userData() );
    var arr = userData();
    var testObj = { age: 20 };
    var cFound = col.findWhere( testObj );
    var aFound = _.findWhere( arr, testObj );
    expect( cFound ).to.deep.equal( aFound );
  });

});

describe( "#where", function(){

  it( "works like _.where", function(){
    var col = c( userData() );
    var arr = userData();
    var testObj = { age: 20 };
    var cFound = col.where( testObj );
    var aFound = _.where( arr, testObj );
    var pass = true;
    for ( var i = 0; i < cFound.length; i++ ) {
      if (!( strictMatch( cFound[i], aFound[i] ) )) {
        pass = false
      }
    }
    expect( pass ).to.be.true;
  });

});

describe( "#invoke", function(){
  
  it( "works like _.invoke", function(){
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

describe( "#without", function(){

  it( "removes a value passed to it", function(){
    var col = c( [1, 2, 3, 4, 5] );
    var removedCol = col.without( 3 );
    expect( removedCol.toArray() ).to.deep.equal( [1, 2, 4, 5] );
  });

  it( "removes multiple values passed to it", function(){
    var col = c( [1, 2, 3, 4, 5] );
    var removedCol = col.without( 3, 4 );
    expect( removedCol.toArray() ).to.deep.equal( [1, 2, 5] );
  });

  it( "has an alias called REMOVE", function(){
    var col = c();
    expect( col.without ).to.equal( col.remove );
  });

});