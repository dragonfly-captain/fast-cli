function reactPerformanceLoader(source) {
  const query = this.getOptions();
  const asyncCallback = this.async();
  console.log(query);

  asyncCallback(null, source);
};

reactPerformanceLoader.pitch = function (filePath, loaderPath, data) {

};

module.exports = reactPerformanceLoader;