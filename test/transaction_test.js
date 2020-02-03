require("./base_test");
const {DB} = require("../index");
const assert = require('assert');

async function transaction() {
    let conn = await DB.connection();
    await conn.beginTransaction();
    try {
        await conn.insert("insert into user(name,age) values(:name,:age)", {name: '张三', age: 10});
        // 下面这条语句会发生异常，事务会回滚
        await conn.insert("insert into user(name2,age) values(:name,:age)", {name: '李四', age: 10});
        await conn.commit();
    } catch (e) {
        await conn.rollback();
        throw e;
    } finally {
        await conn.release();
    }
}

transaction();