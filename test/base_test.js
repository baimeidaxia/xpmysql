var { DB } = require("../index");

DB.init({
    host: '127.0.0.1',
    user: 'root',
    password: '123321',
    database: 'xpmysql',
    port: 3306,
    debug: false,
    dateStrings: true,
    connectionLimit: 2,
    waitForConnections: true
});