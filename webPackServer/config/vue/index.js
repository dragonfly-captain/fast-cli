// const root = global["$cwd"];
const { merge } = require("webpack-merge");
const ESLintPlugin = require("eslint-webpack-plugin");
const { VueLoaderPlugin } = require('vue-loader');
const { pathJoin,getGlobal } = require("../../../common/utils/path");
const styleConfig = require("../../common/style.config");
const { resolveAppnameDir, resolveClientShare } = require("../../common/utils/joinPath");

module.exports = merge(styleConfig, {
  resolve: {
    // 自动解析配置好的文件扩展名，依照配置的顺序解析。
    extensions: [".vue", ".js", ".json"],
  },
  module: {
    rules: [{
      test: /\.(vue|js)$/,
      enforce: 'pre',
      loader: 'eslint-loader',
      include: [
        resolveAppnameDir(getGlobal('frame'), getGlobal('appname')),
        resolveClientShare()
      ]
    }, {
      test: /\.vue$/,
      loader: 'vue-loader',
      include: [
        resolveAppnameDir(getGlobal('frame'), getGlobal('appname')),
        resolveClientShare()
      ]
    }]
  },
  plugins: [
    new VueLoaderPlugin(),
    /**
     * 可以自己扩展参数的设置
     * @param {array}  extensions 要检查的文件扩展名
     * @param {string} exclude 要排除的文件或目录
     * @param {string} eslintPath ESLint模块的路径
     * @param {string} overrideConfigFile 要覆盖的ESLint配置文件路径
     */
    new ESLintPlugin({
      exclude: '/node_modules/',
      files: [pathJoin('./*', resolveAppnameDir(getGlobal('frame'), getGlobal('appname'))), pathJoin('./*', resolveClientShare())],
      overrideConfig: require(pathJoin('.eslintrc.js', getclipath('.')))
    })
  ]
});
