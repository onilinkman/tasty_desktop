const { app, BrowserWindow } = require('electron');
const path= require('path')
const isDev=require('electron-is-dev')

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
	if(isDev){
		console.log('corriendo en desarrollo')
	}else{
		console.log('produccion')
		require('update-electron-app')()
	}

	win.loadFile(path.join(__dirname,'/front/index.html'));
};

app.whenReady().then(() => {
	createWindow();
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') app.quit();
});
