"use strict";
// const fs = require("fs");
// webpack
const Webpack = require("webpack");
// 合并webpack的配置
const { merge } = require("webpack-merge");
// 打包后的文件需要一个落地页，并可以自动引入。
const HtmlWebpackPlugin = require("html-webpack-plugin");
// 共用的基础配置
const webpackBase = require("./base");
const envConfig = require("../common/env.config");
const microConfig = require("../common/micro.config");
const { getGlobal } = require("../../common/utils/path");
const { resolveIndexHtml } = require("../common/utils/joinPath");
// const { resolvePosix, resolveIndexHtml } = require(`${$cwd}/tools/utils`);

const oDev = envConfig.dev;  // 开发环境
const appname = getGlobal("appname");    // 当前项目
const frame = getGlobal("frame");    // 当前框架

const WebpackDevelopConfig = merge(webpackBase, {
  // 开发模式，打包更加快速，省了代码优化步骤
  mode: "development",
  // 生成以 .map 结尾的 SourceMap 文件
  devtool: oDev.devtool,
  watchOptions: {
    poll: 1000  // 设置每多少秒检查文件是否更改
  },
  plugins: [
    // 给页面返回值，可以在js中获取到配置的信息。
    new Webpack.DefinePlugin({
      "defineProcess": {
        "ENV": `"development"`,
        "APPNAME": `"${appname}"`
      }
    }),
    // https://github.com/jantimon/html-webpack-plugin#options
    new HtmlWebpackPlugin({
      data: {
        env: `development`,
        appname: appname
      },
      title: `development`,
      filename: "index.html",
      template: resolveIndexHtml(),
      inject: true
    })
  ],
  // 选项让你更精确地控制 bundle 信息该怎么显示。文章：https://webpack.docschina.org/configuration/stats/#stats-presets
  stats: {
    modules: false,
    logging: "warn"
  },
  // 用于快速开发应用程序, 文章: https://webpack.docschina.org/configuration/dev-server/
  devServer: {
    // 允许配置从目录提供静态文件的选项（默认是 'public' 文件夹）。将可以其设置为：false，以禁用。
    static: false,
    // 设置请求头信息
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Method": "GET,POST,PUT,OPTIONS"
    },
    // 'log' | 'info' | 'warn' | 'error' | 'none' | 'verbose'
    client: {
      progress: true,                                 // 展示进度
      logging: 'warn',                                // 允许在浏览器中设置日志级别
      overlay: oDev.errorOverlay ? {                  // 当存在编译器错误或警告时，在浏览器中显示全屏覆盖。
        errors: true,
        warnings: false
      } : false,
      webSocketTransport: 'ws'                        // 配置是用于配置 webpack-dev-server 与浏览器之间的 WebSocket 通信
    },
    historyApiFallback: {
      // 通过提供一个对象，这种行为可以通过像 rewrites 这样的配置项进一步控制
      rewrites: [
        {
          // 定义设置的html目录
          from: /.*/,
          // 定义目标文件，即跳转到指定目录下的index.html
          to: "/index.html" //resolveIndexHtml(frame, appname)
        }
      ]
    },
    server: oDev.server || "http",                    // 启动服务类型，http/https/HTTP2("spdy")
    hot: true,                                        // 启用 webpack 的 热模块替换 特性
    // hot: "only",                                   // 启用热模块替换功能，在构建失败时不刷新页面作为回退
    compress: true,                                   // 是否启用gzip 压缩
    host: oDev.host,                                  // 启动服务的host
    port: "auto",                                     // 端口号，auto会判断递增
    open: oDev.autoOpenBrowser,                       // 是否默认打开浏览器
    proxy: oDev.proxyTable                            // 反向代理配置
  }
  // experiments: {
  //   outputModule: true
  // }
}, microConfig?.dev);

module.exports = WebpackDevelopConfig;
