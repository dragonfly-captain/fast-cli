const { getGlobal, pathJoin, dirnamePtah} = require("./common/utils/path");
const cwd = getGlobal('cwd');
const frame = getGlobal('frame') || process.env.npm_config_frame || 'react';

if (!frame && !skip) {
  throw new Error(".eslintrc.js >>>>>>>>>> 缺少必要参数或者参数输入不正确，请参考--frame=<frame>");
}
const path = pathJoin(`./config/${frame}/eslint.config.js`, dirnamePtah())
const config = require(path);

const eslintConfig = {
  root: true
};
module.exports = Object.assign(eslintConfig, config);
