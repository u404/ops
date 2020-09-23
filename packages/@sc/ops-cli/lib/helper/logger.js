"use strict"

const chalk = require("chalk")

class Logger {
  constructor() {
    this.prefix = chalk.blue("[@sc/ops-cli] ")
  }

  info(...args) {
    args[0] = this.prefix + args[0]
    console.log(...args)
  }

  warn(...args) {
    args[0] = this.prefix + chalk.yellow(`warn ${args[0]}`)
    console.log(...args)
  }

  error(...args) {
    args[0] = this.prefix + chalk.red(`error ${args[0]}`)
    console.log(...args)
  }
}

module.exports = new Logger()
