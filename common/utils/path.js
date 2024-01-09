const path = require('path');
const os = require('os');

function pathJoin(pathname = "", rootPath = process.cwd()) {
  return path.join(rootPath, ...pathname.split("/")); // path.posix.join
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
  // let dir = getGlobal('crootdir') ?? '';
  let dir = process.cwd() || '';
  return path.join(dir, pathname);
}

function getpropath(pathname) {
  let dir = getGlobal('prodir') || '';
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
  getpropath,
  getBaseName,
  getwebpropath
};
