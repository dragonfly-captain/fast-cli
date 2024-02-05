class InjectMutationObserverPlugin {
  constructor(options = {}) {
    // 初始化插件配置
    this.options = {
      ...options
    };
  }
  apply(compiler) {
    // 检测到HtmlWebpackPlugin的hooks
    compiler.hooks.compilation.tap('InjectMutationObserverPlugin', (compilation) => {
      const { warnings, errors } = compilation;
      const HtmlWebpackPlugin = require('html-webpack-plugin');
      const hooks = HtmlWebpackPlugin.getHooks(compilation);

      hooks.beforeEmit.tapAsync('InjectMutationObserverPlugin', (data, cb) => {
        // MutationObserver的JS代码
        const observerScript = `
<script>
(function() {
  let iframeObserver = null;
  const warningsCount = ${warnings.length};
  const errorsCount = ${errors.length};
  const obs = ["webpack-dev-server-client-overlay", "react-refresh-overlay"];
  const observer = new MutationObserver(function(mutations) {
    mutations.forEach(function(mutation) {
      mutation.addedNodes.forEach(function(node) {
        if (obs.includes(node.id) && !!errorsCount) {
          // 使用getComputedStyle来获取元素的最终样式
          observeIframe(node);
        }
      });
      mutation.removedNodes.forEach((node) => {
        if (obs.includes(node.id) && !!errorsCount) {
          // iframe 被删除时，断开观察
          if (iframeObserver) {
            iframeObserver.disconnect();
            iframeObserver = null; // 清理引用
            console.log('已断开 iframeObserver 的观察。');
          }
        }
    });
    });
  });

  observer.observe(document.body, { childList: true, subtree: true, attributes: true });
  
  function observeIframe(node) {
    // const style = window.getComputedStyle(node);
    // if (style.display === 'none' || style.visibility === 'hidden') {
    //   node.style.display = "block !important";
    // }
    // 确保之前的 observer 被正确断开
    if (iframeObserver) {
      iframeObserver.disconnect();
      iframeObserver = null;
    }
    iframeObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) {
          // 显示 iframe
          node.setAttribute("style",node.getAttribute('style')+" display:block !important;");
          // 出错必须修改
          const rootElement = document.querySelector('#root');
          if (rootElement) {
            while (rootElement.firstChild) {
              rootElement.removeChild(rootElement.firstChild);
            }
          }
        } else {
          
        }
      });
    }, {
      root: null,
      threshold: 0.1
    });

    iframeObserver.observe(node);
  }
})();
</script>
`;
        // 将observerScript注入到HTML中
        data.html += observerScript;
        cb(null, data);
      });
    });
  }
}

module.exports = InjectMutationObserverPlugin;

// const { execRootPath } = require("../../common/utils/path");

// class SuperLintReactPlugin {
//   constructor(options = {}) {
//     // 存储传递给插件的配置
//     this.options = options;
//   }
//   apply(compiler) {
//     compiler.hooks.emit.tapAsync('ClearCodeOnErrorPlugin', (compilation, callback) => {
//       const { warnings, errors } = compilation;
//       // 获取所有入口点
//       const entryPoints = compilation.entrypoints;
//       const entryName = this.options.entryName ?? "app"; // 你想要删除的入口名称

//       // 检查该入口是否存在
//       if (entryPoints.has(entryName)) {
//         const entryPoint = entryPoints.get(entryName);

//         // 获取该入口所有的chunk
//         entryPoint?.chunks?.forEach((chunk) => {
//           // 对于每个chunk，获取它生成的文件名
//           chunk.files?.forEach((fileName) => {
//             if (errors.length > 0) {
//               // 删除这些文件
//               // delete compilation.assets[fileName];
//               let isDelCode = Reflect.deleteProperty(compilation.assets, "fileName");
//               if (isDelCode) {

//               }
//             }
//           });
//         });
//       }

//       callback();
//     });
//     // compiler.hooks.afterEmit.tap('AfterEslintCheckPlugin', (compilation) => {
//     //   const { warnings, errors } = compilation;
//     //   if (errors.length > 0) {
//     //     console.log('ESLint 发现问题，执行自定义逻辑...');

//     //   }
//     //   if (warnings.length > 0) {

//     //   }
//     // });
//   }
// }

// module.exports = {
//   SuperLintReactPlugin
// }