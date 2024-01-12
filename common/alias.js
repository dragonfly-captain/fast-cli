const { setGlobal, getGlobal } = require("./utils/path");

// 设置全局路径别名
setGlobal("cwd", process.cwd());

process.argv.slice(2).forEach(it => {
  const [key, value] = it.split('=')
  const _key = key.replace(/-/g, '')
  setGlobal(_key, value);
})

setGlobal("isProduction", getGlobal('env') === "prod");

module.exports = {
  "cwd": getGlobal("cwd"),
  "isProduction": getGlobal("isProduction")
};


