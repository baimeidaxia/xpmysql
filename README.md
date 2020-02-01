## xpmysql
这是一个适用于NodeJs的MySQL操作类库

### 特点
1. 支持两种格式的SQL语句占位符
    ```
    两种占位符 : 和 ?, 其中?方式是mysql库自带的。
    
    ? 案例
        sql: `select * from ?? where id=?`
        values: ['user', 1]

    : 案例
        sql: `select * from ::table where id=:id` 
        values: {table:'user', id: 1}}
    ```
2. 支持字段映射
    ```
    由于mysql数据表的字段名可能是带下划线的风格，例如:user_id
    但实际情况可能是需要驼峰格式的，例如: userId
    本库在编写Repository实现类的时候，可以在构造函数中指定字段映射关系
    
    class UserRepository extends Repository {
        
        constructor() {
            // 第1个参数是：表名
            // 第2个参数是：主键名
            // 第3个参数是：字段映射
            super("user", "id", {"id": "_id", "name": "_name"});
        }
    }
    ```

3. 优雅的事务编写
    ```
    let conn = await userRepository.connection();
    await conn.beginTransaction();
    try {
        await conn.insert("insert into user(name) values('jiangyy2')");
        await conn.insert("insert into user(name) values('jiangyy2')");
        await conn.rollback();
    } catch (e) {
        await conn.rollback();
        throw e;
    } finally {
        await conn.release();
    }
    ```

### TODO
- 单元测试