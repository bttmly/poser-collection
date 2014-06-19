var f = (function( global ){

  var borrow = function( className ){
    var iframe, altCtx, key, stolen, frames;
    frames = global.frames;
    key = Math.random().toString( 36 ).slice( 2 );
    iframe = global.document.createElement( "iframe" );
    iframe.style.display = "none";
    global.document.body.appendChild( iframe );
    altCtx = frames[frames.length - 1].document;
    altCtx.write(
      "<script>parent['" +
      key +
      "'] = " +
      className + 
      ";</script>"
    );
    stolen = global[key];
    delete global[key];
    return stolen;
  };

  var EnhancedFunction = borrow( "Function" );
  var fp = EnhancedFunction.prototype;

  var factory = function( fn ) {
    return ( new EnhancedFunction("", 
      "var args = [].slice.call( arguments ); " +
      "var fn = arguments.shift(); " + 
      "return fn.apply( this, args );" 
    ) ).partial( fn );
  };

  fp.curry = function() {

  };

  fp.partial = function() {
    slice = Function.prototype.call.bind( [].slice );
    var args = slice( arguments, 1 );
    return function() {
      return this.apply( this, args.concat( slice( arguments ) ) );
    }.bind( this );
  };

  fp.flip = function() {

  }

  return factory;

})( window );