
var program = require('commander')


program
  .name('xuyunxiang')
  .version('2.1.2', '    --version')
  .usage('[options] [dir]')
  .option('    --git', 'add .gitignore')
  .option('-f, --force', 'force on non-empty directory')
  .parse(process.argv)