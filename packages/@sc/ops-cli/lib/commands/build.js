"use strict"

const fs = require("fs")

const path = require("path")

const debug = require("debug")("ops-cli")

const { Command } = require("egg-bin")

const { getArgvWithDefaultFramework, log, configs } = require("../helper")

const { framework, cmdName } = configs

module.exports = class BuildCMD extends Command {
  constructor(rawArgv) {
    const argv = getArgvWithDefaultFramework(rawArgv)

    super(argv)

    this.usage = `Usage: ${cmdName} build [options]`

    this.options = {
      target: {
        description: "build target, node or browser",
        alias: "t",
        type: "string",
      },
    }
  }

  get description() {
    return "Build ops assets"
  }

  async run(context) {
    const buildPaths = [
      path.join(context.cwd, "node_modules/@sc/ops-webpack/bin/build.js"),
      path.join(__dirname, "../../../@sc/ops-webpack/bin/build.js"),
      () => require.resolve("@sc/ops-webpack/bin/build"),
    ]
    const buildBin = buildPaths.find(p => fs.existsSync(typeof p === "function" ? p() : p))
    if (!buildBin) {
      log.error(
        `Add "${framework}" as your package dependency before run build command`
      )
      return
    }
    const options = {
      execArgv: context.execArgv,
      env: Object.assign({ NODE_ENV: "production" }, context.env),
    }
    debug("%s %j", buildBin, context)
    await this.helper.forkNode(buildBin, context.rawArgv, options)
  }
}
