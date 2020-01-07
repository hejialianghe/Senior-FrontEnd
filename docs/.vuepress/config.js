module.exports = {
    title: '高级开发工程师必备',
    description: 'Hello, my friend!',
    head: [
        ['link', {
            rel: 'icon',
            href: `/logo.jpeg`
        }]
    ],
    dest: './docs/.vuepress/dist',
    ga: '',
    evergreen: true,
    themeConfig: {
        sidebar: [
            {
              title: "指南",
              collapsable: false,
              children: [
                ["guide/",'介绍']
              ]
            },
            {
                title: "JavaScript进阶",
                collapsable: false,
                children: [
                  ["jsadvanced/",'导学'],
                  ["jsadvanced/function",'函数'],
                  ["jsadvanced/asyncpro",'异步编程'],
                  ["jsadvanced/designpattern",'设计模式'],
                ]
              },
              {
                title: "计算机网络",
                collapsable: false,
                children: [
                  ["jsadvanced/",'网络协议'],
                  ["jsadvanced/function",'网络请求'],
                  ["jsadvanced/asyncpro",'网络安全'],
                  ["jsadvanced/asyncpro",'模块加载'],
                  ["jsadvanced/asyncpro",'路由']
                ]
              },
              {
                title: "Vue",
                collapsable: false,
                children: [
                  ["jsadvanced/",'初识vue'],
                  ["jsadvanced/function",'探索vue的组件世界'],
                  ["jsadvanced/asyncpro",'vue生态'],
                  ["jsadvanced/asyncpro",'vue实战'],
                  ["jsadvanced/asyncpro",'企业级组件系统架构'],
                  ["jsadvanced/asyncpro",'Vue3.0']
                ]
              },
              {
                title: "react",
                collapsable: false,
                children: [
                  ["jsadvanced/",'入门介绍'],
                  ["jsadvanced/function",'JSX介绍'],
                  ["jsadvanced/asyncpro",'组件基础知识'],
                  ["jsadvanced/asyncpro",'组件进阶'],
                  ["jsadvanced/asyncpro",'实战应用1'],
                  ["jsadvanced/asyncpro",'react生态-路由'],
                  ["jsadvanced/asyncpro",'react生态-企业应用'],
                  ["jsadvanced/asyncpro",'react原理'],
                  ["jsadvanced/asyncpro",'react-hooks'],
                  ["jsadvanced/asyncpro",'react高级实战与性能优化'],
                  ["jsadvanced/asyncpro",'状态管理'],
                  ["jsadvanced/asyncpro",'实战应用2']
                ]
              },
              {
                title: "Node.js进阶",
                collapsable: false,
                children: [
                  ["jsadvanced/",'Node.js基础'],
                  ["jsadvanced/function",'Web服务及koa'],
                  ["jsadvanced/asyncpro",'企业级Nodejs框架'],
                ]
              },
              {
                title: "工程化",
                collapsable: false,
                children: [
                  ["jsadvanced/",'脚本世界'],
                  ["jsadvanced/function",'规范先行'],
                  ["jsadvanced/asyncpro",'质量代码'],
                  ["jsadvanced/asyncpro",'工程设计'],
                  ["jsadvanced/asyncpro",'构建艺术'],
                  ["jsadvanced/asyncpro",'持续集成与部署'],
                  ["jsadvanced/asyncpro",'Git操作'],
                  ["jsadvanced/asyncpro",'效率工具']
                ]
              },
              {
                title: "项目实战",
                collapsable: false,
                children: [
                  ["jsadvanced/",'认识同构及原理'],
                  ["jsadvanced/function",'实现一个同步的demo'],
                  ["jsadvanced/asyncpro",'同构如何获取数据'],
                  ["jsadvanced/asyncpro",'Nextjs'],
                  ["jsadvanced/asyncpro",'同构如何获取数据']
                ]
              }
        ]
    }
}