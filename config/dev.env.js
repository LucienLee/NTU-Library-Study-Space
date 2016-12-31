var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  REGISTER_API_ENV: JSON.stringify(process.env.REGISTER_API_ENV) || '"development"',
  HISTORY_API_ENV: JSON.stringify(process.env.HISTORY_API_ENV) || '"development"'
})
