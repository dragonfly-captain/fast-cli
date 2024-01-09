const { getGlobal, getwebpropath} = require("../common/utils/path");
const cwd = getGlobal('cwd');
const frame = getGlobal('frame');
const {pathJoin} = require("../common/utils/path");

if (!frame) {
  throw new Error("babel.config.js >>>>>>>>>> 缺少必要参数或者参数输入不正确，请参考--frame=<frame>");
}
const path = pathJoin(`/config/${frame}/root.bable.config.js`);
const config = require(path);

module.exports = config;
