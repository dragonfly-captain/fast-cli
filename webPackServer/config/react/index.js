const {merge} = require("webpack-merge");
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ESLintPlugin = require("eslint-webpack-plugin");
const styleConfig = require("../../common/style.config");
const {getGlobal, getclipath, getwebpropath} = require("../../common/utils");
const {resolveAppnameDir, resolveClientShare, resolveReactFrame} = require("../../common/utils/joinPath");
const {pathJoin} = require("../../../common/utils/path");

module.exports = merge(styleConfig, {
  resolve: {
    // 自动解析配置好的文件扩展名，依照配置的顺序解析。
    extensions: [".jsx", ".js", ".ts", ".tsx", ".json"],
  },
  stats: {
    errorDetails: true,
  },
  module: {
    rules: [
      {
        test: /\.(jsx|js)$/, // /\.(js|jsx)$/,
        enforce: "pre", // 确保代码被其他loader处理之前，先进行了ESLint检测。
        use: [
          {
            loader: "babel-loader",
            options: {
              // cacheDirectory: true,
              configFile: pathJoin('./babel.config.js', getclipath('.'))
            }
          },
        ],
        exclude: /node_modules/,
        include: [
          pathJoin('./', process.env.$cwd)
        ]
      }
    ]
  },
  plugins: [
    /**
     * 可以自己扩展参数的设置
     * @param {array}  extensions 要检查的文件扩展名
     * @param {string} exclude 要排除的文件或目录
     * @param {string} eslintPath ESLint模块的路径
     * @param {string} overrideConfigFile 要覆盖的ESLint配置文件路径
     */
    new ESLintPlugin({
      extensions: ['js', 'jsx', 'ts', 'tsx'],
      exclude: '/node_modules/',
      files: [pathJoin('./', process.env.$cwd), resolveClientShare()],
      overrideConfig: require(pathJoin('.eslintrc.js', getclipath('.')))
    }),
    new ReactRefreshWebpackPlugin()
  ]
});
