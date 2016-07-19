'use strict';

// built in getters
module.exports.default = {
  value: {
    name: function(context) { return context.name; },
    value: function(context) { return context.value; },
  },
  property: function(propertyName) {
    return {
      name: function(context) { return context.name +'.'+ propertyName; },
      value: function(context) { return context.value[propertyName]; },
    };
  },
  element: function(index) {
    return {
      name: function(context) { return context.name +'['+ index +']'; },
      value: function(context) { return context.value[index]; },
    };
  },
};

/*
  eslint-env node
 */

