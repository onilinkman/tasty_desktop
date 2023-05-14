const { app, BrowserWindow } = require('electron');

const createWindow = () => {
	const win = new BrowserWindow({
		titleBarStyle: 'hidden',
		titleBarOverlay: {
			color: '#ffffff',
			symbolColor: '#004aad',
			height: 40,
		},
		width: 800,
		height: 600,
	});

	win.setOverlayIcon('./animal_cow.ico', 'Tasty');

	win.loadFile('./front/index.html');
};

app.whenReady().then(() => {
	createWindow();
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit();
});
