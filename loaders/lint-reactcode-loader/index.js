const t = require('@babel/types');
const { BabelParserSourceCode, BabelTraverseSourceCode, BabelGenerateSourceCode } = require("./utils");

let useStateImported = false;
// let useObserveCallCount = 0;
// let useStateCallCount = 0;

function LintCodeLoader(source) {
  const { hookPath, proxyMaxCount = 5, stateMaxCount = 7 } = this.getOptions();
  const asyncCallback = this.async();

  const AST = BabelParserSourceCode(source);
  BabelTraverseSourceCode(AST, {
    ImportDeclaration(path) {
      if (path.node.source.value === 'react') {
        const specifiers = path.node.specifiers;
        const useStateSpecifierIndex = specifiers.findIndex(
          specifier => specifier.imported && specifier.imported.name === 'useState'
        );

        if (useStateSpecifierIndex !== -1) {
          useStateImported = true;
          specifiers.splice(useStateSpecifierIndex, 1); // 删除 useState 导入

          // 如果没有其他导入的绑定，删除整个 import 语句
          if (specifiers.length === 0) {
            path.remove();
          }
        }
      }
    },
    // 当进入新的函数或函数式组件时
    Function(path) {
      let useStateCount = 0;
      let useObserveCount = 0;

      path.traverse({
        // 在函数或组件内部遍历 CallExpression
        CallExpression(innerPath) {
          const calleeName = innerPath.node.callee.name;
          if (calleeName === 'useState') {
            useStateCount++;
          }
          if (calleeName === 'useObserve') {
            useObserveCount++;
          }
          // 检查是否是 `useState` 的调用
          if (useStateCount > Math.min(stateMaxCount, 7)) {
            // useObserveCallCount = useStateCount;
            throw new Error(`useState is used more than ${stateMaxCount} times`);
          }
          // 检查是否是 `useObserve` 的调用
          if (useObserveCount > Math.min(proxyMaxCount, 3)) {
            // useStateCallCount = useObserveCount;
            throw new Error(`useObserve is used more than ${proxyMaxCount} times`);
          }
        }
      });
      // console.log('================', useStateCount, useObserveCount);
    },
    // 匹配函数声明
    FunctionDeclaration(path) {
      inspectFunction(path);
    },
    // 匹配箭头函数
    ArrowFunctionExpression(path) {
      if (t.isVariableDeclarator(path.parent)) {
        inspectFunction(path);
      }
    },
    // 匹配函数表达式
    FunctionExpression(path) {
      inspectFunction(path);
    }
    // CallExpression(path) {
    //   // if (useStateImported && path.node.callee.name === 'useState') {
    //   //   path.node.callee.name = 'usePrimitiveState';
    //   // }
    //   // 检查是否是 `useState` 的调用
    //   if (path.node.callee.name === 'useState') {
    //     useStateCallCount++;
    //   }
    //   // 检查是否是 `useObserve` 的调用
    //   if (path.node.callee.name === 'useObserve') {
    //     useObserveCallCount++;
    //   }
    // }
  });

  if (useStateImported) {
    // 添加新的导入语句
    const newImport = t.importDeclaration(
      // [
      //   t.importDefaultSpecifier(t.identifier('usePrimitiveState'))
      // ],
      [t.importSpecifier(t.identifier('useState'), t.identifier('usePrimitiveState'))],
      t.stringLiteral(hookPath)
    );
    AST.program.body.unshift(newImport);
  }

  // console.log('----------', useObserveCallCount, useStateCallCount);
  // if (useObserveCallCount > Math.min(proxyMaxCount, 3)) {
  //   throw new Error(`useObserve is used more than ${proxyMaxCount} times`);
  // }

  // if (useStateCallCount > Math.min(stateMaxCount, 7)) {
  //   throw new Error(`useState is used more than ${stateMaxCount} times`);
  // }

  const outputCode = BabelGenerateSourceCode(AST, {}, source);

  // console.log('query', source);
  // console.log('outputCode', outputCode.code);

  asyncCallback(null, outputCode.code);
};

/** 
 * 方法的执行时机是在请求的资源被加载之前
 * @param {string} filePath 请求的资源路径 (remainingRequest)
 * @param {string} loaderPath 之前链中的 loader 路径 (precedingRequest)
 * @param {string} data loader本身的数据对象 (data)
 * 
*/
LintCodeLoader.pitch = function (filePath, loaderPath, data) {
  // console.log('---------- pitch function')
  useStateImported = false;
  // useObserveCallCount = 0;
  // useStateCallCount = 0;
};

function inspectFunction(path) {
  let hasJSX = false;
  let hasHooks = false;

  path.traverse({
    JSXElement() {
      hasJSX = true;
    },
    CallExpression(innerPath) {
      const calleeName = innerPath.node.callee.name;
      if (['useState', 'useEffect', 'useContext', 'useReducer', 'useObserve', 'useRef', 'useMemo', 'useCallback'].includes(calleeName)) {
        hasHooks = true;
      }
    },
    ReturnStatement(returnPath) {
      if (t.isJSXElement(returnPath.node.argument) || t.isJSXFragment(returnPath.node.argument)) {
        hasJSX = true;
      }
    }
  });

  if (!(hasJSX || hasHooks)) {
    // throw new Error(`not component or hook detected`);
    // 这里可以添加您的处理逻辑
  }
}

module.exports = LintCodeLoader;
