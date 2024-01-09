// 合并 resolve.alias 配置
function mergeAlias(source, config = {}) {
  return Object.assign(source, config);
};

// 合并 module.rules 的配置
function mergeRules(source = [], config = []) {
  return source.concat(config);
};

// 合并 module.plugins 的配置
function mergePlugins(source = [], config = []) {
  return source.concat(config);
};

function mergePort(portValue = "auto") {
  return portValue;
};
function mergeProxy(source, config) {
  return Object.assign(source, config);
};


module.exports = {
  mergeAlias,
  mergeRules,
  mergePlugins,
  mergePort,
  mergeProxy
};