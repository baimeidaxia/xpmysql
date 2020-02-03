## xpmysql
这是一个适用于NodeJs的MySQL操作类库

### 特点

#### 支持两种格式的SQL语句占位符
```
两种占位符 : 和 ?, 其中?方式是mysql库自带的。

? 案例
    sql: `select * from ?? where id=?`
    values: ['user', 1]

: 案例
    sql: `select * from ::table where id=:id` 
    values: {table:'user', id: 1}}
```

#### 支持字段映射

```javascript

// 由于mysql数据表的字段名可能是带下划线的风格，例如:user_id
// 但实际情况可能是需要驼峰格式的，例如: userId
// 本库在编写Repository实现类的时候，可以在构造函数中指定字段映射关系

class UserRepository extends Repository {
    
    constructor() {
        // 第1个参数是：表名
        // 第2个参数是：主键名
        // 第3个参数是：字段映射
        super("user", "id", {"id": "_id", "name": "_name"});
    }
}
```

### 使用案例

#### 根据主键ID, 查询一条记录
```javascript
async function selectOneById() {
    let res = await repository.selectOneById(1);
    assert.ok(res != undefined, "获取一条记录失败");
}

```

#### 查询一条记录
```javascript
async function selectOne() {
    let res = await repository.selectOne("select * from user where id=:id", {id: 1});
    assert.ok(res != undefined, "获取一条记录失败");
}
```

#### 查询列表
```javascript
async function selectList() {
    let res = await repository.selectList("select * from user where name=:name", {name: "jiangyy"});
    console.log(res);
    assert.ok(res.length !== 0, "获取列表失败");

    let res2 = await repository.selectList("select * from user where name=:name limit :start,:limit", {
        name: "jiangyy",
        start: 0,
        limit: 1
    });
    console.log(res2)
    assert.ok(res2.length !== 0, "获取分页列表失败");
}
```

#### 插入
```javascript
async function insert() {
    let id = await repository.insert("insert into user(name, age) values(:name,:age)", {
        name: "张三",
        age: 30
    });
    console.log("Got insert id: " + id);
    assert.ok(id > 0, "插入测试失败");
}
```

#### 修改
```javascript
async function update() {
    let affectedRows = await repository.update("update user set age=:age where name=:name", {
        name: "张三",
        age: 40
    });
    console.log("Got update affected rows: " + affectedRows);
    assert.ok(affectedRows > 0, "更新测试失败");
}
```

#### 删除
```javascript
async function remove() {
    let affectedRows = await repository.delete("delete from user where name=:name", {
        name: "张三"
    });
    console.log("Got delete affected rows: " + affectedRows);
    assert.ok(affectedRows > 0, "删除测试失败");
}
```

#### 事务处理
```javascript
async function transaction() {
    let conn = await DB.connection();
    await conn.beginTransaction();
    try {
        await conn.insert("insert into user(name,age) values(:name,:age)", {name: '张三', age: 10});
        // 下面这条语句会发生异常，事务会回滚
        await conn.insert("insert into user(name2,age) values(:name,:age)", {name: '李四', age: 10});
        await conn.commit();
    } catch (e) {
        await conn.rollback();
        throw e;
    } finally {
        await conn.release();
    }
}
```