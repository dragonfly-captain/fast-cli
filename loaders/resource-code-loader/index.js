/**
 * 返回“源代码”。
*/
const t = require('@babel/types');
const { cloneDeep } = require('lodash');

const { BabelParserSourceCode, BabelTraverseSourceCode, BabelGenerateSourceCode } = require("./utils");

let defaultExportName = null;
let interfacePath = null;
function ReactResourceCodeLoader(source) {
  // const { hookPath, proxyMaxCount = 5, stateMaxCount = 7 } = this.getOptions();
  const asyncCallback = this.async();
  // console.log("ReactResourceCodeLoader", source);

  const AST = BabelParserSourceCode(source);
  // 克隆原始 AST
  const clonedAST = cloneDeep(AST);
  BabelTraverseSourceCode(clonedAST, {
    ExportDefaultDeclaration(path) {
      // // 检查是否是函数声明或函数表达式
      // if (t.isFunctionDeclaration(path.node.declaration) || t.isFunctionExpression(path.node.declaration)) {
      //   // 获取默认导出的函数名称
      //   defaultExportName = path.node.declaration.id ? path.node.declaration.id.name : null;
      //   console.log('ExportDefaultDeclaration', defaultExportName);
      // }
      if (t.isIdentifier(path.node.declaration)) {
        // 对于直接导出的标识符（如函数名、类名等）
        defaultExportName = path.node.declaration.name;
      } else if (t.isFunctionDeclaration(path.node.declaration) || t.isFunctionExpression(path.node.declaration)) {
        // 对于函数声明或函数表达式（包括匿名函数）
        defaultExportName = path.node.declaration.id ? path.node.declaration.id.name : null;
      }
    },
    AssignmentExpression(path) {
      // 临时移除 Interface 相关节点
      const left = path.node.left;
      if (left.object && left.property && left.object.type === 'Identifier' && left.property.type === 'Identifier') {
        if (left.property.name === 'Interface') {
          path?.remove();
        }
      }
    }
  });

  // 从修改后的 AST 生成新的源代码
  const codeWithoutInterface = BabelGenerateSourceCode(clonedAST).code;
  // if (interfacePath) {
  //   console.log('interfacePathinterfacePathinterfacePathinterfacePathinterfacePath', interfacePath.node)
  //   interfacePath.replaceWith(interfacePath.node);
  // }

  // 创建 ResourceCode 赋值并生成最终代码
  if (defaultExportName) {
    // 创建一个新的赋值表达式节点
    const newAssignmentExpression = t.assignmentExpression(
      "=",
      t.memberExpression(t.identifier(defaultExportName), t.identifier("ResourceCode")),
      t.stringLiteral(codeWithoutInterface)
    );
    // 插入新的赋值表达式
    AST.program.body.push(newAssignmentExpression);
  }

  // 生成最终代码
  const finalCode = BabelGenerateSourceCode(AST, {}).code;
  // console.log("finalCode.code", finalCode);

  asyncCallback(null, finalCode);
};

/** 
 * 方法的执行时机是在请求的资源被加载之前
 * @param {string} filePath 请求的资源路径 (remainingRequest)
 * @param {string} loaderPath 之前链中的 loader 路径 (precedingRequest)
 * @param {string} data loader本身的数据对象 (data)
 * 
*/
ReactResourceCodeLoader.pitch = function (filePath, loaderPath, data) {
  // console.log('---------- pitch function')
  defaultExportName = null;
  interfacePath = null;
};

module.exports = ReactResourceCodeLoader;