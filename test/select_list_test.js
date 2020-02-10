require("./base_test");
const repository = require("./repositories/UserRepository");
const assert = require('assert');

async function selectList() {
    let res = await repository.selectList("select * from user where name=:name", {name: "jiangyy"});
    console.log(JSON.stringify(res));
    assert.ok(res.length !== 0, "获取列表失败");

    let res2 = await repository.selectList("select * from user where name=:name limit :start,:limit", {
        name: "jiangyy",
        start: 0,
        limit: 1
    });
    console.log(JSON.stringify(res2));
    assert.ok(res2.length !== 0, "获取分页列表失败");
}

selectList();