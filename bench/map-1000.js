'use strict';

var Collection = require('../lib'),
    utils = require('./utils');

var fns = utils.fns('item', 'return item * item + Math.random()');

exports['Array::map()'] = function () {
  var input = [];
  for (var i = 0; i < 1000; i++) {
    input.push(i);
  }
  return input.map(fns());
};

exports['Collection::map()'] = function () {
  var input = Collection();
  for (var i = 0; i < 1000; i++) {
    input.push(i);
  }
  return input.nativeMap(fns());
};

