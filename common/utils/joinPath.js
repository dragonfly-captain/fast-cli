const fs = require('fs');
const {getwebpropath} = require('./path');
const {pathJoin, getclipath, getGlobal} = require('./path');


function frameConfigPath() {
  return pathJoin(`./config/${getGlobal('frame')}/index`, getclipath('.'));
}

// r
function resolveIndexHtml() {
  const projectIndexHTMLPath = pathJoin(`../../public`, process.env.PWD);
  const projectIndexHTML = pathJoin(`../../public/index.html`, process.env.PWD);

  if (fs.existsSync(projectIndexHTMLPath) && fs.existsSync(projectIndexHTML)) {
    return projectIndexHTML;
  }
  if (!fs.existsSync(projectIndexHTMLPath)) {
    throw `项目中缺少 public 文件夹。`;
  }
  if (!fs.existsSync(projectIndexHTMLPath)) {
    throw `项目/public 中缺少 index.html 文件。`;
  }
};

function resolveAppnameDir(appname) {
  return pathJoin(`${appname}`, process.cwd());
};

function resolveClientShare() {
  return pathJoin(`shared`, getwebpropath('.'));
};

function resolveReactFrame() {
  return pathJoin(`node_modules/.pnpm/react-dom@18.2.0_react@18.2.0`, getclipath('./'))
}

module.exports = {
  resolveIndexHtml, resolveAppnameDir, resolveClientShare, resolveReactFrame, frameConfigPath
};
