const chalk=require('chalk')
const log=console.log

log(chalk.blue('\nhello')+'world'+chalk.red('!\n'))

log(chalk.blue.bgRed.bold('Hello world!\n'))

log(chalk.blue('Hello','word','Foo','bar','biz','baz\n'))

log(chalk.red('Hello',chalk.underline.bgBlue('word')+'!\n'))