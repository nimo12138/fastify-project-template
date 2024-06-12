'use strict';

//引入模式文件对返回信息进行验证，如果不需要可以删除
import test from '../../../schema/routes/test.js';

export default async function (fastify, opts) {

    fastify.get('/find', test.index, async function (request, reply) {
        request.log.info(`${request.id}-type测试路由执行...`);
        const startTime = new Date().getTime();
        // request.log.info(`${request.id}-开始执行查询...`);
        const result = await fastify.orm.getRepository('Test').findOne({
            where: {
                email: '49516238@qq.com'
            } // 查询条件
        });
        const endTime = new Date().getTime();
        request.log.info(`${request.id}-type查询结束，耗时${endTime - startTime}ms`);
        // request.log.info(`${request.id}-查询结果：${JSON.stringify(result)}`);
        //生成token
        const token = fastify.jwt.sign({ userId: result.id, email: result.email, value: result.email }, { expiresIn: '1h' });
        //当只返回简单的字符串和json对象时，可以使用return简化
        // return { result: result, token: token };
        //若需设置状态码，返回头等信息，或需流式返回，则需使用reply
        reply.send({ result: result, token: token });
    });

    fastify.get('/test', async function (request, reply) {
        function findSumIndicesInArray(arr, target) {
            let filteredObject = {};
            let result = [];
            // 过滤数组，创建一个对象，键是元素值，值是元素下标
            arr.forEach((element, index) => {
                if (element <= target) {
                    filteredObject[element] = index;
                }
            });
            // 获取对象的键数组
            let keys = Object.keys(filteredObject);
            // 遍历键数组，寻找和等于目标值的键对
            for (let i = 0; i < keys.length; i++) {
                for (let j = i + 1; j < keys.length; j++) {
                    if (parseInt(keys[i]) + parseInt(keys[j]) === target) {
                        // 如果找到和等于目标值的两个键，将它们对应的值（元素下标）添加到结果数组
                        result.push(filteredObject[keys[i]]);
                        result.push(filteredObject[keys[j]]);
                        return result;
                    }
                }
            }
        }
        // 示例使用
        const array = [3,2,4];
        const number = 6;
        const indices = findSumIndicesInArray(array, number);
        request.log.info(indices); // 输出：[0, 2]，因为array[0] + array[2] = 60  
        reply.send(indices);
    });
}