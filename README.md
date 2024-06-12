# fastify-project-template
一个fastify项目的示例模板，方便开发者快速上手和参考。

# fastify模板示例说明
- fastify是一个nodejs的web框架，其性能是目前nodejs框架中最好的，并且极其轻量，在不牺牲性能的情况下极大简化开发流程，提高了开发效率；fastify中一切皆插件，就像java中一切皆对象一样，所有功能都可以依靠引入或者编写插件来完成；社区拥有200+插件包，以及任意npm均可使用，大量轮子。
- 本示例模板旨在搭建一个使用fastify快速开发的基本项目结构，方便开发者快速上手和参考。
- 技术结构：`js + fastify(4.6.x) + typeorm + postgresql`

# 更新

- 2024/6/12
- node-var.js 重命名为 app-var.js
- app-var.js 新增全局变量控制服务器启停，服务器停机并不是真的关停服务，主要是让客户端停止访问，用于升级维护等，所以开放管理端的访问权限，如果将管理端接口也拦截，那么将无法修改服务器启停状态和一系列的线上不停机维护操作；可扩展为使用数据表控制（一般来说全局变量就够了）
- 切换服务启停示例接口：http://127.0.0.1:3000/admin/sys/appStatusChange
- 调整代码结构，将中间件从工具函数修改为插件，封装全局onRequest和onResponse钩子
- 将拦截模块使用策略模式改写为一个工具模块 src/utils/guard-strategies.js 方便后续扩展

- ---------------------------------------------------------------------------

- 2024/6/11
- 初始化分支

## 项目结构说明
```js
- 项目根目录
- ├── node_modules 项目依赖
- ├── src 项目源码目录
  - ├── config 项目配置目录
    - ├── cert 存放各种证书文件，示例项目存放的为生成token的公钥私钥
    - ├── app-config.js 项目全局配置文件，通过 `fastify.config.配置名` 全局访问，默认配置了端口号和监听地址等
  - ├── entities typeorm数据实体目录
    - ├── Test.js 示例实体文件
  - ├── middlewares 中间件
    - ├── route-guard.js 路由守卫，用于对请求进行拦截
  - ├── plugins 插件目录，fastify中一切皆插件，这里存放项目中所有自己编写的插件
    - ├── core 核心插件目录，这里存放的是需要优先加载的插件，为后续插件提供必要的方法配置等
      - ├── app-var.js 挂载全局方法和变量的插件，为了偷懒，将node中的某些方法和变量挂载了上去，通过fastify就可以直接全局访问，如果不需要，每个文件单独导入node模块是一样的，全局配置也是在这里挂载
    - ├── global 全局插件目录，这里存放的是注册到项目全局可访问的插件，例如工具类插件
      - ├── jwt.js 示例jwt插件，通过注册`@fastify/jwt`插件，实现token鉴权
      - ├── typeorm-db.js 注册typeorm的插件，让所有路由可以操作数据库
    - ├── local 局部插件目录，这里存放的是无需全局访问的插件，例如某个路由中才会用到的插件，只需在用到的时候单独注册即可
  - ├── routes 路由目录，存放所有路由文件
    - ├── test.js 示例路由文件，给出了数据库查询和生成token的示例
  - ├── schema 模式目录，存放所有模式文件
    - ├── routes 存放路由模式文件
      - ├── test.js 示例路由模式文件，用于对请求参数的验证，返回参数的验证等
  - ├── test 测试目录，存放测试文件
  - ├── utils 工具目录，存放所有工具模块
- ├── app.js 项目入口文件，各项有详细注释
- ├── package.json 项目依赖配置文件
```

## 提示
- 以上目录结构仅为简单示例结构，实际项目中可以根据项目需要自行调整该结构
- 在package中配置了强制使用esm，可以根据个人情况进行修改
- 默认的路由拦截规则
  1. pub目录中的路由可以随意访问，例如加载商品列表等接口
  2. auth目录中的路由需要登录才可访问，例如下单商品
  3. sys目录中的路由需要对应的权限才可访问，一般在管理后台才需用到
- 可以根据需求修改中间件中的拦截规则

## 项目启动
## 准备工作
1. nodejs >= 16
2. 安装pg数据库

## 安装依赖
1. 项目根目录下执行
    ```js
    npm install
    ```

2. 安装nodemon
    ```js
    npm install -g nodemon
    ```

## 修改数据库配置文件 src\config\app-config.js
- 根据注释配置相关参数
- 开发阶段可以将 synchronize 设置为true，会同步实体类表结构到数据库中
- 向数据库中添加一些测试数据，修改测试路由中的查询条件

## 应用配置
1. `src/config/app-config.json` 文件为项目全局配置，可以在其中配置项目监听的`端口号`和`地址`以及其他需要的配置信息，通过 `fastify.config.配置名` 进行全局访问

## 启动项目
1. 项目根目录下执行
    ```js
    npm run dev
    ```
2. 访问 `http://localhost:3000/client/pub/test/typeorm` 即可看到项目启动成功
3. 为了看到token验证结果，可以先访问`pub/test/typeorm`，就会执行数据库查询(需要数据库中有数据)和token的生成
4. 然后在`Header`中添加`Authorization`字段，值为 `Bearer 生成的token`，访问`auth/test/typeorm`，就可以触发正常的token验证

- 欢迎各位大佬萌新一起交流
- Q群：595788494
- 加群验证信息：`fastify-template`
- 更多fastify相关知识，请移步[fastify.dev](https://fastify.dev/docs/latest/Guides/Getting-Started/)
- 想使用ts编写fastify项目，请移步[fastify-template-ts](https://git.seepine.com/seepine/fastify-template-ts)
