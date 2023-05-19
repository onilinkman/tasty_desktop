const { ipcMain } = require('electron');
const { AddMerchandise } = require('./confDataBase');

function HandleAddMerchandise() {
	ipcMain.handle('addMerchandise', async (event, ...args) => {
		let err2 = null;
		await new Promise((resolve, reject) => {
			AddMerchandise(null, args[1], args[2], (err) => {
				if (err) {
					reject(err);
				} else {
					resolve(null);
				}
			});
		})
			.then((data) => {
				err2 = null;
			})
			.catch((err) => {
				err2 = { errno: err.errno, code: err.code };
			});
		return err2;
	});
}

module.exports = {
	HandleAddMerchandise,
};
