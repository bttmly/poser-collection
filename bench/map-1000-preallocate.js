'use strict';

var Collection = require('../lib'),
    utils = require('./utils');

var fns = utils.fns('item', 'return item * item + Math.random()');
var input1 = [];
var input2 = Collection();
for (var i = 0; i < 1000; i++) {
  input1.push(i);
  input2.push(i);
}

exports['Array::map()'] = function () {
  return input1.map(fns());
};

exports['Collection::map()'] = function () {
  return input2.nativeMap(fns());
};

