'use strict';

//引入模式文件对返回信息进行验证，如果不需要可以删除
import test from '../schema/routes/test.js';

export default async function (fastify, opts) {
    fastify.get('/', test.index, async function (request, reply) {
        console.log("测试路由执行...");
        const startTime = new Date().getTime();
        console.log("开始执行查询...");
        const result = await fastify.prisma.test.findUnique({
            where: {
                email: '49516258@qq.com'
            }
        });
        const endTime = new Date().getTime();
        console.log(`查找结束，耗时${endTime - startTime}ms`);
        console.log("查找结束", result);
        //生成token
        const token = fastify.jwt.sign({ userId: result.id, email: result.email, value: result.email });
        return { result: result, token: token };
    });
}