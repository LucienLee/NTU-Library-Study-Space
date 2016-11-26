const {app, BrowserWindow, protocol} = require('electron')
const path = require('path')

let mainWindow
let config = {
	scheme: 'resource',
	assetsRoot: '/dist',
	url: `file://${__dirname}/dist/index.html`
}

function createWindow () {
	mainWindow = new BrowserWindow({
		height: 1920,
		width: 1080
	})

	mainWindow.maximize()

	// mainWindow.setFullScreen(true)
	// mainWindow.webContents.openDevTools()

	mainWindow.loadURL(config.url)

	mainWindow.on('closed', () => {
		mainWindow = null
	})

	console.log('mainWindow opened')
}

function registerResourceProtocol () {
	const scheme = config.scheme

	protocol.registerFileProtocol(scheme, (request, callback) => {
		const url = request.url.substr( `${scheme}://`.length  )
		callback({path: path.join(__dirname, config.assetsRoot, url)})
	}, (error) => {
		if (error) console.error('Failed to register protocol')
	})
}

protocol.registerStandardSchemes([config.scheme])
app.on('ready', () => {
	registerResourceProtocol()
	createWindow()
})

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit()
	}
})

app.on('activate', () => {
	if (mainWindow === null) {
		createWindow()
	}
})
