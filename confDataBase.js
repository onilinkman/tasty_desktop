const fs = require("fs");

const DB_NAME = "database.db";

const sqlite3 = require("sqlite3");
var db;

function InitDB() {
	if (existDB) {
		ConnectDB();
	} else {
		createDB();
		ConnectDB();
	}

	createTableUsers();
}

function createDB() {
	db = new sqlite3.Database(DB_NAME, (err) => {
		if (err) {
			console.error(err.message);
		}
		console.log("Base de datos creada");
	});
}

function ConnectDB() {
	db = new sqlite3.Database(DB_NAME, (err) => {
		if (err) {
			console.error("error al conectar", err.message);
		}
	});
	console.log("conectado a la base de datos");
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
				console.log("error to create table users:", err);
			}
		}
	);
}

module.exports = {
	InitDB,
	getDB,
};
