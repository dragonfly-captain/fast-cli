const t = require('@babel/types');
const { BabelParserSourceCode, BabelTraverseSourceCode, BabelGenerateSourceCode } = require("./utils");

let useStateImported = false;
let useObserveCallCount = 0;
let useStateCallCount = 0;

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
    CallExpression(path) {
      // if (useStateImported && path.node.callee.name === 'useState') {
      //   path.node.callee.name = 'usePrimitiveState';
      // }
      // 检查是否是 `useState` 的调用
      if (path.node.callee.name === 'useState') {
        useStateCallCount++;
      }
      // 检查是否是 `useObserve` 的调用
      if (path.node.callee.name === 'useObserve') {
        useObserveCallCount++;
      }
    }
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

  // console.log('----------', useObserveCallCount);
  if (useObserveCallCount > Math.min(proxyMaxCount,5)) {
    throw new Error(`useObserve is used more than ${proxyMaxCount} times`);
  }

  if (useStateCallCount > Math.min(stateMaxCount, 7)){
    throw new Error(`useState is used more than ${stateMaxCount} times`);
  }

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
  useObserveCallCount = 0;
  useStateCallCount = 0;
};

module.exports = LintCodeLoader;
