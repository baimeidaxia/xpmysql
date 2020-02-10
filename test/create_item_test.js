require("./base_test");
var userRepository = require("./repositories/UserRepository");
var assert = require('assert');

async function create_item() {
    let id = await userRepository.createItem({name: "lisi", age: 30});
    console.log("Got insert id: " + id);
    assert.ok(id > 0, "插入测试失败");
}

create_item();