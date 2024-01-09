const shelljs = require('shelljs');
const spawn = require('cross-spawn');
const colors = require('colors');
const { mlog } = require('./logWithLineInfo');

// 基于 child_process spawn 执行的命令
function childProcessSpawn(command, args) {
  return new Promise((resolve, reject) => {
    // 创建一个子进程
    const child = spawn(command, args.split(" "));

    // 从子进程的 stdout 获取数据并打印
    child.stdout.on('data', (data) => {
      data && console.log('[log stdout] ', data.toString());
      resolve(
        responseFormat({
          code: 1020,
          success: false,
          message: "进行中",
          data: {
            stdout: data.toString()
          }
        })
      );
    });

    // 从子进程的 stderr 获取数据并打印
    child.stderr.on('data', (data) => {
      mlog('[log stderr] ', data);
    });

    // 监听子进程的 'close' 事件
    child.on('close', (code) => {
      if (code !== 0) {
        reject(new Error(`command "${command} ${args}" exited with wrong status code "${code}"`));
      } else {
        resolve(
          responseFormat({
            code: 200,
            success: true,
            message: `子进程执行命令已结束，执行命令为${command} ${args}`,
            data: {
              code
            }
          })
        );
      }
    });

    // 监听子进程的 'error' 事件
    child.on('error', (err) => {
      reject(
        responseFormat({
          message: err
        })
      );
    });
  });
};

// 基于 shelljs 执行命令
function shelljsChildProcessSpawn(command, args, hasClear = true) {
  return new Promise((resolve, reject) => {
    shelljs.exec(`${command} ${args}`, {
      env: { ...process.env, $cwd: process.cwd() }
    }, (code, stdout, stderr) => {
      // console.log('Exit code:', code);
      // console.log('Program output:', stdout);
      // console.log('Program stderr:', stderr);
      // console.log(command, args);
      if (stdout) {
        // 清除终端
        hasClear && console.clear();
        // console.log('[log stdout] ', stdout.toString());
        resolve(
          responseFormat({
            code: 1020,
            success: false,
            message: "进行中",
            data: {
              stdout: stdout.toString()
            }
          })
        );
      }
      if (stderr) {
        console.log('[log stderr] ', stderr.toString());
        // resolve();
      }
      if (code !== 0) {
        reject(new Error(`command "${command} ${args}" exited with wrong status code "${code}"`));
        process.exit(1);
      } else {
        resolve(
          responseFormat({
            code: 200,
            success: true,
            message: `子进程执行命令已结束，执行命令为${command} ${args}`,
            data: {
              code
            }
          })
        );
      }
    });
  });
};

// 通过命令行执行命令
function commandLineInterface(cmd, params = [], logs = {}, hasClear = true) {
  console.log(colors.green(`[log info] ${logs.start} \n`));
  return new Promise((resolve, reject) => {
    // 命令行参数
    // const args = params;
    // 创建一个子进程
    const child = spawn(cmd, params, {
      env: { ...process.env, $cwd: process.cwd() }
    });
    // console.log('\n\n\n\n\n\n\n\n\n\n\n\n\n\n');

    // 从子进程的 stdout 获取数据并打印
    child.stdout.on('data', (data) => {
      // 清除终端
      // hasClear && console.clear();
      console.log('[log stdout]', handleOutput(`命令执行中, 日志信息: ${data.toString()}`));
      // console.log(`Heap Used: ${memoryUsage.heapUsed / 1024 / 1024} MB`);
      resolve(
        responseFormat({
          code: 1010,
          success: true
        })
      );
    });

    // 从子进程的 stderr 获取数据并打印
    child.stderr.on('data', (data) => {
      console.log('[log stderr]', handleOutput(`提醒: ${data.toString()}`));
      reject(
        responseFormat({
          code: 4100,
          message: data.toString()
        })
      )
    });

    // 监听子进程的 'close' 事件
    child.on('close', (code) => {
      if (code !== 0) {
        new Error(`command "${cmd} ${params.join("")}" exited with wrong status code "${code}"`);
        process.exit(1);
        // return reject();
      } else {
        console.log('[log close]', colors.green(`${logs.success || ''}`));
        resolve(
          responseFormat({
            code: 200,
            success: true
          })
        );
      }
    });

    // 监听子进程的退出事件
    child.on('exit', (code, signal) => {
      // console.log(`子进程退出, 退出代码: ${code}`);
      // 在这里进行必要的清理操作
      child?.kill();
    });

    // 监听子进程的 'error' 事件
    child.on('error', (err) => {
      console.log('[error log] ', colors.red(err));
      reject(
        responseFormat({
          message: err.message
        })
      )
    });
  });
};

// 返回数据格式
function responseFormat(configs = {}) {
  let options = {
    code: 4000,
    success: false,
    message: '',
    data: {}
  };
  Object.assign(options, configs);

  return options;
}

// 终端输出的文案的颜色设置
function handleOutput(output) {
  const lines = output.split('\n');
  const result = lines.map(line => {
    if (line.startsWith('ERROR in') || line.trim().startsWith('Error') || line.trim().startsWith('Error:')) {
      return colors.red(line);
    }
    if (line.startsWith('WARNING in') || line.trim().startsWith('WARNING') || line.trim().startsWith('WARNING:')) {
      return colors.yellow(line);
    }
    return colors.green(line);
    // if (inErrorBlock === 1) {
    //   if (line.trim() === '') {
    //     inErrorBlock = 0;
    //   }
    //   return colors.red(line);
    // } else {
    //   return colors.green(line);
    // }
  });
  return result.join('\n');
}

module.exports = {
  responseFormat,
  commandLineInterface,
  shelljsChildProcessSpawn,
};
