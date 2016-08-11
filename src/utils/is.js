export default {
  _undefined(value) {
    return value === void 0;
  },

  _object(value) {
    return typeof value === 'object';
  },

  _function(value) {
    return typeof value === 'function';
  },

  _array(value) {
    return value instanceof Array;
  }
};
