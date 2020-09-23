"use strict"

const path = require("path")

module.exports = appInfo => ({
  /**
   * current environment
   * @member {String} Config#env
   * @since 1.0.0
   */
  env: appInfo.env,

  /**
   * application name
   * @member {String} Config#name
   * @since 1.0.0
   */
  name: appInfo["app.name"],

  /**
   * The directory of server running.
   * You can find `application_config.json`
   * under it that is dumpped from `app.config`.
   * @member {String} Config#rundir
   * @default
   * @since 1.0.0
   */
  rundir: path.join(appInfo.baseDir, "run"),

  /**
   * source code of font-end application
   * @member {String} Config#src
   * @since 1.0.0
   */
  source: path.join(appInfo.baseDir, "src"),

  /**
   * dist code of font-end application
   * @member {String} Config#src
   * @since 1.0.0
   */
  dist: path.join(appInfo.baseDir, "dist"),

  /**
   * Framework config
   * @member {Object} Config#core
   * @property {String} name - framework name(eg. Name)，default to Ops
   */
  core: {
    name: "Ops",
  },

  /**
   * core enable middlewares, which will map to app.middlewares.x
   * @member {Array} Config#middleware
   */
  coreMiddleware: [
    "meta",
    "siteFile",
    "notfound",
    "bodyParser",
    "overrideMethod",
  ],

  view: {
    defaultViewEngine: "nunjucks",
    mapping: {
      ".tpl": "nunjucks",
    },
  },


  static: {
    prefix: "/",
    dir: [path.join(appInfo.baseDir, "app/public"), path.join(appInfo.baseDir, "dist")],
  },
})
