'use strict';

var Collection = require('../lib'),
    utils = require('./utils');

var fns = utils.fns('item', 'return item * item + Math.random()');

exports['Array::push()'] = function () {
  var input = [];
  for (var i = 0; i < 3; i++) {
    input.push(i);
  }
};

exports['Collection::push()'] = function () {
  var input = Collection();
  for (var i = 0; i < 3; i++) {
    input.push(i);
  }
};

