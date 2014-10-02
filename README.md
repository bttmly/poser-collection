# poser-collection

[![Build Status](https://travis-ci.org/nickb1080/poser-collection.svg?branch=master)](https://travis-ci.org/nickb1080/poser-collection)

_Fast, fluent, extensible arrays._

poser-collection uses and extends an `Array` constructor and prototype from a different execution context via [Poser](https://github.com/bevacqua/poser/). Here's a [short article](http://blog.ponyfoo.com/2014/06/07/how-to-avoid-objectprototype-pollution) describing how Poser works.

```
npm install poser-collection
```

## Instance Methods

- ALL `Array.prototype` methods are available, subject to the caveat directly below.

**Important!**
poser-collection uses the [fast.js]() equivalents for the ES5 array "extras". This means that, for cases, methods like `forEach`, `map`, `filter`, `reduce`, `every`, and `some` might not work as expected. You can access the native versions of these methods by prefixing the method name with `native` (i.e. `nativeForEach`). The biggest difference is that these iteration methods _do_ iterate over "holes" (undefined items) in your collections. Here's a basic example:

```js
var collection = require("poser-collection");

var emptyCollection = collection(3); // [ , , ]
var emptyArray = new Array(3); // [ , , ]

emptyCollection.map(function (_, i) { return i }); // [0, 1, 2]
emptyArray.map(function (_, i) { return i }); // [ , , ]
```

... But now, actually, the methods:

#### `.forEach()`
The [fast.js](https://github.com/codemix/fast.js) implementation of `forEach`. The major difference from the native method is that it iterates over indexes for which a value isn't present.

#### `.map()`
The [fast.js](https://github.com/codemix/fast.js) implementation of `map`. The major difference from the native method is that it iterates over indexes for which a value isn't present.

#### `.filter()`
The [fast.js](https://github.com/codemix/fast.js) implementation of `filter`. The major difference from the native method is that it iterates over indexes for which a value isn't present.

#### `.reduce()`
The [fast.js](https://github.com/codemix/fast.js) implementation of `reduce`. The major difference from the native method is that it iterates over indexes for which a value isn't present.

#### `.reduceRight()`
The [fast.js](https://github.com/codemix/fast.js) implementation of `reduceRight`. The major difference from the native method is that it iterates over indexes for which a value isn't present.

#### `.every()`
The [fast.js](https://github.com/codemix/fast.js) implementation of `every`. The major difference from the native method is that it iterates over indexes for which a value isn't present.

#### `.some()`
The [fast.js](https://github.com/codemix/fast.js) implementation of `some`. The major difference from the native method is that it iterates over indexes for which a value isn't present.

#### `.indexOf()`
The [fast.js](https://github.com/codemix/fast.js) implementation of `indexOf`. The major difference from the native method is that it iterates over indexes for which a value isn't present.

#### `.lastIndexOf()`
The [fast.js](https://github.com/codemix/fast.js) implementation of `lastIndexOf`. The major difference from the native method is that it iterates over indexes for which a value isn't present.


#### `.nativeForEach()`
The native `Array` implementation of `forEach`.

#### `.nativeMap()`
The native `Array` implementation of `map`.

#### `.nativeFilter()`
The native `Array` implementation of `.filter`.

#### `.nativeReduce()`
The native `Array` implementation of `reduce`.

#### `.nativeReduceRight()`
The native `Array` implementation of `reduceRight`.

#### `.nativeEvery()`
The native `Array` implementation of `every`.

#### `.nativeSome()`
The native `Array` implementation of `some`.

#### `.nativeIndexOf()`
The native `Array` implementation of `indexOf`.

#### `.nativeLastIndexOf()`
The native `Array` implementation of `lastIndexOf`.

#### `chainPush()`
Works like `Array.prototype.push`, except it returns the collection so you can chain subsequent method calls.

#### `chainPop()`
Works like `Array.prototype.pop`, except it returns the collection so you can chain subsequent method calls.

#### `chainShift()`
Works like `Array.prototype.shift`, except it returns the collection so you can chain subsequent method calls.

#### `chainUnshift()`
Works like `Array.prototype.unshift`, except it returns the collection so you can chain subsequent method calls.

#### `each()`
An alias for `forEach()`

#### `select()`
An alias for `filter()`.

#### `collect()`
An alias for `map()`.

#### `where(Object match)`
Returns a subset of the collection where each item has the same value for each property of `match`.

```js
var people = collection([
  {name: "Nate", age: 30},
  {name: "Jane", age: 33}
  {name: "Nora", age: 30}
]);

people.where({age: 30}) 
// [{name: "Nate", age: 30}
//  {name: "Nora", age: 30 }]
```

#### `whereNot(Object match)`
Returns a subset of the collection where each item doesn't have the same value for each property of `match`.

```js
var people = collection([
  {name: "Nate", age: 30},
  {name: "Jane", age: 33}
  {name: "Nora", age: 30}
]);

people.whereNot({age: 30}) 
// [{name: "Jane", age: 33}]
```

#### `find(Function test)`
Returns the first item in the collection for which `test(item)` returns a truthy value.

```js
var people = collection([
  {name: "Nate", age: 30},
  {name: "Jane", age: 33}
  {name: "Nora", age: 30}
]);

people.find(function (person) {
  return person.name.charAt(0) === "N";
}); 
// {name: "Nate", age: 30}
```

#### `findNot(Function test)`
Returns the first item in the collection for which `test(item)` returns a falsy value.

```js
var people = collection([
  {name: "Nate", age: 30},
  {name: "Jane", age: 33}
  {name: "Nora", age: 30}
]);

people.findNot(function (person) {
  return person.name.charAt(0) === "N";
}); 
// {name: "Jane", age: 33}
```

#### `findWhere(Object match)`
Like `where()` but returns only the first item.

```js
var people = collection([
  {name: "Nate", age: 30},
  {name: "Jane", age: 33}
  {name: "Nora", age: 30}
]);

people.findWhere({age: 30}); 
// {name: "Nate", age: 30}
```

#### `findWhereNot(Object match)`
Like `whereNot` but returns only the first item.

```js
var people = collection([
  {name: "Nate", age: 30},
  {name: "Jane", age: 33}
  {name: "Nora", age: 30}
]);

people.findNot({age: 30}); 
// {name: "Jane", age: 33}
```

#### `pluck(String property)`
Maps a collection into a new collection of items equal to the `property` value of each object in the original collection.

```js
var people = collection([
  {name: "Nate", age: 30},
  {name: "Jane", age: 33}
  {name: "Nora", age: 30}
]);

people.pluck("name"); 
// ["Nate", "Jane", "Nora"]
```

#### `pick(String property [,String property, etc])`
Maps a collection into a new collection of items containing each passed in `property`.

#### `reject(Function test)`
Inverse of `filter()`. Returns a collection with all items for which `test(item)` returns a falsy value.

#### `invoke(String methodName | Function func [, arguments... ])`
If `invoke` is called with a function, `func` is called on each item in a collection. Otherwise, each item's method named `method` is called. Parameters beyond the first are used in the invocation. The `this` context is the item. Returns the collection.

```js
var Person = function(age) {
  this.age = age || 0;
}

Person.prototype.growOlder = function() {
  this.age += 1;
}

var people = collection([new Person(10), new Person(20)]);
people.invoke( "growOlder" );
people[0].age // 11
people[1].age // 21

people.invoke( function () {
  this.doubleAge = this.age * 2;
});

people[0].doubleAge // 22;
people[1].doubleAge // 42
```


#### `mapInvoke(String methodName | Function func [, arguments... ])`
Like `invoke`, but returns a collection with the values returned by each invocation.

```js
var nums = collection([1, 2, 3]);
var strs = nums.mapInvoke( "toString" ); 
// ["1", "2", "3"]
var doubles = nums.mapInvoke( function ( n ) { return this * n }, 2 );
// [2, 4, 6]
```

#### `without([Object item, etc.])`
Returns a collection with all items that `===` an argument removed.

```js
var things = collection(["a", 1, "b", 2]);
things.without(1, 2);
// ["a", "b"]

```

#### `remove()`
An alias for `without()`.

#### `contains(Object value)`
Returns `true` if `value` is in the collection, otherwise `false`.

```js
  var o = {};
  var c1 = collection([ o, 1, 2 ]);
  var c2 = collection([ {}, 1, 2 ]);
  c1.contains( o ) // true
  c2.contains( o ) // false
```

#### `tap(Function func, [ arguments... ])`
Calls a function `func` on the collection with the provided `arguments`, and returns the collection.

```js
var people = collection([{name: "Patrick"}, {name: "Max"}, {name: "Ali"}]);
people
  .sortBy( "name" )
  .tap( function ( title ) {
    this[0].title = title;
  }, "Mr." )
  .pluck( "title" );
  // ["Mr.", undefined, undefined]
```

#### `first([Number num])`
Returns the first `num` items in the collection; `num` defualts to 1.

```js
var letters = collection(["a", "b", "c", "d", "e"])
letters.first() // ["a"]
letters.first(2) // ["a", "b"]
```

#### `head()`
An alias for `first()`.

#### `take()`
An alias for `first()`.

#### `initial([Number num])`
Returns all but the last `num` items. `num` defaults to 1.

```js
var letters = collection(["a", "b", "c", "d", "e"])
letters.initial() // ["a", "b", "c", "d"]
letters.initial(2) // ["a", "b", "c"]
```

#### `last([Number num])`
Returns the last `num` items in the collection; `num` defaults to 1.

```js
var letters = collection(["a", "b", "c", "d", "e"])
letters.last() // ["e"]
letters.last(2) // ["d", "e"]
```


#### `rest([Number num])`
Returns the items with indexes `num` or greater; `num` defaults to 1.

```js
var letters = collection(["a", "b", "c", "d", "e"])
letters.rest() // ["b", "c", "d", "e"]
letters.rest(2) // ["c", "d", "e"]
```

#### `tail()`
An alias for `rest`.

#### `drop()`
An alias for `rest`.

#### `compact()`
Returns a collection with all falsy values removed.

```js
things.var things = collection(0, 1, true, false, "a", "", [], null, {}, undefined)
compact() // [1, true, "a", [], {}]
```

#### `flatten()`
Returns a recursively flattened collection.

```js
var nested = collection([1,[2,[3,[4]]]]);
nested.flatten() // [1, 2, 3, 4]
```

#### `partition(Function test)`
Returns a two item collection. The first item is a collection with all values from the original collection for which `test(item)` returns a truthy value. The second item is a collection with the remaining values.

```js
var identity = function ( x ) { return x; };
var things = collection(0, 1, true, false, "a", "", [], null, {}, undefined)
things.partition( identity )
// [[1, true, "a", [], {}], [0, false, "", null, undefined]]
```

#### `union([ArrayLike list, etc.])`
Returns a collection of all the unique items that are in the original collection and each `list`.

```js
var letters = collection('a', 'b', 'c');
letters.union(['x', 'y', 'z'], ['a', 'c', 'd']);
// ["a", "b", "c", "x", "y", "z", "d"]
```

#### `intersection([ArrayLike list, etc.])`
Returns the items in the original collection which are also present in each `list`.

```js
var letters = collection('a', 'b', 'c');
letters.intersection(['a', 'b', 'z'], ['a', 'c', 'z'])
// ["a"]

```

#### `difference([ArrayLike list, etc.])`
Returns the items which are in the original collection and are present in none of the `list` arguments.

```js
var letters = collection('a', 'b', 'c');
letters.difference(['a', 'b', 'z'], ['a', 'y', 'z'])
// ["c"]
```

#### `unique()`
Returns a collection with all the repeat items in the original collection removed. Uses strict equality for comparison.

```js
collection([1, 2, "a", 1]).unique() // [1, 2, "a"]
collection([{}, {}, {}]).unique() // [{}, {}, {}]
```

#### `uniq()`
An alias for `unique()`.

#### `sortBy(Function test | String property [, context])`
Returns a collection sorted by either the result of calling `test(item)` on each item, or by `item[property]`.

#### `zip([ArrayLike list, etc.])`
Returns a collection in which items in the result with index `n` contain all the values of the original collection plus those of each `list` with index `n`.

#### `min([String property])`
Returns the minimum value in the list, or the minimum value among all items' `property` property.

```js
collection([1, 9, 20, 4, 16]).min() // 1

collection([
  {age: 10},
  {age: 13},
  {age: 19},
  {age: 7}
]).min( "age" ); // 7
```

#### `max([String property])`
Returns the maximum value in the list, or the maximum value among all items' `property` property.

```js
collection([1, 9, 20, 4, 16]).max() // 20

collection([
  {age: 10},
  {age: 13},
  {age: 19},
  {age: 7}
]).max( "age" ); // 19
```

#### `extent([String property])`
Returns a two-item collection where the first value is the result of calling `min()` and the second item is the result of calling `max()`.

```js
collection([1, 9, 20, 4, 16]).extent() // [1, 20]

collection([
  {age: 10},
  {age: 13},
  {age: 19},
  {age: 7}
]).extent( "age" ); // [7, 19]
```

#### `asRowsOf([ArrayLike headers])`
Returns a collection where the original collection and `headers` have been merged into a objects, where a given index of `headers` is the key for that index in each item in the original.

#### `asHeadersOf([ArrayLike rows)`
Returns a collection where the original collection and `rows` have been merged into a objects, where a given index of the original is the key for that index in each item in `rows`.

## Factory Properties
#### `.ctor`
The `Collection` constructor. It's a reference to the `Array` global object from another execution context. As such, it works exactly like `Array` but doesn't `===` it.

#### `.proto`
`Collection.prototype`. This is where all the instance methods live. Augment at will. This reference is provided for convenience, and can also be accessed through `.ctor.prototype`.

## Factory Static Methods
#### `.extend(Object stuff)`
Copies the properties and values of `stuff` into `Collection.prototype`.

#### `.isCollection(Object obj)`
Returns true if `obj` is `instanceof` the factory's copy of `Collection`. If you have multiple versions of `poser-collection` running, instances won't satisfy another factory's `isCollection()`.

#### `.isArrayish(Object obj)`
Returns true if `obj` is "array-like", i.e. returns true for `Array` instances and `Collection` instances. Uses `Object.prototype.toString`.
_Note_: Previously was named `.isArrayLike()`, however that term is generally taken to mean an object that is _similar enough_ to an array to be used with, e.g. `[].forEach.call()`. This category includes `HTMLCollection` and `jQuery` objects. `isArrayish()` is much more strict.

#### `.one([Object arg])`
Passes `arg` to factory; useful when you only want to use the factory's one-argument signature, for example in an iterator's callback.

#### `.deep([Object arg])`
Passes `arg` through factory recursively.
