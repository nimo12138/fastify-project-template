const strategies = {
    pubGuard: async (request, guardMsg) => {
        request.log.info(`${request.id} - 公共资源，无需检查`);
    },
    authGuard: async (request, guardMsg) => {
        try {
            const decoded = await request.jwtVerify();
            request.log.info(`${request.id} - token验证通过: ${JSON.stringify(decoded)}`);
        } catch (err) {
            request.log.error(`${request.id} - token验证失败: ${err.message}`);
            guardMsg.accessGranted = false;
            guardMsg.statusCode = err.statusCode;
            guardMsg.message = err.message;
        }
    },
    sysGuard: async (request, guardMsg) => {
        //todo
    },
    // 其他策略可以继续添加...
};

//策略映射
const strategyMapping = {
    '/pub': strategies.pubGuard,
    '/auth': strategies.authGuard,
    '/sys': strategies.sysGuard,
};

//匹配策略
const getStrategy = (url) => {
    for (const key in strategyMapping) {
        if (url.includes(key)) {
            return strategyMapping[key];
        }
    }
    // 如果没有匹配到任何策略，返回 null
    return null;
};

export { getStrategy };
