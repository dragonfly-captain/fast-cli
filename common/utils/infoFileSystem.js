const fs = require('fs');
const path = require('path');

// 遍历指定目录并返回所有子目录的完整路径
function getSubdirectories(dir) {
  if (!dir) {
    throw 'dir参数不能为空';
  }
  // 读取目录中的所有文件和文件夹
  const items = fs.readdirSync(dir);

  // 过滤出文件夹并返回它们的完整路径
  const subdirs = items
    .map(item => path.join(dir, item))  // 获取完整路径
    .filter(item => fs.statSync(item).isDirectory());  // 过滤出文件夹

  return subdirs;
}

module.exports = {
  getSubdirectories
};