require("./base_test");
var userRepository = require("./repositories/UserRepository");
var assert = require('assert');

async function update_item() {
    let affectedRows = await userRepository.updateItem({name: "lisi1", id: 15, age: 33});
    console.log("Got update affected rows: " + affectedRows);
    assert.ok(affectedRows > 0, "更新测试失败");
}

update_item();