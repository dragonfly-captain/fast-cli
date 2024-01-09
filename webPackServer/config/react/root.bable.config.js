const isProduction = process.env.NODE_ENV === 'production'; // global.$isProduction;

const babelConfig = {
  presets: [
    [
      "@babel/preset-env",
      {
        // https://web.dev/serve-modern-code-to-modern-browsers/
        // useBuiltIns = "false" 默认值，无视浏览器兼容配置，引入所有 polyfill
        // useBuiltIns = "entry" 根据配置的浏览器兼容，引入浏览器不兼容的 polyfill
        // useBuiltIns = "usage" 会根据配置的浏览器兼容，以及你代码中用到的 API 来进行 polyfill
        targets: {
          esmodules: true // 许多使用 Babel 编译的较新的 ECMAScript 功能已经在支持 JavaScript 模块的环境中得到支持。因此，通过这样做，您可以简化确保只有转译代码用于实际需要的浏览器的过程。
        },
        useBuiltIns: "usage",
        corejs: "3.9.1" // 是 core-js 版本号
      }
    ],
    [
      "@babel/preset-react",
      {
        runtime: "automatic" // 添加这行来启用新的 JSX 转换
      }
    ]
  ],
  plugins: [
    // "@babel/plugin-transform-runtime"
  ]
};

if (isProduction) {
  // 用于react props 类型验证的插件
  //   babelConfig.plugins.push(
  //     "babel-plugin-transform-react-remove-prop-types"
  //   );
} else {
  babelConfig.plugins.push(
    "react-refresh/babel"
  );
}

module.exports = babelConfig;
