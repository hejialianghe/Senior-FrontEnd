
 function getGuideSidebar () {
    const sidebar = [
        {
          title: '指南',
          collapsable: false,
          children: [['guide/', '介绍']],
        },
        {
          title: 'JavaScript进阶',
          collapsable: false,
          children: [
            ['jsadvanced/', '前言'],
            ['jsadvanced/function', '函数'],
            ['jsadvanced/asyncpro', '异步编程'],
            ['jsadvanced/designpattern', '设计模式'],
          ],
        },
        {
          title: '计算机网络',
          collapsable: false,
          children: [
            ['computerNetwork/protocal', '网络协议'],
            ['computerNetwork/network-actual', '网络请求实战'],
            ['computerNetwork/security', '网络安全与攻防'],
            ['computerNetwork/browser-status', '浏览器状态同步和路由'],
            ['computerNetwork/tools', '工具链和其他'],
          ],
        },
        {
          title: 'Vue',
          collapsable: false,
          children: [
            ['vue/', '前言'],
            ['vue/vueBase', 'vue基础'],
            ['vue/vueComponents', '探索vue的组件世界'],
            ['vue/sourceCode', '部分源码解析'],
            ['vue/serverSideRender', '服务端渲染'],
          ],
        },
        {
          title: 'react',
          collapsable: false,
          children: [
            ['react/', '入门介绍'],
            ['react/react-base', '步入react'],
            ['react/react-positive', 'react正篇'],
            ['react/react-ecology', 'react生态'],
            ['react/react-principle', 'react原理'],
            ['react/react-state-mana', 'react状态管理'],
            ['react/react-actualCombat', 'react高级实战'],
            ['react/react-hooks', 'react-hooks'],
          ],
        },
        {
          title: 'Node.js进阶',
          collapsable: false,
          children: [
            ['node/', 'Node.js基础'],
            ['node/koa', 'koa'],
            ['node/egg', '企业级框架egg'],
          ],
        },
        {
          title: '工程化',
          collapsable: false,
          children: [
            ['engineering/script', '脚本世界'],
            ['engineering/coding-standards', '规范先行'],
            ['engineering/quality-code', '质量代码'],
            ['engineering/design', '工程设计'],
            ['engineering/ctg-art', '构建艺术'],
            ['engineering/auto-deploy', '持续集成与部署'],
            ['engineering/git', 'Git操作'],
            ['engineering/tool', '效率工具'],
          ],
        },
        {
          title: '小程序',
          collapsable: false,
          children: [['applets/performance', '小程序进阶']],
        },
        {
          title: '项目实战',
          collapsable: false,
          children: [
            ['projectPractice/isomorphism', '认识同构及原理'],
            ['projectPractice/demo', '实现一个同构的demo'],
            ['projectPractice/nextjs', 'Nextjs'],
          ],
        }
      ]
  
    return sidebar
  }

  module.exports = {
    getGuideSidebar
  }