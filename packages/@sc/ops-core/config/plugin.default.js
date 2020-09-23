"use strict"

module.exports = {

  /**
   * webpack plugin
   * @property {Boolean} enable - Default: true
   * @property {Array} env - Default: ['local']
   */
  webpack: {
    enable: true,
    package: "@sc/ops-webpack",
    env: ["local"],
  },

  nunjucks: {
    enable: true,
    package: "@sc/ops-egg-view",
  },
}
