
  const {getGuideSidebar} = require('./shared')

 const SidebarZH = {
  '/algorithm/':[{
    title: '数据结构与算法',
    collapsable: false,
    children: [
      ['complexity', '复杂度'],
      ['dataStructure', '数据结构'],
      ['thinking', '解题思路'],
      ['sort', '排序算法专题'],
      ['base', '真题'],
    ],
  }],
  "/fp/":[
  {
    title: 'React',
    collapsable: false,
    children: [
      ['react/build-react','[译]build-your-own-react'],
      ['react/react-hooks','react-hooks'],
    ],
  },
  {
    title: 'Vue2',
    collapsable: false,
    children: [
      ['vue2/', '前言'],
      ['vue2/dataResponse', '响应式'],
      ['vue2/virtualdomAndDiff', 'virtualdom和DIff'],
    ],
  },
],
    '/': getGuideSidebar(),
 
  }






module.exports =SidebarZH
