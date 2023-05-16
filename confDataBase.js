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

function createTableItem() {
	return new Promise((resolve, reject) => {
		db.run(
			`CREATE TABLE IF NOT EXISTS item(
			id_item INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
			name TEXT NOT NULL,
			price NUMERIC DEFAULT 0,
			due_date TEXT,
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

function CreateTables() {
	createTableUsers();
	createTableMerchandise()
		.then((result) => {
			console.log(result);
			return createTableItem();
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
};
