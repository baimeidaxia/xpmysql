require("./base_test");
var userRepository = require("./repositories/UserRepository");
var assert = require('assert');

async function remove() {
    let affectedRows = await userRepository.delete("delete from user where name=:name", {
        name: "张三"
    });
    console.log("Got delete affected rows: " + affectedRows);
    assert.ok(affectedRows > 0, "删除测试失败");
}

remove();