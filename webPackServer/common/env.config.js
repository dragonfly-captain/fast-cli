"use strict";
const fs = require("fs");
const { pathJoin, getclipath, getLocalAddressIP, getGlobal } = require("../../common/utils/path");
const { getwebpropath } = require("../../common/utils/path");

module.exports = {
  dev: {
    // 资源引入路径，开发时为"/"。
    assetsPublicPath: "auto",
    // 资源的引用路径，如果设置则会在资源路径前添加一个值
    assetsPath: "",
    // 反向代理接口的配置项
    proxyTable: {},
    // 启动服务类型，http/https/HTTP2("spdy")
    server: "spdy",
    // 支持https和spdy模式，https://webpack.docschina.org/configuration/dev-server/#devserverhttps
    https: {
      key: fs.readFileSync(pathJoin("./ssl/server.key")), //fs.readFileSync()
      cert: fs.readFileSync(pathJoin("./ssl/server.crt")),
      passphrase: "webpack-dev-server"
      // pfx: fs.readFileSync(resolve("./webpackService/configs/ssl/server.pfx")),
      // ca: fs.readFileSync(resolve("./webpackService/configs/ssl/ca.pem")),
    },
    // 默认是localhost，代表本地服务器的域名。
    host: '0.0.0.0', //getLocalAddressIP(),
    // 端口号
    // port: getProcessPointName("PORT") || 7000,
    // 是否启动成功后打开浏览器的设置
    autoOpenBrowser: true,
    // 是否在浏览器上全屏显示编译的errors
    errorOverlay: true,
    /**
     * Devtool: https://webpack.js.org/configuration/devtool/#development
     * Source Maps Types:
     * eval： 生成代码 每个模块都被eval执行，并且存在@sourceURL
     * cheap-eval-source-map： 转换代码（行内） 每个模块被eval执行，并且sourcemap作为eval的一个dataurl
     * cheap-module-eval-source-map： 原始代码（只有行内） 同样道理，但是更高的fast rebuild和slow build
     * eval-source-map： 原始代码 同样道理，但是最高的质量和最低的性能
     * eval-cheap-module-source-map：会将每个模块的代码包裹在一个 eval() 函数中，并生成一个简单的模块映射表，相对于source-map方式，它的优点是生成速度快，同时映射关系也比较简单，占用的内存较少。
     * cheap-source-map： 转换代码（行内） 生成的sourcemap没有列映射，从loaders生成的sourcemap没有被使用
     * cheap-module-source-map： 原始代码（只有行内） 与上面一样除了每行特点的从loader中进行映射
     * source-map： 原始代码 最好的sourcemap质量有完整的结果，但是会很慢
    **/
    devtool: "source-map"
  },
  build: {
    // 资源打包路径
    assetsBuildPath: pathJoin(`../../../dist`, process.env.PWD),
    // 资源引入路径，可以配置OSS/CDN地址。
    assetsPublicPath: "/",
    // 资源的引用路径，如果设置则会在资源路径前添加一个值，比如设置"static/assets" => "static/assets/img/image.png"
    assetsPath: "",
    /**
     * 是否生成代码工具 map映射文件
     * hidden-source-map: 生成但不使用，这样你可以通过工具来分析。
    **/
    devtool: "none",
    // bundlerGzip: process.env.npm_config_gzip,
    // 是否开启打包后的代码体积分析
    bundleAnalyzerReport: process.env.npm_config_report
  }
};
