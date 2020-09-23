"use strict"

class OpsView {
  constructor(ctx) {
    this.ctx = ctx
    this.app = ctx.app
    this.viewHelper = new this.app.nunjucks.ViewHelper(ctx)
  }

  render(name, props) {
    props.app = this.app
    props.helper = this.viewHelper
    return new Promise((resolve, reject) => {
      this.app.nunjucks.render(name, props, (err, result) => {
        if (err) return reject(err)
        resolve(result)
      })
    })
  }

  renderString(tpl, props) {
    props.app = this.app
    props.helper = this.viewHelper
    return new Promise((resolve, reject) => {
      this.app.nunjucks.renderString(tpl, props, (err, result) => {
        if (err) return reject(err)
        resolve(result)
      })
    })
  }
}

module.exports = OpsView
