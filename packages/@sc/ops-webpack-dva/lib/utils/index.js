const path = require("path")

const fs = require("fs")

const debug = require("debug")("ops:webpack")

const FallbackPort = require("fallback-port")

const { createCompiler, prepareUrls } = require("@sc/react-dev-utils/WebpackDevServerUtils")

// const _ = require("lodash")

const webpack = require("webpack")

const WebpackDevServer = require("webpack-dev-server")

const symbol = Symbol.for("webpackServer")

const openBrowser = require("@sc/react-dev-utils/openBrowser")

const getWebpackEntry = (app, dev = false) => {
  const { config } = app
  debug("current webpack plugin config: %j ", config.webpack)

  const appIndexJs = path.resolve(config.source, "index.js")

  const entry = [appIndexJs]
  dev && entry.unshift(require.resolve("@sc/react-dev-utils/webpackHotDevClient"))
  return entry
}

const getFieConfig = function (app) {
  const fieConfigFile = path.resolve(app.baseDir, "fie.config.js")

  if (fs.existsSync(fieConfigFile)) {
    return require(fieConfigFile)
  }
  return {}
}

function getAvaliablePort(defaultPort, app) {
  const fallback = new FallbackPort(defaultPort)
  const port = fallback.getPort()
  if (port !== defaultPort) {
    app.logger.warn(
      "[webpack] port %s is in used, use %s instead",
      defaultPort,
      port
    )
  }
  return port
}


const getWebpackConfig = (app) => {
  const loadFile = app.loader.loadFile.bind(app.loader)
  const isDev = app.config.env === "local"

  const entry = getWebpackEntry(app, isDev)
  debug("entry auto load as below:\n%o", entry)

  const defaultConfigPath = path.join(__dirname, `../../config/webpack/webpack.config.js`)
  const webpackConfig = loadFile(defaultConfigPath, app, entry, isDev)

  return webpackConfig
}


// const dumpWebpackConfig = function (agent, config) {
//   const { rundir } = agent.config

//   try {
//     if (!fs.existsSync(rundir)) fs.mkdirSync(rundir)

//     const file = path.join(rundir, `webpack.${agent.config.env}.json`)
//     fs.writeFileSync(
//       file,
//       JSON.stringify(
//         config,
//         (key, val) => {
//           if (val !== null && typeof val === "object" && !Array.isArray(val)) {
//             const type = val.constructor.name || "Unknown"
//             if (type === "RegExp") {
//               return val.toString()
//             }

//             if (type !== "Object") {
//               return Object.assign({
//                 [`<${type}>`]: _.toPlainObject(val),
//               })
//             }
//           }
//           return val
//         },
//         2
//       )
//     )
//   } catch (err) {
//     agent.logger.warn(`dumpConfig error: ${err.message}`)
//   }
// }

const startServer = (webpackConfig, devServerConfig, logger, agent) => {
  if (agent[symbol]) {
    throw new Error("Multi webpack dev server instance found")
  }

  const protocol = devServerConfig.https ? "https" : "http"
  const urls = prepareUrls(protocol, devServerConfig.host, devServerConfig.port)
  const compiler = createCompiler(webpack, webpackConfig, agent.config.name, urls, false)

  const devServer = new WebpackDevServer(compiler, devServerConfig)

  devServer.middleware.waitUntilValid(() => {
    const target = prepareUrls(protocol, devServerConfig.host, 6001)
    logger.info("[webpack] webpack server start, listen on port: %s", devServerConfig.port)
    process.send({ action: "webpack-server-ready", to: "app", data: { port: devServerConfig.port, address: urls.localUrlForBrowser } })
    openBrowser(target.localUrlForBrowser)
    const portMessageHandler = (info) => {
      if (info.action === "ask-for-webpack-server-port") {
        process.send({
          action: "webpack-server-ready",
          to: "app",
          data: { port: devServerConfig.port, address: urls.localUrlForBrowser },
        })
      }
    }

    process.on("message", portMessageHandler)
    devServer._removeListener = function () {
      process.removeListener("message", portMessageHandler)
    }
  })
  devServer.listen(devServerConfig.port, devServerConfig.host, (err) => {
    if (err) {
      logger.error("[ops-agent] webpack server start failed,", err)
    }
  })
  agent[symbol] = devServer
  // dumpWebpackConfig(agent, { ...webpackConfig, devServer: devServerConfig })
}


const closeServer = function (agent) {
  if (agent[symbol]) {
    const server = agent[symbol]
    server.close()
    agent[symbol] = null
    server._removeListener && server._removeListener()
  }
}

const restartServer = function (webpackConfig, devConfig, logger, agent) {
  logger.info("[webpack-dev-server] auto restart")
  closeServer(agent)
  startServer(webpackConfig, devConfig, logger, agent)
}


exports.getFieConfig = getFieConfig
exports.getWebpackConfig = getWebpackConfig
exports.restartServer = restartServer
exports.closeServer = closeServer
exports.startServer = startServer
exports.getAvaliablePort = getAvaliablePort
