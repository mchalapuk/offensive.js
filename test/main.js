Function.prototype.toJSON = function() {
  return this.toString().replace(/[\s]+/g, ' ');
}

require('coffee-script/register');
require('./unit.coffee');
require('./integration.coffee');

