require("./base_test");
const repository = require("./repositories/UserRepository");
const assert = require('assert');

async function selectListSimple() {
    let res = await repository.selectListSimple({params: {name: "jiangyy"}, order: "id desc"});
    console.log(res);
    assert.ok(res.length !== 0, "获取列表失败");
}

selectListSimple();