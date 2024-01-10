const { setGlobal, getGlobal } = require("../../common/utils/path");

// 设置全局路径别名
setGlobal("cwd", process.cwd());
setGlobal("isProduction", process.env.NODE_ENV === "production");
setGlobal("crootdir", process.cwd());
setGlobal("webproroot", `${process.env.$cwd}`);
// 全局注册方法
setGlobal("crootweb", {
  ...require("../../common/utils/path")
});

module.exports = {
  "cwd": getGlobal("cwd"),
  "isProduction": getGlobal("isProduction")
};


