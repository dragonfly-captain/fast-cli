const shelljs = require('shelljs');
const { setGlobal, pathJoin } = require("./utils/path");

setGlobal("crootdir", pathJoin('..', __dirname));
setGlobal("prodir", process.cwd());

shelljs.config.silent = false;