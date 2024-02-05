const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const { getGlobal } = require("./utils/path");

const isProduction = getGlobal('isProduction');

function stylePlugin() {
  return isProduction ? MiniCssExtractPlugin.loader : "style-loader";
};

module.exports = {
  module: {
    rules: [{
      test: /\.css$/,
      use: [
        stylePlugin(),
        {
          loader: "css-loader",
          options: {
            importLoaders: 1, // 回头找loader执行
            esModule: false // 直接返回css语法，不进行es module转译。
          }
        },
        "postcss-loader"
      ]
    }, {
      test: /\.less$/,
      use: [
        stylePlugin(),
        {
          loader: "css-loader",
          options: {
            importLoaders: 2,
            // esModule: true, // 使用 ES 模块导入 CSS，可以让tree shaking更好的工作。
            modules: {
              localIdentName: '[path]_[local]_[hash:base64:5]'
            }
          }
        },
        "postcss-loader",
        {
          loader: 'less-loader',
          options: {
            lessOptions: {
              javascriptEnabled: true
            }
          }
        }
      ]
    }]
  }
};
