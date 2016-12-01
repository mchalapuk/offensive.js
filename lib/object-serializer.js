'use strict';

module.exports = ObjectSerializer;

function ObjectSerializer() {
  var proto = ObjectSerializer.prototype;
  var that = Object.create(proto);

  Object.keys(proto)
    .filter(function(key) { return typeof proto[key] === 'function'; })
    .forEach(function(key) { that[key] = proto[key].bind(that); });
  return that;
}

ObjectSerializer.prototype = {
  serializeAny: function serializeAny(any) {
    switch (typeof any) {
      default:
        return ''+ any;
//      case 'string':
//        return '\''+ any +'\'';
      case 'function':
        return this.serializeFunction(any);
      case 'object':
        return this.serializeObject(any);
    }
  },

  serializeFunction: function serializeFunction(func) {
    return func.name? 'function '+ func.name : 'unnamed function';
  },

  serializeObject: function serializeObject(object) {
    if (object === null) {
      return 'null';
    }
    if (object instanceof Array) {
      return '['+ object.map(this.serializeField).join(', ') +']';
    }

    var keys = Object.keys(object);
    if (keys.length === 0) {
      return '{}';
    }

    var that = this;
    function keyToString(key) {
      return key +': '+ that.serializeField(object[key]);
    }
    return '{ '+ keys.map(keyToString).join(', ') +' }';
  },

  serializeField: function serializeField(any) {
    switch (typeof any) {
      default:
        return ''+ any;
//      case 'string':
//        return '\''+ any +'\'';
      case 'function':
        return this.serializeFunction(any);
      case 'object':
        return this.serializeObjectField(any);
    }
  },

  serializeObjectField: function serializeObjectField(object) {
    if (object === null) {
      return 'null';
    }
    if (object instanceof Array) {
      return '[ ... ]';
    }
    return '{ ... }';
  },
};

/*
  eslint-env node
 */

