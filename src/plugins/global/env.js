'use strict';

export default async function (fastify, opts) {
    //对配置文件中的字段进行类型的验证
    const schema = {
        type: 'object',
        required: ['PORT', 'HOST', 'TOKEN_PRIVATE_KEY', 'TOKEN_PUBLIC_KEY'],
        properties: {
            PORT: {
                type: 'number'
            },
            HOST: {
                type: 'string'
            },
            TOKEN_PRIVATE_KEY: {
                type: 'string'
            },
            TOKEN_PUBLIC_KEY: {
                type: 'string'
            }
        }
    };
    //注册配置文件
    fastify.register(import('@fastify/env'), {
        confKey: 'config', // 可选，挂载的全局配置属性
        schema: schema,
        // data: data // optional, default: process.env
        dotenv: {
            path: `${fastify.join(fastify.__dirname(import.meta.url),
                '../../config/.env')}`
        }
    });
}