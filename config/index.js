// see http://vuejs-templates.github.io/webpack for documentation.
var path = require('path')

module.exports = {
  release: {
    index: path.resolve(__dirname, '../desktop/dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../desktop/dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: 'resource://',
  },
  build: {
    env: require('./prod.env'),
    index: path.resolve(__dirname, '../dist/index.html'),
    assetsRoot: path.resolve(__dirname, '../dist'),
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    productionSourceMap: true,
    // Gzip off by default as many popular static hosts such as
    // Surge or Netlify already gzip all static assets for you.
    // Before setting to `true`, make sure to:
    // npm install --save-dev compression-webpack-plugin
    productionGzip: false,
    productionGzipExtensions: ['js', 'css']
  },
  dev: {
    env: require('./dev.env'),
    port: 8080,
    assetsSubDirectory: 'static',
    assetsPublicPath: '/',
    proxyTable: {},
    // CSS Sourcemaps off by default because relative paths are "buggy"
    // with this option, according to the CSS-Loader README
    // (https://github.com/webpack/css-loader#sourcemaps)
    // In our experience, they generally work as expected,
    // just be aware of this issue when enabling this option.
    cssSourceMap: false
  },
  electron: {
  	// see https://github.com/electron-userland/electron-packager for documentation.
  	name: 'Study Space Register',
  	arch: 'x64',
	asar: true,
	dir: path.resolve(__dirname, '../desktop'),
	icon: path.resolve(__dirname, '../desktop/icons/icon'),
	ignore: /\b(node_modules|src|index\.ejs|icons)\b/,
	out: path.resolve(__dirname, '../release'),
	overwrite: true,
	platform: process.env.PLATFORM_TARGET || 'all'
  }
}
