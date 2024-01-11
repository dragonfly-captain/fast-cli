const { setGlobal, getGlobal } = require("./utils/path");

// 设置全局路径别名
setGlobal("cwd", process.cwd());
setGlobal("isProduction", process.env.NODE_ENV === "production");

module.exports = {
  "cwd": getGlobal("cwd"),
  "isProduction": getGlobal("isProduction")
};


