require('shelljs/global')
process.env.NODE_ENV = 'production'
process.env.RELEASE_TARGET = 'electron'

const packager = require('electron-packager')
const path = require('path')
const ora = require('ora')
const webpack = require('webpack')
const config = require('../config')
const webpackConfig = require('./webpack.prod.conf')

const assetsPath = path.join(config.release.assetsRoot, config.release.assetsSubDirectory)
const spinner = ora('building for desktop production...')

function pack () {
	spinner.start()

	rm('-rf', assetsPath)
	mkdir('-p', assetsPath)
	cp('-R', 'static/*', assetsPath)

	webpack(webpackConfig, function(err, stats){
		spinner.stop()
		if (err) throw err
		process.stdout.write(stats.toString({
			colors: true,
			modules: false,
			children: false,
			chunks: false,
			chunkModules: false
		}) + '\n')

		build()
	})
}

function build () {
	let options = config.electron

	console.log('\x1b[34mBuilding electron app(s)...\n\x1b[0m')
	packager(options, (err, appPaths) => {
		if (err) {
			console.error('\x1b[31mError from `electron-packager` when building app...\x1b[0m')
			console.error(err)
		} else {
			console.log('Build(s) successful!')
			console.log(appPaths)

			console.log('\n\x1b[34mDONE\n\x1b[0m')
		}
	})
}

pack()
