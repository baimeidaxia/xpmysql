require("./base_test");
var userRepository = require("./repositories/UserRepository");
var assert = require('assert');

async function insert() {
    let id = await userRepository.insert("insert into user(name, age) values(:name,:age)", {
        name: "张三",
        age: 30
    });
    console.log("Got insert id: " + id);
    assert.ok(id > 0, "插入测试失败");
}

insert();