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

/**
 * 启动一个子进程并在指定时间后关闭它。
 * @param {string} command 要执行的命令。
 * @param {number} timeout 关闭子进程前等待的时间（毫秒）。
 */
function runProcessTimeout(command, timeout = 5000) {
  let timer;
  // return new Promise((resolve, reject) => {
  // 分割命令以获取基础命令和参数
  const parts = command.split(/\s+/);
  const baseCommand = parts[0];
  const args = parts.slice(1);

  // 使用 spawn 启动子进程
  const subprocess = spawn(baseCommand, args);

  // 监听子进程的 stdout 和 stderr
  subprocess.stdout.on('data', data => {
    console.log(`stdout: ${data}`);
  });

  subprocess.stderr.on('data', data => {
    console.error(`stderr: ${data}`);
  });

  // 设置超时后关闭子进程
  if (timer) {
    clearTimeout(timer);
    timer = undefined;
  }
  timer = setTimeout(() => {
    subprocess.kill(); // 发送 SIGTERM
    console.log(`Subprocess killed after ${timeout} ms`);
    // resolve();
  }, timeout);

  // 监听退出事件
  subprocess.on('close', (code) => {
    console.log(`Child process exited with code ${code}`);
  });
  // })
}

module.exports = {
  checkAndUpdateDependency,
  runProcessTimeout
};
