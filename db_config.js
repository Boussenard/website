const mysql = require('mysql');

const db = mysql.createConnection({
    host: 'localhost', // Адрес сервера базы данных
    user: 'root',      // Имя пользователя
    password: '',      // Пароль (если есть)
    database: 'powerlift_gear' // Имя базы данных
});

db.connect((err) => {
    if (err) throw err;
    console.log('Connected to the database!');
});

module.exports = db;
