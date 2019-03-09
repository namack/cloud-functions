require('env-yaml').config();
require('@babel/register')({
  presets: ['@babel/preset-env'],
});

module.exports = require('./scripts/test')