const fs = require('fs');
const adjustMD = require('..');

function copyFile(filename) {
  fs.writeFileSync(`dist/${filename}`, fs.readFileSync(filename));
}

copyFile('package.json');

adjustMD({
  filename: 'README.md',
  destname: 'dist/README.md',
  filterSection: ['CHANGELOG']
});

console.log('\n release done.');