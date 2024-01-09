const path = require('path')

function logWithLineInfo(...message) {
  const stackInfo = getStackInfo(2);  // 我们需要跳过两级堆栈：Error对象的构造和这个函数本身
  if (stackInfo) {
    const calleeStr = `(${stackInfo.relativePath}:${stackInfo.line})`;
    console.log(`${calleeStr}: `, ...message);
  } else {
    console.log(message);
  }
}

function getStackInfo(stackIndex) {
  const stacklist = (new Error()).stack.split('\n').slice(3);

  const stackReg = /at\s+(.*)\s+\((.*):(\d*):(\d*)\)/gi;
  const stackReg2 = /at\s+()(.*):(\d*):(\d*)/gi;

  const s = stacklist[stackIndex] || stacklist[0];
  const sp = stackReg.exec(s) || stackReg2.exec(s);

  if (sp && sp.length === 5) {
    return {
      method: sp[1],
      relativePath: path.relative(process.cwd(), sp[2]),
      line: sp[3],
      pos: sp[4],
      file: path.basename(sp[2]),
      stack: stacklist.join('\n')
    };
  }
}

module.exports = {
  mlog: logWithLineInfo
}