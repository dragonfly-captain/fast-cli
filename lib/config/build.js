const glob = require('glob');
const Terser = require('terser');
const fs = require('fs');
const path = require('path');

const inputPattern = './{bin,lib,common,template}/**/*.js';
const outputDir = './dist';
const ignorePattern = [
  '**/node_modules/**',
  './node_modules/**',
  './{bin,lib,common,template}/node_modules/**'
];

glob(inputPattern, { ignore: ignorePattern }, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }
  files.forEach((file) => {
    const code = fs.readFileSync(file, 'utf8');
    Terser.minify(code).then((result) => {
      const relativePath = path.relative('.', file);
      const outputPath = path.join(outputDir, relativePath);
      fs.mkdirSync(path.dirname(outputPath), { recursive: true });
      fs.writeFileSync(outputPath, result.code, 'utf8');
      console.log(`Minified ${file} to ${outputPath}`);
    }).catch((error) => {
      console.error(`Error minifying ${file}: ${error}`);
    });
  });
});
