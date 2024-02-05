const { merge } = require("webpack-merge");
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const ESLintPlugin = require("eslint-webpack-plugin");
const styleConfig = require("../../common/style.config");
const { dirnamePtah, execPtah, getGlobal } = require("../../common/utils/path");
const { resolveClientShare, resolveAppnameDir } = require("../../common/utils/joinPath");
const { pathJoin } = require("../../common/utils/path");

module.exports = merge(styleConfig, {
  resolve: {
    // 自动解析配置好的文件扩展名，依照配置的顺序解析。
    extensions: [".jsx", ".js", ".ts", ".tsx", ".json"],
  },
  stats: {
    errorDetails: true,
  },
  module: {
    rules: [
      {
        test: /\.(jsx|js)$/, // /\.(js|jsx)$/,
        enforce: "pre", // 确保代码被其他loader处理之前，先进行了ESLint检测。
        use: [
          {
            loader: "babel-loader",
            options: {
              // cacheDirectory: true,
              configFile: pathJoin('./babel.config.js', dirnamePtah())
            }
          },
          {
            loader: "eslint-loader",
            options: {
              configFile: pathJoin('./.eslintrc.js', dirnamePtah()),
            }
          },
        ],
        exclude: [
          pathJoin('./node_modules/', execPtah()),
          /node_modules/
        ],
        include: [
          pathJoin('./src', execPtah())
        ]
      },
      // {
      //   test: /\.(jsx|js)$/, // /\.(js|jsx)$/,
      //   use: [
      //     {
      //       loader: "babel-loader",
      //       options: {
      //         // cacheDirectory: true,
      //         configFile: pathJoin('./babel.config.js', dirnamePtah())
      //       }
      //     },
      //   ],
      //   exclude: /node_modules/,
      //   include: [
      //     pathJoin('./src', execPtah())
      //   ]
      // }
    ]
  },
  plugins: [
    /**
     * 可以自己扩展参数的设置
     * @param {array}  extensions 要检查的文件扩展名
     * @param {string} exclude 要排除的文件或目录
     * @param {string} eslintPath ESLint模块的路径
     * @param {string} overrideConfigFile 要覆盖的ESLint配置文件路径
     */
    // new ESLintPlugin({
    //   extensions: ['js', 'jsx', 'ts', 'tsx'],
    //   exclude: '/node_modules/',
    //   files: [pathJoin('./src/*', execPtah())],
    //   overrideConfig: require(pathJoin('./.eslintrc.js', dirnamePtah()))
    // }),
    new ReactRefreshWebpackPlugin()
  ]
});
