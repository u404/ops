"use strict"

const { concatUrl, normalizeUrl } = require("./utils")

module.exports = (app, buildInFilters) => {
  /**
   * OpsViewHelper extends {@link Helper} for nunjucks templates.
   * Wrap some helpers for safe string, and transform build-in filters to helpers
   */
  class OpsViewHelper extends app.Helper {
    /**
     * See {@link Helper#shtml}
     * @param {String} str - the string that will be transformed to safe html
     * @return {String} str - the result
     */
    shtml(str) {
      return this.safe(super.shtml(str))
    }

    /**
     * See {@link Helper#surl}
     * @param {String} str - the string that will be transformed to safe url
     * @return {String} str - the result
     */
    surl(str) {
      return this.safe(super.surl(str))
    }


    /**
     * See {@link Helper#sjs}
     * @param {String} str - the string that will be transformed to safe js
     * @return {String} str - the result
     */
    sjs(str) {
      return this.safe(super.sjs(str))
    }

    /**
     * don't use `super.helper.escape` directly due to `SafeString` checking
     * see https://github.com/mozilla/nunjucks/blob/master/src/filters.js#L119
     * buildInFilters.escape is `nunjucks.filters.escape` which will call `nunjucks.lib.escape`
     * and `nunjucks.lib.escape` is overrided by `app.Helper.escape` for better performance
     * @param {String} str - the string that will be escaped
     * @return {String} str - the result
     */
    escape(str) {
      return buildInFilters.escape(str)
    }

    /**
     * get hidden filed for `csrf`
     * @return {String} html string
     */
    csrfTag() {
      return this.safe(`<input type="hidden" name="_csrf" value="${this.ctx.csrf}" />`)
    }

    /**
   * @param {String} filename asset file name
   * @param {Object} config asset config
   */
    [Symbol.for("ops#asset")](filename, config) {
      const { assetPath, assetHost } = config

      if (!assetHost) {
        if (app.config.env === "local" && app.config.webpack.webpackServerAddress) {
          return concatUrl(app.config.webpack.webpackServerAddress, assetPath, filename)
        }
        return concatUrl(assetPath, filename)
      }

      if (/^(http:|https:)?\/\//i.test(assetHost)) {
        return concatUrl(assetHost, assetPath, filename)
      }

      return normalizeUrl(
        `${this.ctx.protocol}://${concatUrl(assetHost, assetPath, filename)}`
      )
    }

    asset(filename) {
      return this[Symbol.for("ops#asset")](filename, app.config.nunjucks)
    }
  }

  // fill view helper with nunjucks build-in filters
  for (const key in buildInFilters) {
    if (OpsViewHelper.prototype[key] == null) {
      OpsViewHelper.prototype[key] = buildInFilters[key]
    }
  }

  return OpsViewHelper
}
