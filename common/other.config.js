const webpackMicroConfig = require("./micro.config");
const { pathJoin } = require("./utils/path");
const { getwebpropath } = require("./utils/path");
function fileOptionName(type = "asset", key, maxSize, hash = "[name].[contenthash:7][ext]") {
  const opts = {
    type,
    generator: {
      filename: `${webpackMicroConfig.assetsPath}/${key}/${hash}`
    }
  };
  if (!!maxSize) {
    opts.parser = {
      dataUrlCondition: {
        // 等价 limit 设置
        maxSize: 10 * 1024
      }
    }
  }
  return opts
};

module.exports = {
  module: {
    rules: [{
      test: /\.(png|jpe?g|gif|svg)(\?.*)?$/, // 匹配图片文件
      ...fileOptionName("asset", "img", true)
    }, {
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)?$/, // 匹配音频文件
      ...fileOptionName("asset", "media", true)
    }, {
      test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/, // 匹配字体文件
      ...fileOptionName("asset/resource", "font")
    }]
  },
  // 用于从配置中解析入口起点
  context: pathJoin(".", getwebpropath('.'))
};
