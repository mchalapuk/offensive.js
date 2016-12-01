'use strict';

var Type = module.exports = {};

Type.ALL = [ 'boolean', 'number', 'string', 'object', 'function', 'undefined' ];
Type.ALL.forEach(function(typeName) { Type[typeName.toUpperCase()] = typeName; });

Type.articleBefore = function articleBefore(typeName) {
  return typeName === 'object'? 'an': typeName === 'undefined'? '': 'a';
};
Type.isType = function isType(typeName) {
  return Type.ALL.indexOf(typeName) !== -1;
};

/*
 eslint-env node
 */

