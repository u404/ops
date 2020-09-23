#!/usr/bin/env node

"use strict"

const process = require("process")

const { argv } = require("argh")

const fs = require("fs-extra")

const chalk = require("chalk")

const path = require("path")

const builder = require("../lib/builder")

const { framework } = argv

const { Application } = require(framework)

const Loader = require(framework).AppWorkerLoader

process.env.EGG_SERVER_ENV = "local"

Loader.prototype.load = function () { }

const app = new Application({
  baseDir: process.cwd(),
  workers: 1,
})

app.config.env = "prod"

fs.emptyDirSync(app.config.dist)

const compiler = builder(app)

compiler.run((err, stats) => {
  if (err) {
    app.coreLogger.error(err)
    process.exit(1)
  }

  if (stats) {
    fs.writeFileSync(path.join(process.cwd(), ".stats"), stats)
    console.log(
      stats.toString({
        colors: true,
        children: false,
      })
    )
  }

  console.log(chalk.green("\nCompiled successfully.\n"))

  app.close()
})
