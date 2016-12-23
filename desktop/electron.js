const { app, BrowserWindow, protocol, Menu } = require('electron')
const path = require('path')

let mainWindow
let config = {
	scheme: 'resource',
	assetsRoot: '/dist',
	url: `file://${__dirname}/dist/index.html`,
	menu: [{
		label: 'Application',
		submenu: [
			{ label: 'Reload', accelerator: 'CmdOrCtrl+R', role: 'reload' },
			{ type: 'separator' },
			{ label: 'Quit', accelerator: 'Cmd+Q', click: function() { app.quit() }}
		]
	}, {
		label: 'Edit',
		submenu: [
			{ label: 'Copy', accelerator: 'CmdOrCtrl+C', role: 'copy' },
			{ label: 'Paste', accelerator: 'CmdOrCtrl+V', role: 'paste' }
		]
	}],
	window: {
		height: 1920,
		width: 1080,
		kiosk: true,
		frame: false
	}
}

function createWindow() {
	mainWindow = new BrowserWindow(config.window)
	// mainWindow.webContents.openDevTools()

	mainWindow.loadURL(config.url)

	mainWindow.on('closed', () => {
		mainWindow = null
	})

	console.log('mainWindow opened')
}

function registerResourceProtocol() {
	const scheme = config.scheme

	protocol.registerFileProtocol(scheme, (request, callback) => {
		const url = request.url.substr(`${scheme}://`.length)
		callback({ path: path.join(__dirname, config.assetsRoot, url) })
	}, (error) => {
		if (error) console.error('Failed to register protocol')
	})
}

protocol.registerStandardSchemes([config.scheme])
app.on('ready', () => {
	Menu.setApplicationMenu(Menu.buildFromTemplate(config.menu))
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
