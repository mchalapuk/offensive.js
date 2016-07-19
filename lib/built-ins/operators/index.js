'use strict';

var UnaryOperator = require('../../model/unary-operator').default;
var BinaryOperator = require('../../model/binary-operator').default;
var Alias = require('../../model/alias').default;

module.exports = {
  'and': new BinaryOperator(function() {
    this.message = 'and';
  }),
  'of': new Alias('and'),
  'with': new Alias('and'),

  'not': new UnaryOperator(function(context, state) {
    this.message = 'not';

    var previousStrategy = state.strategy;
    state.strategy = notStrategy;

    function notStrategy(condition, _context, _state) {
      _state.strategy = previousStrategy;
      return _state.strategy(negatedCondition, _context, _state);

      function negatedCondition(value) {
        return !condition(value);
      }
    }
  }),

  // either and or must be used in combination
  'either': new UnaryOperator(function(context) {
    context.push().insideEither = true;
  }),
  'weather': new Alias('either'),

  'or': new BinaryOperator(function(context, state) {
    if (!state.insideEither) {
      throw new Error('.or used without .either');
    }
    this.message = 'or';
    state.strategy = orStrategy;

    function orStrategy(condition, _context, _state) {
      var result = condition(context.value);
      _state.result = _state.result || result;
      _context.pop();
      return result;
    }
  }),
};

/*
  eslint-env node
 */

