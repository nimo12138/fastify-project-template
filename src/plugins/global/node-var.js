'use strict';

import url from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import fp from 'fastify-plugin';

//将node中的一些方法和对象注册到全局方便调用，如果不需要也可以取消
export default fp(async function (fastify, opts) {

    fastify.decorate('fs', fs);

    fastify.decorate('__filename', function (metaUrl) {
        return url.fileURLToPath(metaUrl);
    });

    fastify.decorate('__dirname', function (metaUrl) {
        return path.dirname(url.fileURLToPath(metaUrl));
    });

    fastify.decorate('join', function (...paths) {
        return path.join(...paths);
    });

});