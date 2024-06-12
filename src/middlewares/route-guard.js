'use strict';

import { getStrategy } from '../utils/guard-strategies.js';

export default async function (fastify, opt) {

    //请求前钩子，拦截请求用户验证等操作，详见fastify生命周期
    fastify.addHook('onRequest', async (request, reply) => {
        request.log.info(`${request.id}-请求钩子执行...`);
        // request.log.info(`请求参数：${request}`);
        //获取请求链接
        const url = request.raw.url;
        const guardMsg = {
            accessGranted: true,
            statusCode: 200,
            message: 'success'
        }
        //检查服务器运行状态  当前示例为全局变量，可修改为从数据库中查值修改
        //服务器停机并不是真的关停服务，主要是让客户端停止访问，用于升级维护等，所以开放管理端的访问权限
        //如果此处把管理端接口也拦截，那么将无法修改服务器启停状态
        if (!fastify.app.status && !url.includes('/admin/sys')) {
            guardMsg.accessGranted = false;
            guardMsg.statusCode = 503
            guardMsg.message = fastify.app.statusMsg;
        } else {
            //执行拦截逻辑
            const strategy = getStrategy(url);
            strategy == null ? '' : await strategy(request, guardMsg);
        }
        if (!guardMsg.accessGranted) {
            // 拦截请求并返回适当的响应
            reply.code(guardMsg.statusCode).send({ errMsg: guardMsg.message });
        }
        //计算每个路由使用时间
        request.startTime = new Date().getTime();
    });

    // 响应后的钩子，可用于统计时间，日志等，此钩子中无法向客户端返回消息
    fastify.addHook('onResponse', async (request, reply) => {
        request.log.info(reply.statusCode);
        if (reply.statusCode == 200) {
            const endTime = new Date().getTime();
            const duration = endTime - request.startTime;
            request.log.info(`${request.id}-请求路由执行结束，总耗时${duration}ms`);
        }
    });

};
