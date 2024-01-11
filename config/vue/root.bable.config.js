module.exports = {
  presets: [
    // "@babel/eslint-preser",
    [
      "@babel/preset-env",
      {
        // https://web.dev/serve-modern-code-to-modern-browsers/
        // esmodules: true,
        // useBuiltIns = "false" 默认值，无视浏览器兼容配置，引入所有 polyfill
        // useBuiltIns = "entry" 根据配置的浏览器兼容，引入浏览器不兼容的 polyfill
        // useBuiltIns = "usage" 会根据配置的浏览器兼容，以及你代码中用到的 API 来进行 polyfill
        targets: {
          "esmodules": true // 许多使用 Babel 编译的较新的 ECMAScript 功能已经在支持 JavaScript 模块的环境中得到支持。因此，通过这样做，您可以简化确保只有转译代码用于实际需要的浏览器的过程。
        },
        useBuiltIns: "usage",
        corejs: "3.9.1" // 是 core-js 版本号
      }
    ]
  ],
  plugins: [

  ]
}