"use strict"

const path = require("path")

const DEPRECATE = Symbol("OpsApplication#deprecate")

module.exports = function (target) {
  /**
   * Application
   * @extends Egg.Application
   */
  class OpsApplication extends target.Application {
    constructor(options = {}) {
      super(options)
      this.logger.info(
        "[ops-app] app_worker started, pid is %s",
        process.pid
      )
    }

    get [Symbol.for("egg#eggPath")]() {
      return path.resolve(__dirname, "../../../")
    }

    get [Symbol.for("egg#loader")]() {
      return target.AppWorkerLoader
    }

    /**
     * depd API
     * @member {Function}
     * @since 1.0.0
     */
    get opsDeprecate() {
      if (!this[DEPRECATE]) {
        this[DEPRECATE] = require("depd")("ops")
      }
      return this[DEPRECATE]
    }
  }

  target.Application = OpsApplication
}
