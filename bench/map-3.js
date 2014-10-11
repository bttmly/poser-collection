'use strict';

var Collection = require('../lib'),
    utils = require('./utils');

var fns = utils.fns('item', 'return item * item + Math.random()');

exports['Array::map()'] = function () {
  var input = [1,2,3];
  return input.map(fns());
};

exports['Collection::map()'] = function () {
  var input = Collection(1,2,3);
  return input.nativeMap(fns());
};
