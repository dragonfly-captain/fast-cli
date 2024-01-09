const fs = require('fs');
const path = require('path');
const fspromises = require('fs').promises;
const { exec } = require('child_process');
// const os = require('os');

function checkDirectoryExists(directoryPath) {
  try {
    // 使用 fs.statSync 检查目录是否存在
    fs.statSync(directoryPath);
    return true;
  } catch (err) {
    if (err.code === 'ENOENT') {
      return false;
    } else {
      throw err;
    }
  }
};

async function writeToFolder(filePath, content, createPath = false) {
  const dirPath = path.dirname(filePath);
  try {
    await fspromises.access(dirPath);
  } catch (error) {
    if (createPath) {
      await fspromises.mkdir(dirPath, { recursive: true });
    } else {
      throw new Error(`Directory does not exist: ${dirPath}`);
    }
  }

  // Write the file
  await fspromises.writeFile(filePath, content, {
    encoding: 'utf8',
    flag: 'w',
    mode: 438,
  });
};

function changePermissions(path, isWin) {
  return new Promise((resolve, reject) => {
    // Check the platform
    isWin().then((stat) => {
      if (stat) {
        // Windows
        exec(`icacls "${path}" /grant Everyone:(OI)(CI)F /T`, (error, stdout, stderr) => {
          if (error) {
            console.log(`Error icacls: ${error}`);
            reject(error);
          }
          // console.log(`Output: ${stdout}`);
          resolve(null);
        });
      } else {
        // Unix or Unix-like (e.g., MacOS, Linux)
        fs.chmod(path, 0o777, (err) => {
          if (err) {
            console.log(`Error chmod: ${err}`);
            reject(err);
          }
          resolve(null);
        });
      }
    })
  });
}

// 文件夹用软链，文件用硬链。
function linkDirectoriesAndFiles(srcPath, destPath) {
  // 确保源路径存在
  if (!fs.existsSync(srcPath)) {
    console.error(`Source path does not exist: ${srcPath}`);
    return;
  }

  // 创建目标路径的父目录，如果不存在的话
  if (!fs.existsSync(destPath)) {
    fs.mkdirSync(destPath, { recursive: true });
  }

  // 遍历源路径中的所有文件和目录
  const items = fs.readdirSync(srcPath);
  for (const item of items) {
    const itemSrcPath = path.join(srcPath, item);
    const itemDestPath = path.join(destPath, item);

    // 判断是文件还是目录
    if (fs.statSync(itemSrcPath).isDirectory()) {
      // 创建目录符号链接
      if (process.platform === 'win32') {
        exec(`mklink /D ${itemDestPath} ${itemSrcPath}`, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error creating directory link: ${error}`);
          } else {
            console.log(`Directory link created: ${stdout}`);
          }
        });
      } else {
        exec(`ln -s ${itemSrcPath} ${itemDestPath}`, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error creating directory link: ${error}`);
          } else {
            console.log(`Directory link created: ${stdout}`);
          }
        });
      }
    } else {
      // 创建文件硬链接
      if (process.platform === 'win32') {
        exec(`mklink /H ${itemDestPath} ${itemSrcPath}`, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error creating file link: ${error}`);
          } else {
            console.log(`File link created: ${stdout}`);
          }
        });
      } else {
        exec(`ln ${itemSrcPath} ${itemDestPath}`, (error, stdout, stderr) => {
          if (error) {
            console.error(`Error creating file link: ${error}`);
          } else {
            console.log(`File link created: ${stdout}`);
          }
        });
      }
    }
  }
}

module.exports = {
  checkDirectoryExists,
  writeToFolder,
  changePermissions,
  linkDirectoriesAndFiles
};