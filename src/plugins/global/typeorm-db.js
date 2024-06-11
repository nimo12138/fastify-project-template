'use strict';

import plugin from 'typeorm-fastify-plugin';

//注册typeorm插件
export default async function (fastify, opts) {
    //遍历注册所有数据源
    fastify.config.dbConfig.forEach(dataSource => {
        fastify.register(plugin, {
            // namespace: dataSource.namespace, //配置多个数据源时需要此项
            host: dataSource.host,
            port: dataSource.port,
            username: dataSource.username,
            password: dataSource.password,
            database: dataSource.database,
            type: dataSource.type,
            entities: dataSource.entities,
            schema: dataSource.schema,
            synchronize: dataSource.synchronize,
            logging: dataSource.logging
        });
    });

}