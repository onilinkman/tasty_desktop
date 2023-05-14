const { app, autoUpdater, dialog } = require('electron');

const baseUrl = 'https://github.com/onilinkman/tasty_desktop';
const feed = `${baseUrl}/releases/download`;

autoUpdater.setFeedURL({
	url: `${feed}/v${app.getVersion()}`,
	serverType: 'GitHub',
});

autoUpdater.on('update-downloaded', (event, releaseNotes, releaseName) => {
    console.log('hol3');
	const dialogOpts = {
		type: 'info',
		buttons: ['Reiniciar', 'Después'],
		title: 'Actualización disponible',
		message: process.platform === 'win32' ? releaseNotes : releaseName,
		detail: 'Se ha descargado una actualización. Reinicia la aplicación para aplicar los cambios.',
	};

	dialog.showMessageBox(dialogOpts).then((returnValue) => {
		if (returnValue.response === 0) autoUpdater.quitAndInstall();
	});
});

app.on('ready', async () => {
	try {
		await autoUpdater.checkForUpdates();
		console.log('Check for updates completed successfully');
	} catch (error) {
		console.log('An error occurred while checking for updates:', error);
	}
});
console.log('hol2');
