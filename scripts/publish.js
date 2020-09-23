#!/usr/bin/env node

const shell = require("shelljs")
const { join, resolve } = require("path")
const { fork } = require("child_process")

if (
  shell
    .exec("cnpm config get registry")
    .stdout.indexOf("http://registry.smartcinema.com.cn/") === -1
) {
  console.error(
    "Failed: set cnpm registry to http://registry.smartcinema.com.cn/ first",
  )
  process.exit(1)
}

const cwd = process.cwd()
const ret = shell.exec(`${resolve("./node_modules/.bin/lerna")} changed`).stdout

const updatedRepos = ret
  .split("\n")
  .map(line => line.replace("- ", ""))
  .filter(line => line !== "")

if (updatedRepos.length === 0) {
  console.log("No package is updated.")
  process.exit(0)
}

const cp = fork(
  join(process.cwd(), "node_modules/lerna/cli.js"),
  ["version", "--no-push"].concat(process.argv.slice(2)),
  {
    stdio: "inherit",
    cwd: process.cwd(),
  },
)

cp.on("error", (err) => {
  console.log(err)
})

cp.on("close", (code) => {
  console.log("code", code)
  if (code === 1) {
    console.error("Failed: lerna publish")
    process.exit(1)
  }

  publishToNpm()
})

function publishToNpm() {
  console.log(`repos to publish: ${updatedRepos.join(", ")}`)
  updatedRepos.forEach((repo) => {
    shell.cd(join(cwd, "packages", repo))
    const { version } = require(join(cwd, "packages", repo, "package.json"))
    if (
      version.includes("-rc.") ||
      version.includes("-beta.") ||
      version.includes("-alpha.")
    ) {
      console.log(`[${repo}] npm publish --tag next`)
      shell.exec(`cnpm publish --tag next`)
    } else {
      console.log(`[${repo}] npm publish`)
      shell.exec(`cnpm publish`)
    }
  })
}
