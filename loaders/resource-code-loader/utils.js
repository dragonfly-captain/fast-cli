const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;

function BabelParserSourceCode(sourceCode = '') {
  const ast = parser.parse(sourceCode, {
    sourceType: 'module', // 由于代码是 ES 模块，因此设置 sourceType 为 'module'
    plugins: [
      // 根据需要添加任何必要的插件
      'jsx'
    ]
  });

  return ast;
}

function BabelTraverseSourceCode(ast, config = {}) {
  traverse(ast, config);
}

function BabelGenerateSourceCode(ast, sourceCode) {
  const output = generate(ast, {
    /* 选项 */
  }, sourceCode);

  return output
}

module.exports = {
  BabelParserSourceCode,
  BabelTraverseSourceCode,
  BabelGenerateSourceCode
};