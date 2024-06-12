'use strict';

export default async function (fastify, opts) {

    //测试修改服务器运行状态
    fastify.get('/appStatusChange', async function (request, reply) {

        fastify.app.status = !fastify.app.status;
        fastify.app.statusMsg = fastify.app.status ? '运行中' : '维护中';
        request.log.info(`${request.id}-服务状态已修改：${fastify.app.statusMsg}`);
        reply.send({ msg: `服务状态已修改：${fastify.app.statusMsg}` });

    });
}