'use strict';

export default {
    //应用监听端口号
    PORT: 3000,
    //应用监听地址
    HOST: "0.0.0.0",
    //token密钥私钥
    JWT: {
        TOKEN_PRIVATE_KEY: "src/config/cert/jwt/private.pem",
        TOKEN_PUBLIC_KEY: "src/config/cert/jwt/public.pem"
    }
    //
}