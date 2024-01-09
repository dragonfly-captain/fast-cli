const { ModuleFederationPlugin } = require('webpack').container;
const { HotModuleReplacementPlugin } = require('webpack');
// const ExternalTemplateRemotesPlugin = require("external-remotes-plugin");

const { getclipath, pathJoin, getGlobal } = require("../../common/utils/path");
const { getwebpropath } = require('./utils');
const { mergeAlias, mergePort, mergeProxy, mergePlugins } = require("./utils/customMergeConfig");
const isProduction = getGlobal("isProduction");
const appname = getGlobal("appname");    // 当前项目
const frame = getGlobal("frame");        // 当前框架

const webMicroPath = pathJoin(`../../../m.config`, process.env.PWD);
const microConfig = require(webMicroPath);

const webpackMicroConfig = {
  base: {
    entry: microConfig?.base?.entry,
    resolve: {
      // import 或 require 的引用模块的别名，就是为了让你模块引入变得更简单。
      alias: mergeAlias({}, microConfig?.base?.alias)
    },
    plugins: []
  },
  dev: {
    devServer: {
      port: mergePort(microConfig?.dev?.port),
      proxy: mergeProxy({}, microConfig?.dev?.proxyTable),
      server: microConfig?.dev?.server,
      open: microConfig?.dev?.open,
      hot: microConfig?.dev?.hot ?? true
    }
  },
  build: {}
};

if (microConfig?.base?.mfp) {
  if (microConfig?.base?.mfp?.length) {
    microConfig?.base?.mfp.map(itemOptions => {
      webpackMicroConfig.base.plugins.push(
        new ModuleFederationPlugin(itemOptions)
      );
    });
    webpackMicroConfig.base.plugins.push(
      // 热加载
      new HotModuleReplacementPlugin()
    );
  }
}

module.exports = webpackMicroConfig;
