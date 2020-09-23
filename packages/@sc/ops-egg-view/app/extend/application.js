"use strict"

const OPSVIEW = Symbol("app#nunjucks")

const engine = require("../../lib/engine")

module.exports = {
  get nunjucks() {
    if (!this[OPSVIEW]) {
      this[OPSVIEW] = engine(this)
    }
    return this[OPSVIEW]
  },

}
