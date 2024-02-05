const path = require('path');
const os = require('os');

function pathJoin(pathname = "", rootPath = process.cwd()) {
  return path.join(rootPath, ...pathname.split("/")); // path.posix.join
}

// 执行路径
function execPtah(pathname = "") {
  return process.cwd()
}

// 当前文件路径
function dirnamePtah(pathname = "") {
  return path.join(__dirname, '../../')
}

// 从当前命令行路径开始查找
function execRootPath(pathname = "") {
  return path.join(process.cwd(), pathname);
}

function setGlobal(key, value) {
  global[`$${key}`] = value;
}

function getGlobal(key) {
  return global[`$${key}`];
}

// 返回本机IP地址
function getLocalAddressIP() {
  let interfaces = os.networkInterfaces();
  let resultIP = "";
  for (var devName in interfaces) {
    var iface = interfaces[devName];
    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal) {
        resultIP = alias.address;
      }
    }
  }
  return resultIP;
}

function getclipath(pathname) {
  let dir = process.cwd() || '';
  return path.join(dir, pathname);
}

function getwebpropath() {
  return path.join(process.cwd(), '../../');
};

function getBaseName(pathname) {
  return path.basename(pathname);
}

module.exports = {
  pathJoin,
  setGlobal,
  getGlobal,
  getLocalAddressIP,
  getclipath,
  getBaseName,
  getwebpropath,
  execPtah,
  execRootPath,
  dirnamePtah
};
