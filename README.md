# super-collection

[![Build Status](https://travis-ci.org/nickb1080/super-collection.svg?branch=master)](https://travis-ci.org/nickb1080/super-collection)

An extensible Array-like class which has a lot of the Underscore collection methods.
Super collection uses and extends an `Array` constructor and prototype from a different execution context via [Poser](https://github.com/bevacqua/poser/). Here's a [short article](http://blog.ponyfoo.com/2014/06/07/how-to-avoid-objectprototype-pollution) describing how Poser works.

## Instance Methods

**Important!**
super-collection uses the [fast.js]() equivalents for the ES5 array "extras". This means that, for certain obscure edge cases, methods like `forEach`, `map`, `filter`, `reduce`, `every`, and `some` might not work as expected. You can access the native versions of these methods by prefixing the method name with `native` (i.e. `nativeForEach`).

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

#### `whereNot(Object match)`
Returns a subset of the collection where each item doesn't have the same value for each property of `match`.

#### `find(Function test)`
Returns the first item in the collection for which `test(item)` returns a truthy value.

#### `findNot(Function test)`
Returns the first item in the collection for which `test(item)` returns a falsy value.

#### `findWhere(Object match)`
Like `where()` but returns only the first item.

#### `findWhereNot(Object match)`
Like `whereNot` but returns only the first item.

#### `pluck(String property)`
Maps a collection into a new collection of items containing only `property`.

#### `pick(String property [,String property, etc])`
Maps a collection into a new collection of items containing each passed in `property`.

#### `reject(Function test)`
Inverse of `filter()`. Returns a collection with all items for which `test(item)` returns a truthy value removed.

#### `invoke(String methodName | Function func [, arguments... ])`
If `invoke` is called with a function, `func` is called on each item in a collection. Otherwise, each item's method named `method` is called. Parameters beyond the first are used in the invocation.

### `mapInvoke(String methodName | Function func [, arguments... ])`
Like `invoke`, but returns a collection with the values returned by each invocation.

#### `without([Object item, etc.])`
Returns a collection with all items that `===` an argument removed.

#### `remove()`
An alias for `without()`.

#### `contains(Object value)`
Returns `true` if `value` is in the collection, otherwise `false`.

#### `tap(Function func)`
Calls a function `func` on the collection, and returns the collection.

#### `first([Number num])`
Returns the first `num` items in the collection; `num` defualts to 1.

#### `head()`
An alias for `first()`.

#### `take()`
An alias for `first()`.

#### `initial([Number num])`
Returns the items with indexes from 0 to length - `num`; `num` defaults to 1.

#### `last([Number num])`
Returns the last `num` items in the collection; `num` defaults to 1.

#### `rest([Number num])`
Returns the items with indexes `num` or greater; `num` defaults to 1.

#### `tail()`
An alias for `rest`.

#### `drop()`
An alias for `rest`.

#### `compact()`
Returns a collection with all falsy values removed.

#### `flatten()`
Returns a recursively flattened collection.

#### `partition(Function test)`
Returns a two item collection. The first item is a collection with all values from the original collection for which `test(item)` returns a truthy value. The second item is a collection with the remaining values.

#### `union([ArrayLike list, etc.])`
Returns a collection of all the unique items that are in the original collection and each `list`.

#### `intersection([ArrayLike list, etc.])`
Returns the items in the original collection which are also present in each `list`.

#### `difference([ArrayLike list, etc.])`
Returns the items which are in the original collection and are present in none of the `list` arguments.

#### `unique()`
Returns a collection with all the repeat items in the original collection removed.

#### `uniq()`
An alias for `unique()`.

#### `sortBy(Function test | String property [, context])`
Returns a collection sorted by either the result of calling `test(item)` on each item, or by `item[property]`.

#### `zip([ArrayLike list, etc.])`
Returns a collection in which items in the result with index `n` contain all the values of the original collection plus those of each `list` with index `n`.

#### `min([String property])`
Returns the minimum value in the list, or the minimum value among all items' `property` property.

#### `max([String property])`
Returns the maximum value in the list, or the maximum value among all items' `property` property.

#### `extent([String property])`
Returns a two-item collection where the first value is the result of calling `min()` and the second item is the result of calling `max()`.


## Factory Properties
#### `.ctor`
The `Collection` constructor. Works exactly like `Array` but doesn't `===` it.

#### `.proto`
`Collection.prototype`. This is where all the instance methods live. Augment at will.

### Factory Static Methods
#### `.isCollection(Object obj)`
Returns true if `obj` is `instanceof` the factory's copy of `Collection`. If you have multiple versions of `super-collection` running, instances won't satisfy another factory's `isCollection()`.

#### `.isArrayLike(Object obj)`
Returns true if `obj` is "array-like", i.e. returns true for `Array` instances and `Collection` instances. Uses `Object.prototype.toString`.

#### `.one([Object arg])`
Passes `arg` to factory; useful when you only want to use the factory's one-argument signature, for example in an iterator's callback.

#### `.deep([Object arg])`
Passes `arg` through factory recursively.

