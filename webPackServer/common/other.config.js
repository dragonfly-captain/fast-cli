const { pathJoin } = require("../../common/utils/path");
const { getwebpropath } = require("./utils");
// console.log('getpropath', getpropath('.'), pathJoin("./crootProject", "/Users/jiayou/Desktop/work/FrontEnd"));
function fileOptionName(type = "asset", key, maxSize, hash = "[name].[contenthash:7][ext]") {
  const opts = {
    type,
    generator: {
      filename: `${key}/${hash}`
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
  // url-loader
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
  // context: pathJoin("./crootProject", "/Users/jiayou/Desktop/work/FrontEnd")
  // node自带的模块，不需要安装，但有时候在实际项目中引入有可能出现报错，所以可以在此设置
  // node: {
  //   setImmediate: false,
  //   dgram: "empty",
  //   fs: "empty",
  //   net: "empty",
  //   tls: "empty",
  //   child_process: "empty"
  // }
};
