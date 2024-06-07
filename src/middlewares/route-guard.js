'use strict';

export default async function (request) {
    //检查路由的访问权限
    const url = request.raw.url;

    // 公共资源，无需验证
    if (url.includes('/pub')) {
        request.log.info(`${request.id} - 公共资源，无需检查`);
        return { accessGranted: true, statusCode: 200, message: 'success' };
    }

    // 系统资源，需要权限验证
    if (url.includes('/sys')) {
        //todo
    }

    // 需要登录的资源
    if (url.includes('/auth')) {
        try {
            const decoded = await request.jwtVerify();
            request.log.info(`${request.id} - token验证通过: ${JSON.stringify(decoded)}`);
            return { accessGranted: true };
        } catch (err) {
            request.log.error(`${request.id} - token验证失败: ${err.message}`);
            return { accessGranted: false, statusCode: 401, message: err.message };
        }
    }

    // 默认允许访问
    return { accessGranted: true };
};
