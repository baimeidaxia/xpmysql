require("./base_test");
var userRepository = require("./repositories/UserRepository");
var assert = require('assert');

async function update() {
    let affectedRows = await userRepository.update("update user set age=:age where name=:name", {
        name: "张三",
        age: 40
    });
    console.log("Got update affected rows: " + affectedRows);
    assert.ok(affectedRows > 0, "更新测试失败");
}

update();