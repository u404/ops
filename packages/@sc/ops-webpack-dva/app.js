"use strict"

module.exports = (app) => {
  // app.config.coreMiddleware.unshift('webpack')

  process.on("message", (msg) => {
    if (msg.action === "webpack-server-ready") {
      app.config.webpack.webpackServerPort = msg.data.port
      app.config.webpack.webpackServerAddress = msg.data.address
      app.emit("webpack-server-ready")
    }
  })

  process.send &&
    process.send({
      action: "ask-for-webpack-server-port",
      to: "agent",
    })
}
