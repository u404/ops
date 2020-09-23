"use strict"

const Environment = require("./environment")

module.exports = (app) => {
  const viewPaths = app.config.view.root
  app.loggers.coreLogger.info("[ops-egg-view] loading templates from %j", viewPaths)

  const config = app.config.nunjucks
  config.noCache = !config.cache
  delete config.cache

  return new Environment(app)
}
