const { getGlobal } = require("../../common/utils/path");
/**
 * 安装 eslint 依赖包：pnpm install eslint eslint-plugin-react eslint-plugin-react-hooks -D -w
 */
let isProduction = getGlobal('isProduction');

module.exports = {
  parser: "babel-eslint",
  parserOptions: {
    ecmaVersion: 2021, // 设置为你的 ECMAScript 版本
    sourceType: 'module', // 允许使用 import/export 语法
    "ecmaFeatures": {
      "jsx": true
    }
  },
  env: {
    browser: true,
    es2021: true, // 启用 ES2021 全局变量
    node: true, // 如果在 Node.js 环境中使用，根据需求调整
  },
  ignorePatterns: ['*.less'],
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
  ],
  plugins: ["import", "react", "react-hooks", "babel"],
  /**
   * 参考 - https://cloud.tencent.com/developer/section/1135822
   * 参考 - https://segmentfault.com/a/1190000024509889
   * 参考 - https://juejin.cn/post/7231118884860870711/
   * 0: 关闭规则
   * 1: 警告
   * 2: 打开规则
  */
  rules: {
    "no-undef": 1,													// 检查是否有未定义的变量，不能有未定义的变量
    "quotes": 0,  													// 2,"single": 单引号
    "no-extra-semi": 2,  										// 2,"always": 必须在语句结尾写上分号
    "prefer-promise-reject-errors": 0,  		// 要求使用 Promise.reject() 抛出错误，0表示关闭该规则
    "space-before-function-paren": 0,   		// 函数括号前不缺少空格
    "no-extra-boolean-cast": 1, 						// 不必要的布尔转换
    // "no-console": isProduction ? 2 : 0,	// 生产阶段禁止出现 console
    "no-console": 0,			                  // 生产阶段禁止出现 console
    "no-debugger": isProduction ? 2 : 1,		// 生产阶段禁止出现 debugger 关键字，开发阶段预先警告出现debugger
    "no-prototype-builtins": 0, 						// 在代码中存在访问 Object.prototype 上的方法
    "no-proto": 2, 													// 禁止使用__proto__属性
    "no-var": 2,  													// 禁用var，用let和const代替
    "no-unused-var": 0,		 									// 声明但没使用到的变量
    "no-empty": 2,  												// 禁止空块语句
    "no-unused-vars": 1,                    // 禁止存在未使用的变量
    "max-params": [2, 5], 									// 函数参数过多, 注意可以使用对象传参，调整为3-5比较整洁一些，如果考虑项目有历史代码，可以往大了调整
    "max-nested-callbacks": [2, 3],			 		// 最大回调深度 为3层
    "for-direction": 2,	 										// 避免条件永远无法到达的循环
    "no-unneeded-ternary": 2,               // 禁止不必要的嵌套，var isYes = answer === 1 ? true : false;
    "react/react-in-jsx-scope": 0,   // 则确保 JSX 中使用的变量已经被定义和导入。在 React 17 以后，不再需要导入 React 来使用 JSX。
    "react/jsx-uses-react": 0,       // 规则防止 React 被错误地标记为未使用。
    "react-hooks/rules-of-hooks": 2, // 检查 React Hooks 的使用规则是否正确，此规则确保 Hooks 在顶层被调用，而不是在循环、条件或嵌套函数中。
    "react-hooks/exhaustive-deps": 0, // 检查 Effect 的依赖数组，并确保你的 Effect 使用所有依赖的值，这有助于确保你的组件按预期工作
    "react/display-name": 0,
    "react/prop-types": 0
  },
  settings: {
    react: {
      version: 'detect'
    }
  },
  // 针对 LESS 文件的配置
  overrides: [
    {
      files: ['**/*.less'],
      rules: {
        'no-unused-vars': 'off', // 禁用未使用变量的检查
      },
    }
  ],
}
