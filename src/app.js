'use strict';

import Fastify from 'fastify';
import autoLoad from '@fastify/autoload'

//实例化fasitfy并设置参数，以下是格式化日志输出，通过pino-pretty美化日志
const fastify = await Fastify({
    logger: {
        transport: {
            target: 'pino-pretty',
            options: {
                // destination: './log.txt', //自定义日志输出文件位置
                colorize: true, // 颜色化日志输出
                singleLine: true, //单行输出
                levelFirst: true, // 日志级别放在前面
                translateTime: 'SYS:standard', // 将时间戳转换为易读的格式
                // ignore: 'pid,hostname' // 忽略特定的日志属性
            }
        }
    }
});

//注册优先挂载到fastify全局的node变量，和全局配置文件，为了让后续所有注册的全局插件可以使用全局变量和配置，需要优先注册
await fastify.register(import('./plugins/core/app-var.js'));

//使用@fastify/autoload插件优化插件和路由注册，简化了繁琐的注册流程
//注册全局可访问的插件
await fastify.register(autoLoad, {
    dir: fastify.join(fastify.__dirname(import.meta.url), 'plugins/global'),
    // ignorePattern: , //忽略指定插件，支持正则
    forceESM: true, //强制使用esm方式导入
    encapsulate: false //默认使用fp包装，打破封装性，令全局可访问，和node-var.js中使用fp效果相同
});

//注册中间件
await fastify.register(autoLoad, {
    dir: fastify.join(fastify.__dirname(import.meta.url), 'middlewares'),
    ignorePattern: 'modules/*', //忽略中间件中的非插件模块，支持正则
    forceESM: true,
    encapsulate: false //默认使用fp包装，打破封装性，令全局可访问，和node-var.js中使用fp效果相同
});

//注册所有客户端路由文件
await fastify.register(autoLoad, {
    dir: fastify.join(fastify.__dirname(import.meta.url), 'routes'),
    forceESM: true,
    options: {
        // prefix: '/api' //给每个路由设置统一前缀，更多配置详见@fastify/autoload
    }
});

//启动服务
const server = async () => {
    try {
        //通过配置文件设置的端口号和监听地址
        await fastify.listen({ port: fastify.config.PORT, host: fastify.config.HOST });
        //加载启动banner
        fastify.log.info(fastify.readConfigSync(fastify.config.Banner, 'utf-8'));
        fastify.log.info(`服务已启动，正在监听地址：${JSON.stringify(fastify.addresses())}`);
    } catch (error) {
        fastify.log.error(error);
        process.exit(1);
    }
};

server();