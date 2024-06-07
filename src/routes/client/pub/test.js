'use strict';

//引入模式文件对返回信息进行验证，如果不需要可以删除
import test from '../../../schema/routes/test.js';

export default async function (fastify, opts) {
    fastify.get('/test', test.index, async function (request, reply) {
        request.log.info(`${request.id}-测试路由执行...`);
        const startTime = new Date().getTime();
        // request.log.info(`${request.id}-开始执行查询...`);
        const result = await fastify.prisma.test.findUnique({
            where: {
                email: '49516258@qq.com'
            }
        });
        const endTime = new Date().getTime();
        request.log.info(`${request.id}-查询结束，耗时${endTime - startTime}ms`);
        // request.log.info(`${request.id}-查询结果：${JSON.stringify(result)}`);
        //生成token
        const token = fastify.jwt.sign({ userId: result.id, email: result.email, value: result.email }, { expiresIn: '1h' });
        //当只返回简单的字符串和json对象时，可以使用return简化
        // return { result: result, token: token };
        //若需设置状态码，返回头等信息，或需流式返回，则需使用reply
        reply.send({ result: result, token: token });
    });
}