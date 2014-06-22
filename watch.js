var child = require( "child_process" );
var args = process.argv.slice( 2 );

// global variable name that holds the collection factory function.
var globalName = args[0] || "c";
child.exec( "watchify thief-collection.js -s " + globalName + " -o tc.js" );