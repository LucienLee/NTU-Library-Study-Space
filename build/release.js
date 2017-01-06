require('shelljs/global')
/* global rm, mkdir, cp */

process.env.NODE_ENV = 'production'
process.env.RELEASE_TARGET = 'electron'

const packager = require('electron-packager')
const path = require('path')
const ora = require('ora')
const chalk = require('chalk')
const webpack = require('webpack')
const config = require('../config')
const webpackConfig = require('./webpack.prod.conf')

const assetsPath = path.join(config.release.assetsRoot, config.release.assetsSubDirectory)

function pack () {
  const spinner = ora('Packing for desktop production...')
  spinner.start()

  rm('-rf', assetsPath)
  mkdir('-p', assetsPath)
  cp('-R', 'static/*', assetsPath)

  webpack(webpackConfig, (err, stats) => {
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
  const options = config.electron
  const spinner = ora('Building electron app(s)...')
  spinner.start()

  packager(options, (err, appPaths) => {
    spinner.stop()
    if (err) {
      console.error(chalk.red('Error from `electron-packager` when building app...'))
      console.error(err)
    } else {
      console.log(chalk.green('Build(s) successful!'))
      console.log('App builded in...')
      console.log(chalk.underline(appPaths.join('\n')))
      console.log(chalk.blue('DONE'))
    }
  })
}

pack()
