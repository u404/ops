"use strict"

const path = require("path")

const { Command } = require("egg-bin")

const { log, configs } = require("./lib/helper")

const pkg = require(`${configs.root}package.json`)

class OpsCLI extends Command {
  constructor(rawArgv) {
    super(rawArgv)

    this.usage = `Usage: ${configs.cmdName} [command] [options]`

    this.load(path.join(__dirname, "lib/commands"))

    log.info(`v${pkg.version}`)
  }
}

module.exports = OpsCLI
