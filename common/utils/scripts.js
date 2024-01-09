const { getGlobal, pathJoin, getpropath } = require("./path");

function getAppnamePath(pathname = "") {
  // return pathJoin(`apps/${getGlobal('frame')}/${getGlobal('appname')}/${pathname}`, process.env?.$cwd ?? getpropath("."))
  return pathJoin(`./`, process.env?.$cwd ?? getpropath("."))
}

module.exports = {
  getAppnamePath
}
