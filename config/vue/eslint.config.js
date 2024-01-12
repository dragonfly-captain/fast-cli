/**
 * 安装 eslint 依赖包：pnpm install eslint eslint-plugin-vue -D -w
 */
const {getGlobal} = require("../../common/utils/path");

let isProduction = getGlobal('isProduction');

module.exports = {
  root: true,
  // parser: "@babel/eslint-parser",
  parser: "vue-eslint-parser",
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: "module",
    parser: "@babel/eslint-parser"
  },
  env: {
    browser: true,
    es6: true,
    es2021: true
  },
  extends: [
    "eslint:recommended",
    "plugin:vue/vue3-recommended"
  ],
  plugins: ["vue"],
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
    "no-extra-semi": 0,  										// 2,"always": 必须在语句结尾写上分号
    "prefer-promise-reject-errors": 0,  		// 要求使用 Promise.reject() 抛出错误，0表示关闭该规则
    "space-before-function-paren": 0,   		// 函数括号前不缺少空格
    "no-extra-boolean-cast": 1, 						// 不必要的布尔转换
    "no-console": isProduction ? 2 : 0,			// 生产阶段禁止出现 console
    "no-debugger": isProduction ? 2 : 1,		// 生产阶段禁止出现 debugger 关键字，开发阶段预先警告出现debugger
    "no-prototype-builtins": 0, 						// 在代码中存在访问 Object.prototype 上的方法
    "no-proto": 2, 													// 禁止使用__proto__属性
    "no-var": 2,  													// 禁用var，用let和const代替
    "no-unused-var": 0,		 									// 声明但没使用到的变量
    "no-empty": 2,  												// 禁止空块语句
    "no-unused-vars": isProduction ? 2 : 0, // 禁止存在未使用的变量
    "max-params": [2, 5], 									// 函数参数过多, 注意可以使用对象传参，调整为3-5比较整洁一些，如果考虑项目有历史代码，可以往大了调整
    "max-nested-callbacks": [2, 3],			 		// 最大回调深度 为3层
    "for-direction": 2,	 										// 避免条件永远无法到达的循环
    "no-unneeded-ternary": 2,               // 禁止不必要的嵌套，var isYes = answer === 1 ? true : false;

    // 这里可以根据自己的需求针对 react 进行配置
    'vue/singleline-html-element-content-newline': 0, // 禁用单行元素内容换行规则
    'vue/multiline-html-element-content-newline': 0, // 禁用多行元素内容换行规则
    'vue/require-default-prop': 0, // 禁用默认 prop 要求规则
    'vue/require-prop-types': 0, // 禁用 prop 类型要求规则
    'vue/no-v-html': 0, // 允许使用 v-html
    'vue/attributes-order': 0, // 禁用属性顺序规则
    'vue/component-tags-order': [
      'error', {
        order: ['template', 'script', 'style']
      }
    ]
  },
  settings: {
    react: {
      version: "detect"
    }
  }
}
