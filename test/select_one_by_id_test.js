require("./base_test");
const repository = require("./repositories/UserRepository");
const assert = require('assert');

async function selectOneById() {
    let res = await repository.selectOneById(1);
    assert.ok(res != undefined, "获取一条记录失败");
}

selectOneById();