const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const semver = require('semver');
const { responseFormat, executeCommand, installPackage } = require('./index');
const { mlog } = require('./logWithLineInfo');
const { pathJoin, getpropath } = require('./path');

/**
 * 检查global的依赖版本
 */
function checkVersion(command, expectedVersion) {
  return new Promise((resolve, reject) => {
    executeCommand(
      command, `--version`
    ).then((resp) => {
      let stdout = resp.data.stdout;
      const actualVersion = stdout.trim();  // 获得当前安装版本的信息
      if (!semver.eq(actualVersion, expectedVersion)) {
        return resolve(
          responseFormat({
            code: 4030,
            message: `${command} 的版本 (${actualVersion}) 不符合要求的版本 (${expectedVersion})。`,
            data: {
              command,
              expectedVersion
            }
          })
        )
      }

      resolve(
        responseFormat({
          code: 200,
          success: true,
          message: `${command} 的版本 (${actualVersion}) 满足要求。`,
          data: {
            command,
            expectedVersion
          }
        })
      );
    }).catch(err => {
      if (err) {
        return reject(
          responseFormat({
            code: 4010,
            message: `未安装 ${command}。`,
            data: {
              command,
              expectedVersion
            }
          })
        )
      }
    });

    // exec(`${command} --version`, (err, stdout, stderr) => {
    //   if (err) {
    //     return reject(
    //       responseFormat({
    //         code: 4000,
    //         message: `未安装 ${command}。`,
    //         data: {
    //           command,
    //           expectedVersion
    //         }
    //       })
    //     )
    //   }
    //   const actualVersion = stdout.trim();  // 获得当前安装版本的信息
    //   // console.log(semver.lt, actualVersion.replace(/(v)+/g, ""), expectedVersion, semver.eq(actualVersion.replace(/(v)+/g, ""), expectedVersion));
    //   if (!semver.eq(actualVersion, expectedVersion)) {
    //     return reject(
    //       responseFormat({
    //         code: 4003,
    //         message: `${command} 的版本 (${actualVersion}) 不符合要求的版本 (${expectedVersion})。`,
    //         data: {
    //           command,
    //           expectedVersion
    //         }
    //       })
    //     )
    //   }
    //   resolve(
    //     responseFormat({
    //       code: 200,
    //       success: true,
    //       message: `${command} 的版本 (${actualVersion}) 满足要求。`,
    //       data: {
    //         command,
    //         expectedVersion
    //       }
    //     })
    //   );
    // });
  });
};

// 检查package的依赖版本
function checkPkgVersion(pkgname, expectedVersion = "", command = "pnpm") {
  return new Promise((resolve, reject) => {
    executeCommand(
      command, `list ${pkgname}`
    ).then(resp => {
      let { stdout } = resp.data;
      console.log('expectedVersion', stdout, pkgname, expectedVersion);
      // 没有安装依赖包
      if (!stdout) {
        // console.log('没有安装依赖包', command, `add ${pkgname}@${expectedVersion} -D`);
        // 包没有安装，执行安装操作
        installPackage(command, `add ${pkgname}@${expectedVersion} -D`, pkgname).then(resp => {
          if (resp.code === 200) {
            resolve(resp)
          }
        }).catch(reject);
      } else {
        // 提取版本号
        const matchPackage = stdout.match(new RegExp(`(?<=(${pkgname})( |))[\\d\\.]+`, "gi"));
        if (!!matchPackage) {
          // 提取当前版本
          const currentVersion = matchPackage[0];
          console.log('已经安装对应的版本了', currentVersion, matchPackage);
          if (!semver.eq(currentVersion, expectedVersion)) {
            // 版本不符合期望，执行升级操作
            installPackage(command, `add ${pkgname}@${expectedVersion} -D`, pkgname).then(resp => {
              if (resp.code === 200) {
                resolve(resp)
              }
            }).catch(reject);
          } else {
            // 版本符合期望
            // resolve();
          }
        }
      }
    }).catch(err => {
      mlog('error', err.message);
      reject(err)
    });
  });
};

// 检查当前目录下有没有指定的文件
function checkFileExists(filename, root = getpropath('.')) {
  // 获取文件的绝对路径
  const filePath = pathJoin(`${filename}`, root);
  // console.log(filePath, filename, fs.existsSync(filePath));
  // 使用fs模块的existsSync方法检查文件是否存在
  return fs.existsSync(filePath);
};

// 检查当前项目下（非cli下）必要文件（checkNecessaryFile）
function checkNecFile(...agrs) {
  return agrs.every(it => {
    return checkFileExists(it)
  });
  // let pack = checkFileExists('package.json');
  // let workspace = checkFileExists('pnpm-workspace.yaml');
  // return pack && workspace;
};

// 检查cli下有没有对应的目录
function checkDirExists(dirname) {
  try {
    fs.accessSync(dirname, fs.constants.F_OK);
    return true;
  } catch (err) {
    return false;
  }
};


module.exports = {
  checkFileExists,
  checkVersion,
  checkPkgVersion,
  checkNecFile,
  checkDirExists
};



// /** 
//  * 包管理器检查包是否安装 - pnpm和npm
// */
// function checkAndInstallPackage(checkPackage, installCommand, packageName) {
//   return new Promise((resolve, reject) => {
//     // 首先，检查包是否已经安装
//     exec(`${checkPackage}`, (err, stdout, stderr) => {
//       let errFn = responseFormat({
//         code: 5000,
//         message: `err 检查包时出错: ${err?.message}。`,
//         data: {}
//       });
//       if (err) {
//         return reject(errFn);
//       }
//       if (stderr) {
//         return reject({
//           ...errFn,
//           message: `stderr 检查包时出错: ${stderr}。`,
//         });
//       }

//       // 如果已经安装，直接解析
//       if (stdout.includes(packageName)) {
//         return resolve(
//           responseFormat({
//             code: 200,
//             success: true,
//             message: `包 ${packageName} 已经安装`,
//             data: {
//               packageName
//             }
//           })
//         );
//       }

//       // 否则，安装包
//       exec(installCommand, (err, stdout, stderr) => {
//         if (err) {
//           return reject({
//             ...errFn,
//             message: `err 安装包时出错: ${err.message}。`
//           })
//         }
//         if (stderr) {
//           return reject({
//             ...errFn,
//             message: `stderr 安装包时出错: ${stderr}。`
//           });
//         }
//         return resolve(
//           responseFormat({
//             code: 200,
//             success: true,
//             message: `包 ${packageName} 已经安装`,
//             data: {
//               packageName
//             }
//           })
//         );
//       });

//     });
//   });
// };
