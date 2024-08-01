const path = require('path')
const {NavItemsZH,SidebarZH} = require('./config/index')

module.exports = {
  title: 'web全栈体系',
  description: 'Hello, my friend!',
  dest: 'dist',
  serviceWorker: false, //支持PWA配置
  plugins: [
    '@vuepress/nprogress',
    '@vuepress/back-to-top',
    '@vuepress/active-header-links',
    {
      sidebarLinkSelector: '.sidebar-link',
      headerAnchorSelector: '.header-anchor',
    },
  ],
  markdown: {
    lineNumbers: true,
  },
  head: [
    [
      'link',
      {
        rel: 'icon',
        href: `/logo.png`,
      },
    ],
  ],
  ga: '',
  evergreen: true,
  configureWebpack: {
    resolve: {
      alias: {
        '@': path.join(__dirname, 'public', 'assets'),
      },
    },
  },

  themeConfig: {
    // repo: "hejialianghe/Senior-FrontEnd",
    editLinks: true,
    searchMaxSuggestions: 10,
    docsDir: 'docs',
    editLinkText: '在 GitHub 上编辑此页',
    lastUpdated: '最新更新时间',
    sidebarDepth: 3,
    logo: '/logo.png',
    adsConfig: [
      {
        title: '联系作者',
        src: '/weixin.jpeg',
      },
    ],
    locales: {
      '/': {
        selectText: '选择语言',
        label: '简体中文',
      },
      '/en/': {
        selectText: 'Languages',
        label: 'English',
      },
    },
  },
  locales: {
    // 键名是该语言所属的子路径
    // 作为特例，默认语言可以使用 '/' 作为其路径。
    '/': {
      lang: 'zh-CN', // 将会被设置为 <html> 的 lang 属性
      title: 'web全栈体系',
      description: '你好，朋友',
      nav: NavItemsZH,
      sidebar: SidebarZH
    },
    '/en-US/': {
      lang: 'en-US',
      title: 'Full-stack Engineering (web) - Learning Roadmap',
      description: 'Hello, my friend!',
    },
  },
}
