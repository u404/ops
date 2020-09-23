"use strict"

const path = require("path")

const webpack = require("webpack")

const ModuleNotFoundPlugin = require("@sc/react-dev-utils/ModuleNotFoundPlugin")

const ManifestPlugin = require("webpack-manifest-plugin")

const validKey = ["amd", "bail", "cache", "context", "dependencies", "devServer", "devtool", "entry", "externals", "loader", "mode", "module", "name", "node", "optimization", "output", "parallelism", "performance", "plugins", "profile", "recordsInputPath", "recordsOutputPath", "recordsPath", "resolve", "resolveLoader", "serve", "stats", "target", "watch", "watchOptions"]

const webpackMerge = require("webpack-merge")

const ignoredFiles = require("@sc/react-dev-utils/ignoredFiles")

const errorOverlayMiddleware = require("@sc/react-dev-utils/errorOverlayMiddleware")

const evalSourceMapMiddleware = require("@sc/react-dev-utils/evalSourceMapMiddleware")

const noopServiceWorkerMiddleware = require("@sc/react-dev-utils/noopServiceWorkerMiddleware")

const { prepareUrls } = require("@sc/react-dev-utils/WebpackDevServerUtils")

const debug = require("debug")("ops:webpack")

const helper = require("../../lib/utils")

const utils = require("./utils")

module.exports = (app, entry, dev) => {
  const fieConfig = helper.getFieConfig(app)
  const webpackConfig = webpackMerge(app.config.webpack, fieConfig)

  for (const key of Object.keys(webpackConfig)) {
    if (validKey.indexOf(key) === -1) {
      delete webpackConfig[key]
    }
  }

  const { output } = webpackConfig
  if (!path.isAbsolute(output.path)) {
    output.path = path.join(app.baseDir, output.path)
  }

  const module = {
    strictExportPresence: true,
  }

  const plugins = [
    new ModuleNotFoundPlugin(app.baseDir),
    new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/),
    new ManifestPlugin({
      fileName: "asset-manifest.json",
      publicPath: output.publicPath,
    }),
  ]


  if (dev) {
    const { devServer } = webpackConfig
    devServer.port = helper.getAvaliablePort(devServer.port || 6002, app)
    devServer.host = devServer.host || "0.0.0.0"
    const protocol = devServer.https ? "https" : "http"
    const urls = prepareUrls(protocol, devServer.host, devServer.port)
    devServer.public = urls.lanUrlForConfig
    output.publicPath = utils.concatUrl(urls.localUrlForBrowser, output.publicPath)
    devServer.publicPath = output.publicPath

    debug("webpack devServer public :%o", devServer.public)
  }

  const defaultConfig = {
    bail: !dev,
    mode: dev ? "development" : "production",
    devtool: dev ? "eval" : false,
    context: app.config.baseDir,
    entry,
    output,
    module,
    plugins,

    externals: {
      react: "React",
      "react-dom": "ReactDOM",
    },

    node: {
      dgram: "empty",
      fs: "empty",
      net: "empty",
      tls: "empty",
      child_process: "empty",
    },

    performance: false,

    devServer: {
      disableHostCheck: true,
      compress: true,
      clientLogLevel: "none",
      contentBase: app.config.dist,
      watchContentBase: true,
      hot: true,
      quiet: true,
      watchOptions: {
        ignored: ignoredFiles(app.config.source),
      },
      overlay: false,
      historyApiFallback: {
        disableDotRule: true,
      },
      before(agent, server) {
        agent.use(evalSourceMapMiddleware(server))
        agent.use(errorOverlayMiddleware())
        agent.use(noopServiceWorkerMiddleware())
      },
    },
  }

  return webpackMerge(defaultConfig, webpackConfig)
}
