'use strict';

// built in getValues
module.exports = {
  value: {
    name: function(context) { return context._name; },
    value: function(context) { return context._value; },
  },
  property: function(propertyName) {
    return {
      name: function(context) { return context._name +'.'+ propertyName; },
      value: function(context) { return context._value[propertyName]; },
    };
  },
  element: function(index) {
    return {
      name: function(context) { return context._name +'['+ index +']'; },
      value: function(context) { return context._value[index]; },
    };
  },
};

/*
  eslint-env node
 */

