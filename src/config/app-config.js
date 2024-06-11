'use strict';

export default {
    //应用监听端口号
    PORT: 3000,
    //应用监听地址
    HOST: "0.0.0.0",
    //token密钥私钥
    JWT: {
        TOKEN_PRIVATE_KEY: "src/config/cert/jwt/private.pem",
        TOKEN_PUBLIC_KEY: "src/config/cert/jwt/public.pem"
    },
    //typeorm数据库连接配置
    dbConfig: [
        {
            // namespace: "postgres1", //配置多个数据源时需要此项
            host: "localhost", //数据库地址
            port: 5432, //端口
            username: "postgres", //用户名
            password: "postgres", //密码
            database: "fastifytest", //数据库名
            type: "postgres", //数据库类型
            entities: ['src/entities/**/*.js'], // 实体类的路径，从项目根路径读取
            schema: 'public', // 默认是 public 模式，如果有其他模式，可以指定
            synchronize: false, // 避免重新创建已存在的表，开发阶段可以配置为true用于同步表结构
            logging: false, // 启用日志以便调试
            //还可配置最大连接数和超时关闭时间，无特殊需求使用默认配置就行
        }
    ]
}