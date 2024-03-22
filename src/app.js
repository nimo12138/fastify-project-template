'use strict';

import Fastify from 'fastify';
import autoLoad from '@fastify/autoload'

//设置fastify参数，以下是格式化日志输出，通过pino-pretty美化日志
const fastify = await Fastify({
    logger: {
        transport: {
            target: 'pino-pretty',
            options: {
                colorize: true, // 颜色化日志输出
                singleLine: true,//单行输出
                levelFirst: true, // 日志级别放在前面
                translateTime: 'SYS:standard', // 将时间戳转换为易读的格式
                // ignore: 'pid,hostname' // 忽略特定的日志属性
            }
        }
    }
});

//注册优先挂载到fastify全局的node变量，为了让后续所有注册的全局插件可以使用全局变量，需要优先注册
await fastify.register(import('./plugins/global/node-var.js'));

//使用@fastify/autoload插件优化插件和路由注册，简化了繁琐的注册流程
//注册全局可访问的插件
await fastify.register(autoLoad, {
    dir: fastify.join(fastify.__dirname(import.meta.url), 'plugins/global'),
    ignorePattern: /node-var\.js$/, //忽略全局变量文件，已经优先注册过
    forceESM: true, //强制使用esm方式导入
    encapsulate: false //默认使用fp包装，打破封装性，令全局可访问，和node-var.js中使用fp效果相同
});

//注册所有路由文件
await fastify.register(autoLoad, {
    dir: fastify.join(fastify.__dirname(import.meta.url), 'routes'),
    forceESM: true,
    options: {
        prefix: '/api' //给每个路由设置统一前缀，更多配置详见@fastify/autoload
    }
});

//添加请求前钩子，拦截请求用户验证等操作，详见fastify生命周期
await fastify.addHook('onRequest', async (request, reply) => {
    //由于fastify日志是异步的，如果这里使用fastify.log.info，那么输出信息会在路由执行后才能看见
    console.log('请求钩子执行...');
    try {
        //使用挂载的jwt插件进行验证，fastify.jwt.verify(request.headers.authorization)同效
        //不过要注意去除authorization之前的'Bearer '字段
        const res = await request.jwtVerify();
        console.log('token验证结果：', res);
    } catch (error) {
        console.log(error.message);
        //验证失败时，为了阻止后续路由执行，需要使用reply方法，且code中不能是成功代码，比如200等
        //这里的error.statusCode值是401，如果为200，还是会继续执行后续路由，所以可以写死为401
        reply.code(error.statusCode).send({
            errMsg: '未经授权，无法访问，请登录'
        });
    }
});

//启动服务
const server = async () => {
    try {
        //通过配置文件设置的端口号和监听地址
        await fastify.listen({ port: fastify.config.PORT, host: fastify.config.HOST });
        console.log('服务已启动，正在监听地址：', fastify.addresses());
    } catch (error) {
        fastify.log.error(error);
        process.exit(1);
    }
};

server();