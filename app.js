const { app, autoUpdater, BrowserWindow } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow;

const createWindow = () => {
	mainWindow = new BrowserWindow({
		titleBarStyle: 'hidden',
		titleBarOverlay: {
			color: '#ffffff',
			symbolColor: '#004aad',
			height: 40,
		},
		width: 800,
		height: 600,
	});
	if (isDev) {
		console.log('corriendo en desarrollo');
	} else {
		console.log('produccion');
		autoUpdater.checkForUpdates();
		require('update-electron-app')();
	}

	mainWindow.loadFile(path.join(__dirname, '/front/index.html'));
};

app.whenReady().then(() => {
	createWindow();
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit();
});

autoUpdater.setFeedURL({
	url: `https://github.com/onilinkman/tasty_desktop/releases/tag/v1.0.1`,
	serverType: 'GitHub',
});

autoUpdater.on('update-available', () => {
	console.log('Actualización disponible');
});

autoUpdater.on('update-not-available', () => {
	console.log('No hay actualizaciones disponibles');
});

autoUpdater.on('download-progress', (progressObj) => {
	console.log(`Progreso de descarga: ${progressObj.percent}%`);
});

autoUpdater.on('update-downloaded', () => {
	console.log('Actualización descargada');
	autoUpdater.quitAndInstall();
});

autoUpdater.on('error', (err) => {
	console.error('Error durante la verificación de actualizaciones', err);
});
