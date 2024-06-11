'use strict';

export default async function (fastify, opts) {
    //注册jwt插件
    fastify.register(import('@fastify/jwt'), {
        secret: {
            private: fastify.readConfigSync(fastify.config.JWT.TOKEN_PRIVATE_KEY),
            public: fastify.readConfigSync(fastify.config.JWT.TOKEN_PUBLIC_KEY)
        },
        sign: { algorithm: 'EdDSA' } // 指定使用 EdDSA 算法
    });
}