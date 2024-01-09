const { getGlobal, pathJoin, getpropath } = require("./path");

function getAppnamePath(pathname = "") {
  return pathJoin(`./`, process.env?.$cwd ?? getpropath("."))
}

module.exports = {
  getAppnamePath
}
