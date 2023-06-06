const fs = require('fs');

const DB_NAME = 'database.db';

const sqlite3 = require('sqlite3');
var db;

function InitDB() {
	if (existDB) {
		ConnectDB();
	} else {
		createDB();
		ConnectDB();
	}

	CreateTables();
}

function createDB() {
	db = new sqlite3.Database(DB_NAME, (err) => {
		if (err) {
			console.error(err.message);
		}
		console.log('Base de datos creada');
	});
}

function ConnectDB() {
	db = new sqlite3.Database(DB_NAME, (err) => {
		if (err) {
			console.error('error al conectar', err.message);
		}
	});
	console.log('conectado a la base de datos');
}

function existDB() {
	return fs.existsSync(DB_NAME);
}

function getDB() {
	return db;
}

/**
 * this function create table user if not exist
 */
function createTableUsers() {
	db.run(
		`CREATE TABLE IF NOT EXISTS user(
        id_user INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
        fullname TEXT NOT NULL
    )`,
		(err) => {
			if (err) {
				console.log('error to create table users:', err);
			}
		}
	);
}

function createTableMerchandise() {
	return new Promise((resolve, reject) => {
		db.run(
			`CREATE TABLE IF NOT EXISTS merchandise(
			id_merchandise INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
			name TEXT NOT NULL,
			date TEXT DEFAULT (datetime('now')),
			plate TEXT NOT NULL
		)`,
			(err) => {
				if (err) {
					reject('Error to create Table merchandise');
				} else {
					resolve('Table Merchandise is created');
				}
			}
		);
	});
}

function AddMerchandise(name, date, plate, itemsArray = [], callback) {
	db.run('BEGIN IMMEDIATE TRANSACTION');
	db.run(
		`INSERT INTO merchandise(name,date,plate) 
	VALUES (?,?,?)`,
		[name, date, plate],
		function (err) {
			if (err) {
				db.run('ROLLBACK');
				return callback(err);
			} else {
				let merchandiseId = this.lastID;
				let stmt = db.prepare(
					'INSERT INTO item(name,price,due_date,amount,id_merchandise) VALUES (?,?,?,?,?)'
				);
				for (let i = 0; i < itemsArray.length; i++) {
					stmt.run(
						[
							itemsArray[i].nombre,
							itemsArray[i].precio,
							itemsArray[i].cantidad,
							itemsArray[i].due_date,
							merchandiseId,
						],
						(err2) => {
							if (err2) {
								db.run('ROLLBACK');
								return callback(err2);
							}
						}
					);
				}
				stmt.finalize();
				db.run('COMMIT');
				callback(err);
			}
		}
	);
}

function createTableItem() {
	return new Promise((resolve, reject) => {
		db.run(
			`CREATE TABLE IF NOT EXISTS item(
			id_item INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
			name TEXT NOT NULL,
			price NUMERIC DEFAULT 0,
			due_date TEXT,
			amount INTEGER NOT NULL DEFAULT 0,
			id_merchandise INTEGER NOT NULL,
			FOREIGN KEY (id_merchandise)
				REFERENCES merchandise (id_merchandise)
		)`,
			(err) => {
				if (err) {
					reject('Error to create table item');
				} else {
					resolve('Table item is created');
				}
			}
		);
	});
}

function createTableUser() {
	return new Promise((resolve, reject) => {
		db.run(
			`CREATE TABLE IF NOT EXISTS user(
			id_user INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL
		)`,
			(err) => {
				if (err) {
					reject('Error to create table user');
				} else {
					resolve('Table user is created');
				}
			}
		);
	});
}

function createTableSale() {
	return new Promise((resolve, reject) => {
		db.run(
			`CREATE TABLE IF NOT EXISTS sale(
			id_sale INTEGER PRIMARY KEY AUTOINCREMENT,
			name TEXT NOT NULL,
			ci TEXT NOT NULL,
			date_sale TEXT NOT NULL,
			id_user INTEGER,
			FOREIGN KEY (id_user)
				REFERENCES user (id_user)
		)`,
			(err) => {
				if (err) {
					reject('Error to create Table sale');
				} else {
					resolve('Table sale is created');
				}
			}
		);
	});
}

function createTableItemSale() {
	return new Promise((resolve, reject) => {
		db.run(
			`CREATE TABLE IF NOT EXISTS item_sale(
			id_sale INTEGER NOT NULL,
			id_item INTEGER NOT NULL,
			amount_sale INTEGER NOT NULL,
			FOREIGN KEY (id_sale)
				REFERENCES sale (id_sale),
			FOREIGN KEY (id_item)
				REFERENCES item (id_item)
		)`,
			(err) => {
				if (err) {
					reject('Error to create Table Item_sale');
				} else {
					resolve('Table item_sale is created');
				}
			}
		);
	});
}

function CreateTables() {
	createTableUsers();
	createTableMerchandise()
		.then((result) => {
			console.log(result);
			return createTableItem();
		})
		.then((result) => {
			console.log(result);
			return createTableUser();
		})
		.then((result) => {
			console.log(result);
			return createTableSale();
		})
		.then((result) => {
			console.log(result);
			return createTableItemSale();
		})
		.then((result) => {
			console.log(result);
		})
		.catch((err) => {
			console.log(err);
		});
}

module.exports = {
	InitDB,
	getDB,
	AddMerchandise,
};
