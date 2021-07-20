module.exports = {
  "presets": [
    [
      '@babel/preset-env',

      {
        "targets": {
          chrome: '67',
        },
        "useBuiltIns": "usage"
      },
    ],
    '@babel/preset-react',
  ],
  "plugins": [
    "@babel/plugin-transform-runtime"
  ]  
}
