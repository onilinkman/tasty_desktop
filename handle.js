const { ipcMain } = require('electron');
const { AddMerchandise } = require('./confDataBase');

function HandleAddMerchandise() {
	ipcMain.handle('addMerchandise', async (event, ...args) => {
		let err2 = null;
		let obj = JSON.parse(args[0]);
		if (obj) {
			let merchandise = obj.merchandise;
			let date = obj.date;
			let place = obj.place;
			let itemsArray = obj.itemsArray;
			await new Promise((resolve, reject) => {
				AddMerchandise(merchandise, date, place, itemsArray, (err) => {
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
		}
	});
}

module.exports = {
	HandleAddMerchandise,
};
