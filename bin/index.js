#! /usr/bin/env node

const {program} = require('commander');
const inquirer = require("inquirer");
const path = require('path');
const {setGlobal, getGlobal, getclipath, getpropath, pathJoin} = require("../common/utils/path");
const package = require('../package.json');
const {commandLineInterface} = require("../common/utils");
const {toCommanderLineInterfaceBuild, toCommanderLineInterfaceDevelop} = require("../lib/create");

// 项目启动开发
program.command('start').description('启动一个https协议的项目')
  .option('-f, --frame <frame>', '框架 (react、vue) ')
  .option('-e, --env <env>', '依赖环境')
  .action(async (options, cmd) => {
    const customArg = cmd.args.join(' ')
    toCommanderLineInterfaceDevelop(customArg)
  });

// 打包构建项目
program.command('build').description('构建项目')
  .option('-f, --frame <frame>', '框架 (react、vue) ')
  .option('-a, --appname <appname>', '项目名称')
  .option('-e, --env <env>', '依赖环境')
  .action(async (options, cmd) => {
    const customArg = cmd.args.join(' ')
    toCommanderLineInterfaceBuild(customArg)
  });

// 性能监控
program.command('performance').description('性能检查');

// 解析命令行参数，作语法分析
program.parse(process.argv);

