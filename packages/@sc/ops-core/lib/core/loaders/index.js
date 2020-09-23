"use strict"

const appWorkerLoaderExtend = require("./app-worker-loader")

module.exports = function (target) {
  appWorkerLoaderExtend(target)
}
