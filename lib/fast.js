// implementations of forEach, map, reduce, reduceRight, indexOf, lastIndexOf, some, partial from fast.js
// https://github.com/codemix/fast.js

"use strict";

function bindInternal3 (func, thisContext) {
  return function (a, b, c) {
    return func.call(thisContext, a, b, c);
  };
}

function bindInternal4 (func, thisContext) {
  return function (a, b, c, d) {
    return func.call(thisContext, a, b, c, d);
  };
}

function applyWithContext (subject, thisContext, args) {
  switch (args.length) {
  case 0:
    return subject.call(thisContext);
  case 1:
    return subject.call(thisContext, args[0]);
  case 2:
    return subject.call(thisContext, args[0], args[1]);
  case 3:
    return subject.call(thisContext, args[0], args[1], args[2]);
  case 4:
    return subject.call(thisContext, args[0], args[1], args[2], args[3]);
  case 5:
    return subject.call(thisContext, args[0], args[1], args[2], args[3], args[4]);
  case 6:
    return subject.call(thisContext, args[0], args[1], args[2], args[3], args[4], args[5]);
  case 7:
    return subject.call(thisContext, args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
  case 8:
    return subject.call(thisContext, args[0], args[1], args[2], args[3], args[4], args[5], args[6], args[7]);
  default:
    return subject.apply(thisContext, args);
  }
}

module.exports = function (ArrayLike) {
  return {
    forEach: function fastForEach (subject, fn, thisContext) {
      var length = subject.length,
          iterator = thisContext !== undefined ? bindInternal3(fn, thisContext) : fn,
          i;
      for (i = 0; i < length; i++) {
        iterator(subject[i], i, subject);
      }
    },

    map: function fastMap (subject, fn, thisContext) {
      var length = subject.length,
          result = new ArrayLike(length),
          iterator = thisContext !== undefined ? bindInternal3(fn, thisContext) : fn,
          i;
      for (i = 0; i < length; i++) {
        result[i] = iterator(subject[i], i, subject);
      }
      return result;
    },

    filter: function fastFilter (subject, fn, thisContext) {
      var length = subject.length,
          result = new ArrayLike(),
          iterator = thisContext !== undefined ? bindInternal3(fn, thisContext) : fn,
          i;
      for (i = 0; i < length; i++) {
        if (iterator(subject[i], i, subject)) {
          result.push(subject[i]);
        }
      }
      return result;
    },

    reduce: function fastReduce (subject, fn, initialValue, thisContext) {
      var length = subject.length,
          iterator = thisContext !== undefined ? bindInternal4(fn, thisContext) : fn,
          i, result;

      if (initialValue === undefined) {
        i = 1;
        result = subject[0];
      }
      else {
        i = 0;
        result = initialValue;
      }

      for (; i < length; i++) {
        result = iterator(result, subject[i], i, subject);
      }

      return result;
    },

    reduceRight: function fastReduce (subject, fn, initialValue, thisContext) {
      var length = subject.length,
          iterator = thisContext !== undefined ? bindInternal4(fn, thisContext) : fn,
          i, result;

      if (initialValue === undefined) {
        i = length - 2;
        result = subject[length - 1];
      }
      else {
        i = length - 1;
        result = initialValue;
      }

      for (; i >= 0; i--) {
        result = iterator(result, subject[i], i, subject);
      }

      return result;
    },

    indexOf: function fastIndexOf (subject, target, fromIndex) {
      var length = subject.length,
          i = 0;

      if (typeof fromIndex === "number") {
        i = fromIndex;
        if (i < 0) {
          i += length;
          if (i < 0) {
            i = 0;
          }
        }
      }

      for (; i < length; i++) {
        if (subject[i] === target) {
          return i;
        }
      }
      return -1;
    },

    lastIndexOf: function fastLastIndexOf (subject, target, fromIndex) {
      var length = subject.length,
          i = length - 1;

      if (typeof fromIndex === "number") {
        i = fromIndex;
        if (i < 0) {
          i += length;
        }
      }
      for (; i >= 0; i--) {
        if (subject[i] === target) {
          return i;
        }
      }
      return -1;
    },

    some: function fastSome (subject, fn, thisContext) {
      var length = subject.length,
          iterator = thisContext !== undefined ? bindInternal3(fn, thisContext) : fn,
          i;
      for (i = 0; i < length; i++) {
        if (iterator(subject[i], i, subject)) {
          return true;
        }
      }
      return false;
    },

    every: function fastEvery (subject, fn, thisContext) {
      var length = subject.length,
          iterator = thisContext !== undefined ? bindInternal3(fn, thisContext) : fn,
          i;
      for (i = 0; i < length; i++) {
        if (!iterator(subject[i], i, subject)) {
          return false;
        }
      }
      return true;
    },

    partial: function fastPartial (fn) {
      var boundLength = arguments.length - 1,
          boundArgs;

      boundArgs = new ArrayLike(boundLength);
      for (var i = 0; i < boundLength; i++) {
        boundArgs[i] = arguments[i + 1];
      }
      return function () {
        var length = arguments.length,
            args = new ArrayLike(boundLength + length),
            i;
        for (i = 0; i < boundLength; i++) {
          args[i] = boundArgs[i];
        }
        for (i = 0; i < length; i++) {
          args[boundLength + i] = arguments[i];
        }
        return applyWithContext(fn, this, args);
      };
    }
  };
};
