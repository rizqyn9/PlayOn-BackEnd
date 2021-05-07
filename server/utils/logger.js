const figlet = require('figlet')
const chalk = require('chalk')
const gradient = require('gradient-string')


/**
 * Success => Green
 * Warn => Yellow
 * Err  => Red
 */
const log = {
    success : (_string) => {
        console.log(chalk.greenBright(_string))
    },
    warn : (_string) => {
        console.log(chalk.yellow(_string))
    },
    err : (_string) => {
        console.log(chalk.red(_string))
    },
    bg_success : (_string) => {
        console.log(chalk.black.bgGreen(_string))
    },
    bg_warn : (_string) => {
        console.log(chalk.black.bgYellow(_string))
    },
    bg_err : (_string) => {
        console.log(chalk.white.bgRed(_string))
    }
}

const test = () => {
    log.success("Okay")
    log.warn("Warn")
    log.err("fail")
    log.bg_err("Okay")
    log.bg_success("Okay")
    log.bg_warn("Warn")
}

module.exports = {
    init : (_string) => {
        console.log(
            gradient.summer(
                figlet.textSync(_string, {
                    font: "Epic",
                    horizontalLayout: "default",
                })
            )
        );
    },
   log,
   test
}
