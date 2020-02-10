let db = require('./db');

class Repository {

    convertParams(res, mappings) {
        if (res === undefined || mappings === undefined) {
            return res;
        }
        const paramMappings = this.swapKeysValues(mappings);
        let item = res;
        let objKeys = Object.keys(item);
        let mappingKeys = Object.keys(paramMappings);
        for (let j = 0; j < objKeys.length; j++) {
            let sourceKey = objKeys[j];
            if (mappingKeys.includes(sourceKey)) {
                item[paramMappings[sourceKey]] = item[sourceKey];
                delete item[sourceKey];
            }
        }
        return res;
    }
    
    swapKeysValues(mappings) {
        let ret = {};
        for(const key in mappings){
            ret[mappings[key]] = key;
        }
        return ret;
    }

    constructor(tableName, primaryKey, mappings) {
        this.primaryKey = primaryKey;
        this.mappings = mappings;
        this._tableName = tableName;
    }

    async connection() {
        return await db.connection();
    }

    async selectOneById(id) {
        return await this.selectOne(`select * from ?? where ??=? limit 1`, [this.tableName, this.primaryKey, id]);
    }

    /**
     * 基础查询列表
     * @param params : object, 查询条件，只适合等于, 例如: {id:1, name:'123'}
     * @param order : string, 排序条件, 例如: id desc, name asc
     * @param paging : object, 分页条件, 例如: {page:1, size:10}
     */
    async selectListSimple({params, order, paging} = {}) {

        let sql = "select * from ::table";
        let values = {table: this.tableName};

        params = this.convertParams(params, this.mappings);

        if (params !== undefined) {
            sql += " where ";
            let fields = Object.keys(params);
            for (let i = 0; i < fields.length; i++) {
                let field = fields[i];
                sql += " ::field_" + field + "=:" + field + (i === fields.length - 1 ? "" : " and ");
                values["field_" + field] = field;
                values[field] = params[field];
            }
        }

        if (order !== undefined && order !== '') {
            sql += " order by :order ";
            values["order"] = order;
        }

        if (paging !== undefined) {
            sql += " limit :start,:limit ";
            values["start"] = (paging.page - 1) * paging.size;
            values["limit"] = paging.size;
        }

        return await this.selectList(sql, values);
    }

    /**
     * 查询一条记录
     * @param sql SQL语句
     * @param params SQL参数
     */
    async selectOne(sql, params) {
        let conn = await db.connection();
        try {
            let rows = await conn.execute(sql, params, this.mappings);
            return rows.length === 0 ? null : rows[0];
        } catch (e) {
            throw e;
        } finally {
            conn.release();
        }
    }

    /**
     * 查询多条记录
     * @param sql SQL语句
     * @param params SQL参数
     */
    async selectList(sql, params) {
        let conn = await db.connection();
        try {
            return await conn.execute(sql, params, this.mappings);
        } catch (e) {
            throw e;
        } finally {
            conn.release();
        }
    }

    async createItem(params) {
        params = this.convertParams(params, this.mappings);
        const query = `INSERT INTO ?? SET ?;`;
        return await this.insert(query, [this.tableName, params]);
    }

    async updateItem(params) {
        params = this.convertParams(params, this.mappings);
        const id = params[this.primaryKey];
        const query = `UPDATE ?? SET ? WHERE ?? = ?;`;
        return await this.update(query, [this.tableName, params, this.primaryKey, id]);
    }

    async deleteByID(id) {
        const query = `DELETE FROM ?? WHERE ?? = ?;`;
        return await this.delete(query, [this.tableName, this.primaryKey, id]);
    }

    /**
     * 插入记录，不支持事务
     * @param sql SQL语句
     * @param params SQL参数
     * @returns 主键ID
     */
    async insert(sql, params) {
        let conn = await db.connection();
        try {
            return await conn.insert(sql, params);
        } catch (e) {
            throw e;
        } finally {
            conn.release();
        }
    }

    /**
     * 更新记录，不支持事务
     * @param sql SQL语句
     * @param params SQL参数
     * @returns 受影响行数
     */
    async update(sql, params) {
        let conn = await db.connection();
        try {
            return await conn.update(sql, params);
        } catch (e) {
            throw e;
        } finally {
            conn.release();
        }
    }

    /**
     * 删除记录，不支持事务
     * @param sql SQL语句
     * @param params SQL参数
     * @returns 受影响行数
     */
    async delete(sql, params) {
        let conn = await db.connection();
        try {
            return await conn.delete(sql, params);
        } catch (e) {
            throw e;
        } finally {
            conn.release();
        }
    }

    get tableName() {
        return this._tableName;
    }

}

module.exports = Repository;