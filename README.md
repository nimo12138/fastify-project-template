<<<<<<< HEAD
# fastify-project-template
一个fastify项目的示例模板，方便开发者快速上手和参考。
=======
# fastify模板示例说明
- fastify是一个nodejs的web框架，其性能是目前nodejs框架中最好的，并且极其轻量，在不牺牲性能的情况下极大简化开发流程，提高了开发效率；fastify中一切皆插件，就像java中一切皆对象一样，所有功能都可以依靠引入或者编写插件来完成；社区拥有200+插件包，以及任意npm均可使用，大量轮子。
- 本示例模板旨在搭建一个使用fastify快速开发的基本项目结构，方便开发者快速上手和参考。
- 技术结构：`js + fastify(4.6.x) + prisma + postgresql`，可以根据情况更换为 `ts` 和`其他数据库`以及`orm框架`

## 项目结构说明
- 项目根目录
- ├── node_modules 项目依赖
- ├── prisma 数据库模型文件存放目录
  - ├── schema.prisma 数据模型文件
- ├── src 项目源码目录
  - ├── config 项目配置目录
    - ├── cert 存放各种证书文件，示例项目存放的为生成token的公钥私钥
    - ├── .env 项目全局配置文件，通过 `fastify.config.配置名` 全局访问，默认配置了端口号和监听地址等
  - ├── plugins 插件目录，fastify中一切皆插件，这里存放项目中所有自己编写的插件
    - ├── global 全局插件目录，这里存放的是注册到项目全局可访问的插件，例如工具类插件
      - ├── env.js 全局配置插件，通过注册`@fastify/env`插件，可以全局访问`src/config/.env`中的配置
      - ├── jwt.js 示例jwt插件，通过注册`@fastify/jwt`插件，实现token鉴权
      - ├── node-var.js 挂载全局方法和变量的插件，为了偷懒，将node中的某些方法和变量挂载了上去，通过fastify就可以直接全局访问，如果不需要，每个文件单独导入node模块是一样的
      - ├── prisma-db.js 注册prisma的插件，让所有路由可以操作数据库
    - ├── local 局部插件目录，这里存放的是无需全局访问的插件，例如某个路由中才会用到的插件，只需在用到的时候单独注册即可
  - ├── routes 路由目录，存放所有路由文件
    - ├── test.js 示例路由文件，给出了数据库查询和生成token的示例
  - ├── schema 模式目录，存放所有模式文件
    - ├── routes 存放路由模式文件
      - ├── test.js 示例路由模式文件，用于对请求参数的验证，返回参数的验证等
  - ├── test 测试目录，存放测试文件
- ├── app.js 项目入口文件，各项有详细注释
- ├── .env 配置prisma数据库连接的配置文件，由于prisma的原因只能放在项目根目录，建议不要动位置
- ├── .gitignore
- ├── package.json 项目依赖配置文件

## 提示
- 以上目录结构仅为简单示例结构，实际项目中可以根据项目需要自行调整该结构
- 该目录结构仅作参考
- prisma仅为本人喜欢用的orm框架，如果不适用orm框架或者使用别的orm框架，可以将prisma相关文件和依赖自行删除，再引入别的依赖和文件
- 由于prisma内置所有数据库的连接驱动，所以不需要手动安装数据库驱动，并且切换数据库时，仅需修改数据库类型和连接配置，再执行一次`prisma generate`即可
- 在package中配置了强制使用esm，可以根据个人情况进行修改
- 如果使用的是mongodb数据库，需要开启复制集，配置用户名和密码，具体操作自行搜索；因为prisma会给mongodb的所有操作自动开启事务，所以必须要开启复制集；如不使用prisma，遇到问题自行搜索


## 项目启动
## 准备工作
1. nodejs >= 16
2. 安装一种数据库

## 安装依赖
1. 项目根目录下执行
    ```js
    npm install
    ```
2. 安装prisma为开发依赖，为了方便装为全局依赖
    ```js
    npm install -g prisma
    ```
3. 安装nodemon
    ```js
    npm install -g nodemon
    ```

## 修改数据库配置文件 .env
    ```js
    DATABASE_URL="使用的数据库类型(postgresql,mysql,mongodb,sqlserver,cockroachdb)://数据库用户名:数据库密码@数据库地址:端口号/数据库名?一些额外选项，可省略"
    ```
## 配置 prisma/schema.prisma 文件
1. 将 `provider = "数据库类型"` 修改为与 `.env ` 文件中相同的数据库类型
2. 在下方配置数据模型信息，给了一个`Test表`模型作为示例
3. 所有的模型都是配置在其中

## 生成prisma客户端，初始化数据库
1. 项目根目录下执行
    ```js
    npx prisma generate
    ```
2. 当你修改了 `prisma/schema.prisma` 文件中的内容，需要执行 `prisma db push` 使修改生效
3. 如果修改了使用的数据库类型，需要执行 `npx prisma generate` 使修改生效

## 应用配置
1. `src/config/.env` 文件为项目全局配置，可以在其中配置项目监听的`端口号`和`地址`以及其他需要的配置信息，通过 `fastify.config.配置名` 进行全局访问

## 启动项目
1. 项目根目录下执行
    ```js
    npm run dev
    ```
2. 访问 `http://localhost:3000/api` 即可看到项目启动成功, 此时返回结果会提示未经授权
3. 为了看到token验证结果，可以先把`app.js`中`onRequest`钩子中token验证部分注释掉，就会执行数据库查询(需要数据库中有数据)和token的生成
4. 然后在`Header`中添加`Authorization`字段，值为 `Bearer 生成的token` 就可以触发正常的token验证

- 欢迎各位大佬萌新一起交流
- 群号：595788494
- 加群验证信息：`fastify-template`
>>>>>>> master
