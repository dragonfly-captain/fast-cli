'use strict';
require("../common/alias");
console.log('run...');

const webpack = require("webpack");
const {merge} = require("webpack-merge");
const WebpackDevServer = require("webpack-dev-server");
const colors = require("colors");
const {frameConfigPath} = require("../common/utils/joinPath");
const {setGlobal, getGlobal, execPtah, dirnamePtah} = require("../common/utils/path");
const { checkAndUpdateDependency } = require("../common/utils/checkWebpackVersion");
// const WebpackDevelopConfig = require("../config/develop");

async function webpackRun() {
  await checkAndUpdateDependency("crootfast-webpack");
  // 开发模式下的webpack配置
  const WebpackDevelopConfig = require("../config/develop");
  try {
    const env = getGlobal('env');
    const frame = getGlobal('frame');
    // 加载对应框架的配置
    const frameConfig = require(frameConfigPath(frame));
    const compiler = webpack(merge(WebpackDevelopConfig, frameConfig));
    const devServerOptions = {...WebpackDevelopConfig["devServer"]};
    const webpackServer = new WebpackDevServer(devServerOptions, compiler);

    webpackServer.startCallback(async (err) => {
      if (err) {
        console.log(err);
      }

      console.log(
        // merge(webpackDevelop, frameConfig),
        "\n",
        colors.blue(`您运行的代理环境是：${env}，技术框架是：${frame}。`),
        "\n",
        "\n",
        colors.green(`现在您可以打开地址访问您的应用了！`),
        "\n"
      );
    });

  } catch (err) {
    if (err.isTtyError) {
      // Prompt couldn't be rendered in the current environment
      throw Error(colors.red("Prompt couldn't be rendered in the current environment: " + err));
    } else {
      // Something else went wrong
      throw Error(colors.red("Something else went wrong: " + err));
    }
  }
};
webpackRun();
