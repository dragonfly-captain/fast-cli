const { getGlobal } = require("../common/utils/path");
const cwd = getGlobal('cwd');
const frame = getGlobal('frame');
// const skip = process.env.npm_config.skip;

// if (process.env.npm_lifecycle_script.indexOf("/")) {}
if (!frame && !skip) {
  throw new Error(".eslintrc.js >>>>>>>>>> 缺少必要参数或者参数输入不正确，请参考--frame=<frame>");
}
var path = `${cwd}/config/${frame}/eslint.config.js`;
const config = require(path);
// console.log(cwd, $Frame, config);

const eslintConfig = {
  root: true
};
module.exports = Object.assign(eslintConfig, config);
