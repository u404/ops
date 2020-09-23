"use strict"

const path = require("path")

module.exports = appInfo => ({
  webpack: {
    output: {
      path: "./dist",
      filename: "[name].js",
      chunkFilename: "[name].[hash:8].js",
      publicPath: "/",
    },

    resolve: {
      modules: ["node_modules"],
      extensions: [".json", ".js", ".jsx"],
      alias: {
        "@": path.resolve(appInfo.baseDir, "src"),
        _components: path.resolve(appInfo.baseDir, "src/components"),
        _layouts: path.resolve(appInfo.baseDir, "src/layouts"),
        _pages: path.resolve(appInfo.baseDir, "src/pages"),
        _assets: path.resolve(appInfo.baseDir, "src/assets"),
        _routes: path.resolve(appInfo.baseDir, "src/routes"),
        _utils: path.resolve(appInfo.baseDir, "src/utils"),
        _store: path.resolve(appInfo.baseDir, "src/store"),
        _next: path.resolve(appInfo.baseDir, "node_modules/@sc/lib-next/dist"),
      },
    },

    devServer: {
      headers: {
        "access-control-allow-origin": "*",
      },
    },
  },
})
