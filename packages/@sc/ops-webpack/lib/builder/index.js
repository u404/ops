"use strict"

const webpack = require("webpack")

const helper = require("../utils")

module.exports = (app) => {
  const webpackConfig = helper.getWebpackConfig(app)

  delete webpackConfig.devServer

  const compiler = webpack(webpackConfig)

  return compiler
}
