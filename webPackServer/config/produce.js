"use strict";
// webpack
const Webpack = require("webpack");
// 合并webpack的配置
const { merge } = require("webpack-merge");
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
// 插件 - 此插件使用uglify-js进行js文件的压缩。https://webpack.docschina.org/plugins/terser-webpack-plugin/#terseroptions
const TerserPlugin = require("terser-webpack-plugin");
// 优化和压缩 CSS，在 source maps 和 assets 中使用查询字符串会更加准确，支持缓存和并发模式下运行。https://webpack.docschina.org/plugins/css-minimizer-webpack-plugin/#root
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const CssMinimizerPlugin = require("css-minimizer-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const CompressionPlugin = require("compression-webpack-plugin");
// const ResourceHintWebpackPlugin = require('resource-hints-webpack-plugin');
const OS = require('os');

// 共用的基础配置
const webpackBase = require("./base");
const envConfig = require("../common/env.config");
const microConfig = require("../common/micro.config");
const { getGlobal } = require("../../common/utils/path");
const { resolveIndexHtml } = require("../../common/utils/joinPath");

const isProduction = getGlobal("isProduction");

// 当前项目
const appname = getGlobal('appname');
const frame = getGlobal('frame');
// 构建环境
const oBuild = envConfig.build;

const WEBPACK__PRODUCE = {
  mode: 'production',
  optimization: {
    minimize: true, // 告知 webpack 使用 TerserPlugin
    minimizer: [
      new TerserPlugin({
        // 与指定表达式匹配的所有注释将会被剥离到单独的文件中
        extractComments: /(@extract notes)/i,
        // 启用/禁用多进程并发运行功能。
        // parallel: true,
        // 多核
        parallel: OS.cpus().length - 1,
        // 判处文件夹
        exclude: /\/node_modules/,
        // swc 是一款采用 rust 编写的超快编译器
        minify: TerserPlugin.swcMinify,
        terserOptions: {
          compress: {
            // // webpack删除没有用到的代码时不输出警告
            // warnings: false,
            // 是否删除所有console.log语句
            drop_console: true,
            // 是否删除所有debugger语句
            drop_debugger: true,
            // keep_classnames: true,
            // keep_fnames: true
          }
        }
      }),

      new CssMinimizerPlugin({
        parallel: OS.cpus().length - 1
      })
    ],
    // 这会确保在构建过程中生成的模块和块具有确定性。
    // 这意味着，如果你运行两次完全相同的构建，它们会生成完全相同的输出。
    // 这对于缓存和长期缓存来说非常有用，因为它保证了在不同构建之间的模块和块的稳定性，这样缓存就不会无效。
    chunkIds: 'deterministic',     // 在不同的编译中不变的短数字 id。有益于长期缓存。在生产模式中会默认开启。
    moduleIds: 'deterministic',    // 被哈希转化成的小位数值模块名。
    splitChunks: {
      chunks: "all",  // 处理同步和异步模式的引入
      minSize: 1024 * 20,
      maxSize: 1024 * 20,
      minChunks: 1, // 被引用次数
      cacheGroups: {
        // 三方库
        verdors: {
          test: /[\\/]node_modules[\\/]/,
          filename: 'js/[id].cachegroups.js',
          chunks: 'all',
          priority: -10
        },
        common: { // 打包其余的的公共代码
          minChunks: 2, // 引入两次及以上被打包
          filename: 'js/[id].cachegroup.js', // 分离包的名字
          chunks: 'all',
          priority: -20
        }
      }
    },
    // optimization.runtimeChunk 用来提取 entry、chunk 中的 runtime部分函数，形成一个单独的文件，这部分文件不经常变换，方便做缓存。
    runtimeChunk: {
      name: 'runtime'
    }
  },
  plugins: [
    // 给页面返回值，可以在js中获取到配置的信息。
    new Webpack.DefinePlugin({
      "defineProcess": {
        "ENV": `"production"`,
        "APPNAME": `"${appname}"`
      }
    }),
    // https://github.com/jantimon/html-webpack-plugin#options
    new HtmlWebpackPlugin({
      // preload: ['*.js'],
      data: {
        env: `production`,
        appname: appname
      },
      title: appname,
      filename: "index.html",
      template: resolveIndexHtml(frame, appname),
      inject: "body", // true body head
      minify: {
        // 去掉空格
        collapseWhitespace: true,
        // 去掉注释
        removeComments: true
      }
    }),
    new MiniCssExtractPlugin({  // !isProduction ? "[id].css" : ""
      filename: "css/[name].[contenthash:7].css",
      chunkFilename: "css/[id][contenthash:7].chunk.css"
    }),
    new CleanWebpackPlugin(),
    new CompressionPlugin({
      filename: "[path][base].gz",
      algorithm: "gzip",
      threshold: 10 * 1024,
      test: /\.js$|\.css$|\.html$|\.json$|.tff$|.eot$|\.woff$/,
      minRatio: 0.8,
      deleteOriginalAssets: false
    })
  ]
};

// 生产模式下 webpack的主要配置
const produceConfig = merge(webpackBase, WEBPACK__PRODUCE, microConfig?.build);
// 添加代码打包体积分析插件
if (oBuild.bundleAnalyzerReport) {
  const BundleAnalyzeerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
  produceConfig.plugins.push(
    new BundleAnalyzeerPlugin()
  );
}
module.exports = produceConfig;
