"use strict";

var expect = require( "chai" ).expect;

var sinon = require( "sinon" );
var c = require( ".." );

function times2 ( num ) {
  return num * 2;
}

function add ( a, b ) {
  return a + b;
}

function isEven ( num ) {
  return num % 2 === 0;
}

function exists ( value ) {
  return value != null;
}

function notExists ( value ) {
  return value == null;
}

function index ( _, i ) {
  return i;
}

function stringAlong ( a, b ) {
  return "" + a + b;
}

var full, empty, spy1, spy2;

beforeEach( function () {
  full = c([ 1, 2, 3 ]);
  empty = c( 3 );
  spy1 = sinon.spy();
  spy2 = sinon.spy();
});

describe( ".forEach", function () {
  it( "should iterate over dense and sparse arrays in the same way", function () {
    full.forEach( spy1 );
    empty.forEach( spy2 );
    expect( spy1.callCount ).to.equal( 3 );
    expect( spy2.callCount ).to.equal( 3 );
  });
});

describe( ".nativeForEach", function () {
  it( "should iterate over dense and sparse arrays like the native forEach", function () {
    full.nativeForEach( spy1 );
    empty.nativeForEach( spy2 );
    expect( spy1.callCount ).to.equal( 3 );
    expect( spy2.callCount ).to.equal( 0 );
  });
});

describe( ".map()", function () {
  it( "should map over dense and sparse arrays in the same way", function () {
    expect( full.map( index ).toArray() ).to.deep.equal([ 0, 1, 2 ]);
    expect( empty.map( index ).toArray() ).to.deep.equal([ 0, 1, 2 ]);
  });
});

describe( ".nativeMap()", function () {
  it( "should map over dense and sparse arrays like the native map()", function () {
    expect( full.nativeMap( index ).toArray() ).to.deep.equal([ 0, 1, 2 ]);
    expect( empty.nativeMap( index ).toArray() ).to.deep.equal( new Array( 3 ) );
  });
});

describe( ".filter()", function () {
  it( "should filter dense and sparse arrays in the same way", function () {
    expect( full.filter( exists ).toArray() ).to.deep.equal([ 1, 2, 3 ]);
    expect( empty.filter( notExists ).toArray() ).to.deep.equal([ undefined, undefined, undefined ]);
  });
});

describe( ".nativeFilter()", function () {
  it( "should filter dense and sparse arrays like the native .filter()", function () {
    expect( full.nativeFilter( exists ).toArray() ).to.deep.equal([ 1, 2, 3 ]);
    expect( empty.nativeFilter( notExists ).toArray() ).to.deep.equal([]);
  });
});

describe( ".reduce()", function () {
  it( "should reduce dense and sparse arrays in the same way", function () {
    expect( full.reduce( stringAlong ) ).to.equal( "123" );
    expect( empty.reduce( stringAlong ) ).to.deep.equal( "undefinedundefinedundefined" );
  });
});

describe( ".nativeReduce()", function () {
  it( "should reduce dense and sparse arrays like the native .reduce()", function () {
    expect( full.nativeReduce( stringAlong ) ).to.equal( "123" );
    expect( function() { empty.nativeReduce( stringAlong ); } ).to.throw();
    empty[0] = 1;
    expect( empty.nativeReduce( stringAlong ) ).to.equal( 1 );
    empty[1] = 2;
    expect( empty.nativeReduce( stringAlong ) ).to.equal( "12" );
  });
});

describe( ".reduceRight()", function () {
  it( "should reduceRight dense and sparse arrays in the same way", function () {
    expect( full.reduceRight( stringAlong ) ).to.equal( "321" );
    expect( empty.reduceRight( stringAlong ) ).to.deep.equal( "undefinedundefinedundefined" );
    empty[0] = 1;
    expect( empty.reduceRight( stringAlong ) ).to.deep.equal( "undefinedundefined1" );
  });
});

describe( ".nativeReduceRight()", function () {
  it( "should reduce dense and sparse arrays like the native .reduce()", function () {
    expect( full.nativeReduceRight( stringAlong ) ).to.equal( "321" );
    expect( function() { empty.nativeReduceRight( stringAlong ); } ).to.throw();
    empty[0] = 1;
    expect( empty.nativeReduceRight( stringAlong ) ).to.equal( 1 );
    empty[1] = 2;
    expect( empty.nativeReduceRight( stringAlong ) ).to.equal( "21" );
  });
});

describe( ".some()", function () {
  it( "should some() dense and sparse arrays in the same way", function () {
    full.some( spy1 );
    empty.some( spy2 );
    expect( spy1.callCount ).to.equal( 3 );
    expect( spy2.callCount ).to.equal( 3 );
  });
});

describe( ".nativeSome()", function () {
  it( "should some dense and sparse arrays like the native .some()", function () {
    full.nativeSome( spy1 );
    empty.nativeSome( spy2 );
    expect( spy1.callCount ).to.equal( 3 );
    expect( spy2.callCount ).to.equal( 0 );
  });
});

describe( ".every()", function () {
  it( "should every() dense and sparse arrays in the same way", function () {
    var spy1 = sinon.spy();
    var spy2 = sinon.spy();
    full.every( spy1 );
    empty.every( spy2 );
    expect( spy1.callCount ).to.equal( 1 );
    expect( spy2.callCount ).to.equal( 1 );
  });
});

describe( ".nativeEvery()", function () {
  it( "should every dense and sparse arrays like the native .every()", function () {
    var spy1 = sinon.spy();
    var spy2 = sinon.spy();
    full.nativeEvery( spy1 );
    empty.nativeEvery( spy2 );
    expect( spy1.callCount ).to.equal( 1 );
    expect( spy2.callCount ).to.equal( 0 );
  });
});

describe( ".indexOf", function () {
  it( "should index dense and sparese arrays the same way", function () {
    expect( full.indexOf( 1 ) ).to.equal( 0 );
    expect( empty.indexOf( undefined ) ).to.equal( 0 );
  });
});

describe( ".nativeIndexOf", function () {
  it( "should index dense and sparese arrays the same way", function () {
    expect( full.nativeIndexOf( 3 ) ).to.equal( 2 );
    expect( empty.nativeIndexOf( undefined ) ).to.equal( -1 );
  });
});

describe( ".lastIndexOf", function () {
  it( "should index dense and sparese arrays the same way", function () {
    expect( full.lastIndexOf( 1 ) ).to.equal( 0 );
    expect( empty.lastIndexOf( undefined ) ).to.equal( 2 );
  });
});

describe( ".nativeLastIndexOf", function () {
  it( "should index dense and sparese arrays the same way", function () {
    expect( full.nativeLastIndexOf( 3 ) ).to.equal( 2 );
    expect( empty.nativeLastIndexOf( undefined ) ).to.equal( -1 );
  });
});
