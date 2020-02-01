let { Repository } = require('../../index');

class UserRepository extends Repository {

    constructor() {
        // 第1个参数是：表名
        // 第2个参数是：主键名
        // 第3个参数是：字段映射
        super("user", "id", { "id": "_id", "name": "_name" });
    }

}

module.exports = new UserRepository();