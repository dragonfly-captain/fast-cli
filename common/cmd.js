const os = require('os');
const colors = require('colors');

function commandLoggerError(...content) {
  console.error(colors.red(`[日志-异常]：`, ...content));
}
function commandLoggerWarning(...content) {
  console.error(colors.yellow(`[日志-提醒]：`, ...content));
}
function commandLoggerSuccess(...content) {
  console.error(colors.green(`[日志]：`, ...content));
}

function isWin() {
  return Promise.resolve((os.platform() === 'win32'));
}



module.exports = {
  commandLoggerError,
  commandLoggerSuccess,
  commandLoggerWarning,
  isWin,
};
