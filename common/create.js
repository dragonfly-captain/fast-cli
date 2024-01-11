const path = require('path');
const { commandLineInterface, shelljsChildProcessSpawn } = require('./utils');
const { checkDirExists } = require('./utils/checkers');
const { pathJoin } = require('./utils/path');
const { commandLoggerError, commandLoggerWarning, commandLoggerSuccess, isWin } = require('./cmd');

// 启动项目进行开发
async function toCommanderLineInterfaceDevelop(customArg) {
  return isWin().then(async (stat) => {
    let webPack = path.join(process.cwd(), 'node_modules/crootfast-webpack');
    const script = `${webPack} && node ./scripts/run.js ${customArg}`
    if (stat) {
      await shelljsChildProcessSpawn('cd', `/d ${script}`);
    } else {
      await commandLineInterface('bash', ['-c', `cd  ${script}`], {
        start: `正在通过脚手架启动项目...`
      }, !0);
    }
  })
}

// 打包构建项目
async function toCommanderLineInterfaceBuild(customArg) {
  let webPack = path.join(process.cwd(), 'node_modules/crootfast-webpack');
  if (checkDirExists(pathJoin('.', webPack))) {
    return isWin().then(async (stat) => {
      const script = `${webPack} && node ./scripts/build.js ${customArg}`
      if (stat) {
        await shelljsChildProcessSpawn('cd', `/d ${script}`);  //  && move ${webPack}/dist ${webpro}
      } else {
        //  && mv ${webPack}/dist ${webpro}
        await commandLineInterface('bash', ['-c', `cd ${script}`], {
          start: `正在通过脚手架启动项目...`
        }, !1);
      }
    })
  } else {
    commandLoggerError("目录出现异常，请检查。");
    process.exit(1);
  }
};

module.exports = {
  toCommanderLineInterfaceDevelop,
  toCommanderLineInterfaceBuild,
};
