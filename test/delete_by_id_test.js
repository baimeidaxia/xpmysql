require("./base_test");
var userRepository = require("./repositories/UserRepository");
var assert = require('assert');

async function remove() {
    let affectedRows = await userRepository.deleteByID(15);
    console.log("Got delete affected rows: " + affectedRows);
    assert.ok(affectedRows > 0, "删除测试失败");
}

remove();