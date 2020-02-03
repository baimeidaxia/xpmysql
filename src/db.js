let mysql = require('mysql');
require("./pool_connection_extend");

class DB {

    constructor() {
        this._dbConnectConfig = null;
        this.pool = null;
    }

    init(dbConnectionConfig) {
        this.pool = mysql.createPool(dbConnectionConfig);
        // 从池中获取连接时，池将发出获取事件。在对连接执行了所有获取活动之后，即在将连接交给获取代码的回调之前，调用此函数。
        this.pool.on("acquire", connection => {
            console.log('Connection %d acquired', connection.threadId);
        });
        // 当在池中建立新连接时，池将发出连接事件。如果在使用连接之前需要在连接上设置会话变量，则可以侦听连接事件。
        this.pool.on("connection", connection => {
            console.log('Connection %d connection', connection.threadId);
        })
        // 当回调排队等待可用连接时，池将发出排队事件。
        this.pool.on("enqueue", err => {
            console.log('Waiting for available connection slot');
        })
        this.pool.on("release", connection => {
            console.log('Connection %d released', connection.threadId);
        })
    }

    connection() {
        return new Promise(resolve => {
            this.pool.getConnection((err, connection) => {
                if (err) throw err;
                connection.config.queryFormat = (query, values) => {
                    if (!values) return query;
                    let pattern = /\:(\w+)/g;
                    if (query.match(pattern)) {
                        return query.replace(/\::(\w+)/g, function (txt, key) {
                            if (values.hasOwnProperty(key)) {
                                return mysql.escapeId(values[key]);
                            }
                            return txt;
                        }).replace(/\:(\w+)/g, function (txt, key) {
                            if (values.hasOwnProperty(key)) {
                                return mysql.escape(values[key]);
                            }
                            return txt;
                        });
                    } else {
                        return mysql.format(query, values);
                    }
                }
                resolve(connection);
            });
        })
    }

}

module.exports = new DB();
