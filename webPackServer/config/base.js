const { merge } = require("webpack-merge");
const { pathJoin, getclipath, getGlobal } = require("../../common/utils/path");
const envConfig = require("../common/env.config");
const otherConfig = require("../common/other.config");
const microConfig = require("../common/micro.config");
const { getwebpropath } = require("../../common/utils/path");
const isProduction = getGlobal("isProduction");
const frame = getGlobal("frame");        // 当前框架
const projectAppName = pathJoin(`../../../`, process.env.PWD);

const oDev = envConfig.dev;     // 开发环境
const oBuild = envConfig.build; // 生产环境
const WebpackBaseConfig = {
  // 入口文件配置，支持多入口配置。webpack会从这里分析构建内部依赖图。
  entry: {
    app: `${projectAppName}/src/index`
  },
  // 输出配置
  output: {
    // 输出的目录地址
    path: oBuild.assetsBuildPath,
    // 打包构建时，针对资源路径输出的url链接。
    publicPath: isProduction ? oBuild.assetsPublicPath : oDev.assetsPublicPath,
    // 输出的文件名称
    filename: "js/[name].[contenthash:7].min.js",
    // 开发中用到的"动态加载的模块import()"。 require.ensure是webpack v2中的api。
    chunkFilename: "js/[name].chunk.[contenthash:7].min.js"  // [hash:9] [chunkhash:9] [contenthash:9]
  },
  // 可以设置模块如何被解析。
  resolve: {
    // 自动解析配置好的文件扩展名，依照配置的顺序解析。
    extensions: [],
    // import 或 require 的引用模块的别名，就是为了让你模块引入变得更简单。
    alias: {
      "@root": pathJoin("./", getwebpropath('.')),  // 当前工作位置
      "@reactapp": pathJoin(".", getwebpropath('.')),
      "@vue3app": pathJoin("./apps/vue3", getwebpropath('.')),
      "@shared": pathJoin("./shared", getwebpropath('.'))
    },
    modules: [
      'node_modules',
      pathJoin("./node_modules", getclipath('.'))
    ]
  },
  // 配置loader的查找目录.
  resolveLoader: {
    modules: [pathJoin("./node_modules", getclipath('.')), pathJoin("./loaders", getclipath('.'))]
  },
  /**
   * 过滤指定的依赖不参与打包过程，可以使用自己配置好的OSS/CDN路径。
   * key=引用的库名称，value是npm install的包名称。
  * http://webpack.html.cn/configuration/externals.html
  **/
  externals: {},
  // 模块管理 - loader配置
  module: {
    rules: []
  },
  // webpack插件加载的位置
  plugins: []
};

module.exports = merge(WebpackBaseConfig, otherConfig, microConfig?.base);
