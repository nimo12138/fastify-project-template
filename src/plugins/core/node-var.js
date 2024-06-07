'use strict';

import url from 'node:url';
import path from 'node:path';
import fs from 'node:fs';
import config from '../../config/app-config.js';
import fp from 'fastify-plugin';

//将node中的一些方法和对象注册到全局方便调用，如果不需要也可以取消
export default fp(async function (fastify, opts) {

    fastify.decorate('fs', fs);

    fastify.decorate('process', process);

    fastify.decorate('__filename', function (metaUrl) {
        return url.fileURLToPath(metaUrl);
    });

    fastify.decorate('__dirname', function (metaUrl) {
        return path.dirname(url.fileURLToPath(metaUrl));
    });

    fastify.decorate('join', function (...paths) {
        return path.join(...paths);
    });

    //封装读取配置文件路径方法
    fastify.decorate('readConfigSync', function (configPath) {
        return fs.readFileSync(path.join(process.cwd(), configPath));
    });

    //将app-config.json全局配置挂载
    fastify.decorate('config', config);

});