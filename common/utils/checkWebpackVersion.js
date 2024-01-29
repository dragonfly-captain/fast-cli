const fs = require('fs');
const { execSync } = require('child_process');
const axios = require('axios');

function checkAndUpdateDependency(dependencyName) {
  console.log(`开始检查${dependencyName}的版本是否为最新以来...`);
  return new Promise(async (resolve,reject)=>{
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
    const currentVersion = packageJson.dependencies[dependencyName];

    try {
      // 获取最新版本
      const response = await axios.get(`https://registry.npmjs.org/${dependencyName}`);
      const latestVersion = response.data['dist-tags'].latest;

      if (currentVersion !== latestVersion) {
        console.log(`Updating ${dependencyName} from ${currentVersion} to ${latestVersion}`);
        execSync(`npm install ${dependencyName}@${latestVersion}`, { stdio: 'inherit' });
      } else {
        console.log(`${dependencyName} is already at the latest version (${latestVersion})`);
      }
      resolve();
    } catch (error) {
      console.error(`An error occurred while checking/updating ${dependencyName}: ${error.message}`);
      reject();
    }
  });
}

module.exports = {
  checkAndUpdateDependency
};