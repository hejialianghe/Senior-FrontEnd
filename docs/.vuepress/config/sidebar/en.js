const { getGuideSidebar } = require('./shared')

const SidebarEN = {
  '/en-US/algorithm/': [{
    title: 'Data Structures and Algorithms',
    collapsable: false,
    children: [
      ['complexity', 'Complexity'],
      ['dataStructure', 'Data Structure'],
      ['thinking', 'Problem-Solving Approach'],
      ['sort', 'Sorting Algorithms'],
      ['base', 'Real Questions'],
    ],
  }],
  "/en-US/fp/": [
    {
      title: 'React',
      collapsable: false,
      children: [
        ['react/build-react', '[Translation]build-your-own-react'],
        ['react/react-hooks', 'React Hooks'],
      ],
    },
    {
      title: 'Vue2',
      collapsable: false,
      children: [
        ['vue2/', 'Introduction'],
        ['vue2/dataResponse', 'Reactivity'],
        ['vue2/virtualdomAndDiff', 'Virtual DOM and Diff'],
      ],
    },
  ],
  '/en-US/': getGuideSidebar(),
}

module.exports = SidebarEN