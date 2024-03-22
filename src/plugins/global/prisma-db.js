'use strict';

import fastifyPrisma from '@joggr/fastify-prisma';

//注册prisma插件
export default async function (fastify, opts) {
    await fastify.register(fastifyPrisma, {
        clientConfig: {
            log: [{ emit: 'event', level: 'query' }]
        }
    });
}