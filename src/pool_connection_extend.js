let PoolConnection = require('mysql/lib/PoolConnection');
let logger = require("./logger");

function convertResult(res, mappings) {
    if (res === undefined || mappings === undefined) {
        return res;
    }
    for (let i = 0; i < res.length; i++) {
        let item = res[i];
        let objKeys = Object.keys(item);
        let mappingKeys = Object.keys(mappings);
        for (let j = 0; j < objKeys.length; j++) {
            let sourceKey = objKeys[j];
            if (mappingKeys.includes(sourceKey)) {
                item[mappings[sourceKey]] = item[sourceKey];
                delete item[sourceKey];
            }
        }
    }
    return res;
}

PoolConnection.prototype.execute = function (sql, params, mappings) {
    return new Promise(resolve => {
        let query = this.query({
            sql: sql,
            values: params
        }, (error, results, fields) => {
            if (error) throw error;
            resolve(convertResult(results, mappings));
        });
        logger.debug("Thread %s - Print sql statement: %s", this.threadId, query.sql);
    })
};

PoolConnection.prototype.insert = function (sql, params) {
    return new Promise(resolve => {
        let query = this.query({
            sql: sql,
            values: params
        }, (error, results, fields) => {
            if (error) throw error;
            resolve(results.insertId);
        });
        logger.debug("Thread %s - Print sql statement: %s", this.threadId, query.sql);
    })
};

PoolConnection.prototype.update = function (sql, params) {
    return new Promise(resolve => {
        let query = this.query({
            sql: sql,
            values: params
        }, (error, results, fields) => {
            if (error) throw error;
            resolve(results.affectedRows);
        });
        logger.debug("Thread %s - Print sql statement: %s", this.threadId, query.sql);
    })
};

PoolConnection.prototype.delete = function (sql, params) {
    return new Promise(resolve => {
        let query = this.query({
            sql: sql,
            values: params
        }, (error, results, fields) => {
            if (error) throw error;
            resolve(results.affectedRows);
        });
        logger.debug("Thread %s - Print sql statement: %s", this.threadId, query.sql);
    })
};



