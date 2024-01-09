const fs = require('fs');

// 检查cli下有没有对应的目录
function checkDirExists(dirname) {
  try {
    fs.accessSync(dirname, fs.constants.F_OK);
    return true;
  } catch (err) {
    return false;
  }
}

module.exports = {
  checkDirExists
};
