require('./ie-hacks.css');
require('object-assign-shim');

if (!String.prototype.trimRight) {
  String.prototype.trimRight = function() {
    return this.replace(/\s+$/);
  };
}

if (!String.prototype.trimLeft) {
  String.prototype.trimLeft = function() {
    return this.replace(/^\s+/);
  };
}

if (!Array.from) {
  Array.from = function(source) {
    return Array.prototype.slice.call(sources);
  };
}

if (!('Promise' in window)) {
  window.Promise = require('bluebird');
}
