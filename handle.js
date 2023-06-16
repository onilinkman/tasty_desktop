const { ipcMain } = require('electron');
const { AddMerchandise, GetAllItems, AddUser } = require('./confDataBase');

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

function HandleGetAllItems() {
	ipcMain.handle('getAllItems', async (event, ...args) => {
		let data = {
			status: 0,
			data: [],
			msg: '',
		};
		await new Promise((resolve, reject) => {
			GetAllItems((err, rows) => {
				if (err) {
					reject(err);
				} else {
					resolve(rows);
				}
			});
		})
			.then((result) => {
				data.status = 200;
				data.data = result;
				data.msg = 'get is success';
			})
			.catch((err) => {
				data.status = -1;
				data.data = null;
				data.msg = err;
			});
		return JSON.stringify(data);
	});
}

function HandleAddUser() {
	ipcMain.handle('addUser', async (event, ...args) => {
		let data = {
			status: 0,
			msg: '',
		};
		let obj = JSON.parse(args[0]);
		console.log(obj);
		await new Promise((resolve, reject) => {
			AddUser(obj.fullname, (err) => {
				if (err) {
					reject(err);
				} else {
					resolve('Se agrego correctamente');
				}
			});
		})
			.then((result) => {
				data.status = 200;
				data.msg = result;
			})
			.catch((err) => {
				data.status = -1;
				data.msg = err;
			});
		return JSON.stringify(data);
	});
}

module.exports = {
	HandleAddMerchandise,
	HandleGetAllItems,
	HandleAddUser,
};
