const { ModuleFederationPlugin } = require('webpack').container;
const { HotModuleReplacementPlugin } = require('webpack');

const { pathJoin, getGlobal, execPtah } = require("./utils/path");
const { mergeAlias, mergePort, mergeProxy } = require("./utils/customMergeConfig");

const webMicroPath = pathJoin(`./m.config`, execPtah());
const microConfig = require(webMicroPath);

const webpackMicroConfig = {
  assetsPath: microConfig?.assetsPath ?? 'webStatic',
  base: {
    entry: microConfig?.base?.entry,
    resolve: {
      // import 或 require 的引用模块的别名，就是为了让你模块引入变得更简单。
      alias: mergeAlias({}, microConfig?.base?.alias)
    },
    plugins: [] // microConfig?.base?.plugins ?? []
  },
  dev: {
    devServer: {
      port: mergePort(microConfig?.dev?.port),
      proxy: mergeProxy({}, microConfig?.dev?.proxyTable),
      historyApiFallback: configHistoryApiFallback(),
      server: microConfig?.dev?.server,
      open: microConfig?.dev?.open,
      hot: microConfig?.dev?.hot ?? true
    },
    module: {
      rules: microConfig?.dev?.rules ?? []
    },
    plugins: microConfig?.dev?.plugins ?? []
  },
  build: {
    // module: {
    //   rules: microConfig?.pro?.rules ?? []
    // }
  }
};

if (microConfig?.base?.mfp?.length && Array.isArray(microConfig?.base?.mfp)) {
  microConfig.base.mfp.map(itemOptions => {
    webpackMicroConfig.base.plugins.push(
      new ModuleFederationPlugin(itemOptions)
    );
  });
  webpackMicroConfig.dev.plugins.push(
    // 热加载
    new HotModuleReplacementPlugin()
  );
}

module.exports = webpackMicroConfig;


function configHistoryApiFallback() {
  return mergeProxy({}, microConfig?.dev?.historyApiFallback) ?? {
    // disableDotRule: true, // 启用 disableDotRule 可以确保所有的前端路由请求，即使它们的 URL 包含点，都被正确地重定向到 index.html。这对于某些具有特殊 URL 结构的 SPA 尤其重要。
    // 通过提供一个对象，这种行为可以通过像 rewrites 这样的配置项进一步控制
    rewrites: [
      // 现有的重写规则
      { from: /.*/, to: '/index.html' }  // 定义设置的html目录，定义目标文件，即跳转到指定目录下的index.html
    ]
  }
}