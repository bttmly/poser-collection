'use strict';

var Collection = require('../lib'),
    utils = require('./utils');

var fns = utils.fns('item', 'return item * item + Math.random()');
var input1 = [1,2,3];
var input2 = Collection(1,2,3);

exports['Array::map()'] = function () {
  return input1.map(fns());
};

exports['Collection::map()'] = function () {
  return input2.nativeMap(fns());
};
