"use strict"

const path = require("path")

exports.framework = "@sc/ops-core"

exports.name = "@sc/ops-cli"

exports.port = 6001

exports.cmdName = "ops"

exports.root = path.join(__dirname, "../../")

exports.noInitUsageInfo = false
