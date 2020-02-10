let mysql = require('mysql');
let logger = require("./logger");
require("./pool_connection_extend");

class DB {

    constructor() {
        this.pool = null;
        this.logLevel = null;
    }

    /**
     *  初始化
     * @param dbConnectionConfig : object , { host: '127.0.0.1', user: 'root', password: '123321', database: 'xpmysql', port: 3306, debug: false, dateStrings: true, connectionLimit: 2, waitForConnections: true }
     * @param logLevel : string , 日志级别
     */
    init({dbConnectionConfig, logLevel}) {
        if (logLevel !== undefined) {
            logger.level = logLevel;
        }
        logger.debug("dbConnectionConfig = %s, logLevel = %s", JSON.stringify(dbConnectionConfig), logLevel)

        this.pool = mysql.createPool(dbConnectionConfig);
        // 从池中获取连接时，池将发出获取事件。在对连接执行了所有获取活动之后，即在将连接交给获取代码的回调之前，调用此函数。
        this.pool.on("acquire", connection => {
            logger.debug('Thread %s - connection acquired', connection.threadId);
        });
        // 当在池中建立新连接时，池将发出连接事件。如果在使用连接之前需要在连接上设置会话变量，则可以侦听连接事件。
        this.pool.on("connection", connection => {
            logger.debug('Thread %s - connection', connection.threadId);
        })
        // 释放链接调用
        this.pool.on("release", connection => {
            logger.debug('Thread %s - connection released', connection.threadId);
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

