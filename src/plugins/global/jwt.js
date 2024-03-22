'use strict';

export default async function (fastify, opts) {
    //注册jwt插件
    fastify.register(import('@fastify/jwt'), {
        secret: {
            private: fastify.fs.readFileSync(fastify.join(
                fastify.__dirname(import.meta.url),
                `../../${fastify.config.TOKEN_PRIVATE_KEY}`)),
            public: fastify.fs.readFileSync(fastify.join(
                fastify.__dirname(import.meta.url),
                `../../${fastify.config.TOKEN_PUBLIC_KEY}`))
        },
        sign: { algorithm: 'EdDSA' } // 指定使用 EdDSA 算法
    });
}