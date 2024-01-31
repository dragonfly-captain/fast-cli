module.exports = function (babel) {
  const { types: t } = babel;
  return {
    visitor: {
      // 访问所有的赋值表达式
      AssignmentExpression(path) {
        // 检查左侧是否是 MemberExpression
        if (t.isMemberExpression(path.node.left)) {
          const left = path.node.left;

          // 检查左侧对象是否是标识符，且属性也是标识符
          if (t.isIdentifier(left.object) && t.isIdentifier(left.property)) {
            // 获取对象名和属性名
            const objectName = left.object.name;
            const propertyName = left.property.name;

            // 检查属性名是否是我们要剔除的属性
            if (propertyName === 'Interface' || propertyName === 'ResourceCode') {
              // 删除整个赋值表达式节点
              path.remove();
            }
          }
        }
      }
    }
  };
};