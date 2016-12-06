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
Type.ALL.forEach(function(typeName) {
  Type['is'+ typeName.charAt(0).toUpperCase() + typeName.substring(1)] = isOfType.bind(null, typeName);
});

function isOfType(typeName, value) {
  return typeof value === typeName;
}

/*
 eslint-env node
 */

