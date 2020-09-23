"use strict"

const path = require("path")

const nunjucks = require("nunjucks")

const FileLoader = require("./file_loader")

const createHelper = require("./helper")

const LOAD_FILTER = Symbol("OpsEnvironment#loadFilter")


class OpsEnvironment extends nunjucks.Environment {
  constructor(app) {
    const fileLoader = new FileLoader(app)
    super(fileLoader, app.config.nunjucks)

    this.app = app

    this[LOAD_FILTER]()

    nunjucks.lib.escape = app.Helper.prototype.escape

    const originMemberLookup = nunjucks.runtime.memberLookup
    nunjucks.runtime.memberLookup = function (...args) {
      const val = args[1]
      if (val === "prototype" || val === "constructor") return null
      return originMemberLookup(...args)
    }

    this.ViewHelper = createHelper(app, this.filters)
  }

  /**
   * clean template cache
   * @param {String} [name] - full path
   * @return {Number} clean count
   */
  cleanCache(name) {
    let count = 0
    for (const loader of this.loaders) {
      if (name) {
        // support full path && tpl name
        if (loader.cache[name]) {
          count++
          loader.cache[name] = null
        }
      } else {
        for (const key in loader.cache) {
          if (Object.prototype.hasOwnProperty.call(loader.cache, key)) {
            count++
            loader.cache[key] = null
          }
        }
      }
    }
    return count
  }

  [LOAD_FILTER]() {
    for (const unit of this.app.loader.getLoadUnits()) {
      const filterPath = resolveModule(path.join(unit.path, "app/extend/filter"))
      if (filterPath) {
        const filters = this.app.loader.loadFile(filterPath) || {}
        for (const key of Object.keys(filters)) {
          this.addFilter(key, filters[key])
        }
      }
    }
  }
}

function resolveModule(filepath) {
  try {
    return require.resolve(filepath)
  } catch (e) {
    return undefined
  }
}

module.exports = OpsEnvironment
