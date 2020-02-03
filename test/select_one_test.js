require("./base_test");
const repository = require("./repositories/UserRepository");
const assert = require('assert');

async function selectOne() {
    let res = await repository.selectOne("select * from user where id=:id", {id: 1});
    assert.ok(res != undefined, "获取一条记录失败");
}

selectOne();