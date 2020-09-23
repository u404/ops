"use strict"


const debug = require("debug")("ops:webpack")
const helper = require("./lib/utils")

module.exports = (agent) => {
  agent.ready(() => {
    const { logger } = agent

    const webpackConfig = helper.getWebpackConfig(agent)
    debug("create webpack server with config: %O", webpackConfig)

    const devServerConfig = { ...webpackConfig.devServer }
    delete webpackConfig.devServer
    helper.startServer(webpackConfig, devServerConfig, logger, agent)

    process.stdin.resume()
    process.stdin.setEncoding("utf8")
    process.stdin.on("data", (data) => {
      data = `${data}`.trim().toLowerCase()

      if (data === "rs") {
        helper.restartServer(webpackConfig, devServerConfig, logger, agent)
      }
    })

    process.on("exit", () => {
      helper.closeServer(agent)
    })
  })
}
