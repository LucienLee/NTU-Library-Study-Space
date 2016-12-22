var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  GRAPHQL_URL_ROOT: process.env.DEV_SERVER ? '"http://localhost:3000"' : '"http://140.112.113.10"'
})
