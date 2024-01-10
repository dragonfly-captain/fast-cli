'use strict';
require("./common/alias");
console.log('build...');

const webpack = require("webpack");
const { merge } = require("webpack-merge");
//rimraf插件是用来执行UNIX命令rm和-rf，用来删除文件和文件夹的，清空旧文件
const rm = require('rimraf');
const colors = require("colors");
const loading = require('loading-cli');
const { setGlobal, getGlobal } = require("../common/utils/path");
const { frameConfigPath } = require("../common/utils/joinPath");

async function webpackBuild() {
  const customArgs = {}
  process.argv.slice(2).forEach(it => {
    const [key, value] = it.split('=')
    const _key = key.replace(/-/g, '')
    setGlobal(_key, value);
  })

  const spinner = loading(colors.green(`正在构建项目...`));
  spinner.frame(["🕐", "🕑", "🕒", "🕓", "🕔", "🕕", "🕖", "🕗", "🕘", "🕙", "🕚"]);
  spinner.start();

  // 共用的基础配置
  const envConfig = require("./common/env.config");
  function buildRun() {
    // produce配置文件
    const productionConfig = require('./config/produce');
    const frameConfig = require(frameConfigPath());
    const webpackBuildConfig = merge(productionConfig, frameConfig);

    // 执行webpack编译
    webpack(webpackBuildConfig, (err, stats) => {
      spinner.stop();
      // 如果有错误就抛出错误
      if (err) {
        throw new Error("webpack compilation error", err);
      }
      //process.stdout用来控制标准输出，也就是在命令行窗口向用户显示内容。它的write方法等同于console.log
      process.stdout.write(stats.toString({
        // 增加控制台颜色开关
        colors: true,
        //去掉内置模块信息
        modules: false,
        //去掉子模块
        children: false, // If you are using ts-loader, setting this to true will make TypeScript errors show up during build.
        //增加包信息（设置为 false 能允许较少的冗长输出）
        chunks: false,
        //去除包里内置模块的信息
        chunkModules: false
      }) + '\n\n');

      // 下面是编译失败时输出的信息
      if (stats.hasErrors()) {
        console.log(colors.red('  Build failed with errors.\n'))
        process.exit(1);
      }
      // 下面是编译成功的消息
      console.log(colors.cyan('  Build complete.\n'))
      console.log(colors.yellow(
        '  Tip: built files are meant to be served over an HTTP server.\n' +
        '  Opening index.html over file:// won\'t work.\n'
      ))
    });
  };

  rm(envConfig.build.assetsBuildPath, err => {
    if (err) {
      throw err;
    }
    buildRun();
  });

}
webpackBuild();
