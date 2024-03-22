const fs = require('fs');
const { execSync, spawn } = require('child_process');
const axios = require('axios');

function checkAndUpdateDependency(dependencyName = "crootfast-webpack") {
  console.log(`开始检查${dependencyName}的版本是否为最新依赖...`);
  // return new Promise(async (resolve, reject) => {
  //   const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
  //   const currentVersion = packageJson.dependencies[dependencyName]?.replace(/(\^)+/gi, "");

  //   try {
  //     // 获取最新版本
  //     const response = await axios.get(`https://registry.npmmirror.com/${dependencyName}`);
  //     const latestVersion = response.data['dist-tags'].latest;

  //     if (currentVersion !== latestVersion) {
  //       console.log(`Updating ${dependencyName} from ${currentVersion} to ${latestVersion}`);
  //       // runProcessTimeout(`npm install ${dependencyName}@${latestVersion} -D`);
  //     } else {
  //       console.log(`${dependencyName} is already at the latest version (${latestVersion})`);
  //     }
  //     resolve();
  //   } catch (error) {
  //     console.error(`An error occurred while checking/updating ${dependencyName}: ${error.message}`);
  //     reject();
  //   }
  // });
}

module.exports = {
  checkAndUpdateDependency
};
