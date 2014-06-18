var range = function( start, end ){
  if ( start === undefined ) {
    var end = start;
    var start = 0;
  }
  var results = [];
  while ( start < end ){
    results.push( start );
    start++;
  }
  return results;
}

var haveSameValues = function( a, b ){
  for ( var i = 0; i < a.length; i++ ){
    if ( a[i] !== b[i] ) return false;
  }
  return true;
};

var getName = function(){
  return this.name;
};

var userData = function( addMethod ){
  var o = [
    {
      name: "Alex",
      age: 20
    }, {
      name: "Bob",
      age: 30
    }, {
      name: "Claire",
      age: 30
    }, {
      name: "Dana",
      age: 30
    }, {
      name: "Evan",
      age: 20
    }, {
      name: "Frank",
      age: 20
    }, {
      name: "George",
      age: 40
    }, {
      name: "Harriet",
      age: 30
    }
  ];
  if ( addMethod ) {
    for ( var i = 0; i < o.length; i++ ) {
      o[i].getName = getName;
    }
  }
  return o;
}